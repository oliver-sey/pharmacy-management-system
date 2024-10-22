from sqlalchemy import Column, DateTime, Date, ForeignKey, Integer, String, Float, Boolean, Enum as SQLAlchemyEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
from sqlalchemy import Enum as SQLAlchemyEnum

from sqlalchemy import Column, Integer, String, Boolean, ARRAY
from sqlalchemy.orm import relationship
from .database import Base
from enum import Enum

class UserType(str, Enum):
    PHARMACY_MANAGER = "pharmacy manager"
    PHARMACY_TECHNICIAN = "pharmacy technician"
    CASHIER = "cashier"
    PHARMACIST = "pharmacist"


# renaming to clarify difference betweenPython's Enum and SQLAlchemy's Enum
from enum import Enum as PyEnum

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    user_type = Column(SQLAlchemyEnum(UserType), index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_locked_out = Column(Boolean, default=True)

    # A user can enter many prescriptions
    entered_prescriptions = relationship("Prescription", back_populates="user_entered", foreign_keys="[Prescription.user_entered_id]", cascade="all, delete-orphan")
    # A user can fill many prescriptions
    filled_prescriptions = relationship("Prescription", back_populates="user_filled", foreign_keys="[Prescription.user_filled_id]", cascade="all, delete-orphan")
    # A user can have many user activities
    user_activities = relationship("UserActivity", back_populates="user", cascade="all, delete-orphan")
    # A user can have many transactions
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")

class Patient(Base):
    __tablename__ = 'patients'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    date_of_birth = Column(Date)
    address = Column(String)
    phone_number = Column(String)
    email = Column(String, index=True, unique=True)
    insurance_name = Column(String)
    insurance_group_number = Column(String)
    insurance_member_id = Column(String)

    prescriptions = relationship("Prescription", back_populates="patient")
    transactions = relationship("Transaction", back_populates="patient")

class Prescription(Base):
    __tablename__ = 'prescriptions'

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=True)
    user_entered_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # User who typed in the prescription
    user_filled_id = Column(Integer, ForeignKey('users.id'), default=None, nullable=True)  # User who filled the prescription
    date_prescribed = Column(Date, default=func.current_date(), nullable=False)
    filled_timestamp = Column(DateTime, default=None, nullable=True)
    medication_id = Column(Integer, ForeignKey('medications.id'))  # Correct table reference
    doctor_name = Column(String)
    # not putting dosage here, since dosage is stored in the medication (which we can access through medication_id)
    # but we do need to know the quantity, i.e. how many pills the patient is allowed to have
    # quantity is the amount of pills the patient is allowed to have with this prescription
    quantity = Column(Integer)

    patient = relationship("Patient", back_populates="prescriptions")
    user_entered = relationship("User", back_populates="entered_prescriptions", foreign_keys="[Prescription.user_entered_id]")
    user_filled = relationship("User", back_populates="filled_prescriptions", foreign_keys="[Prescription.user_filled_id]")
    medication = relationship("Medication", back_populates="prescriptions")

class Medication(Base):
    __tablename__ = 'medications'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    # dosage is the strength of each pill, i.e. how much of the medicine is actually in it
    # if we have a medicine with 2 different dosage values, that needs to be stored as 2 different rows in medication
    dosage = Column(String)
    # quantity here is how many pills we have of this medication
    quantity = Column(Integer)
    prescription_required = Column(Boolean)
    expiration_date = Column(Date)
    dollars_per_unit = Column(Float)

    prescriptions = relationship("Prescription", back_populates="medication")
    inventory_updates = relationship("InventoryUpdate", back_populates="medication")

class UserActivity(Base):
    __tablename__ = 'user_activities'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    activity = Column(String)
    timestamp = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="user_activities")
    inventory_updates = relationship("InventoryUpdate", back_populates="user_activity", uselist=False)





# an enum class so we can restrict the set of possible values in the type column in inventory_updates
class InventoryUpdateType(PyEnum):
    ADD = "Add medication"
    DISCARD = "Discard medication"
    FILLPRESC = "Fill prescription"
    SELLNONPRESC = "Sell non-prescription item"


class InventoryUpdate(Base):
    __tablename__ = 'inventory_updates'

    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey('medications.id'))
    user_activity_id = Column(Integer, ForeignKey('user_activities.id'))
    # optional since they're not always associated with a transaction, e.g. on 'add' or 'discard'
    transaction_id = Column(Integer, ForeignKey('transactions.id'), nullable=True) # don't think we need this - Hsinwei
    # user_id = Column(Integer, ForeignKey('users.id')) # don't think we need this
    # don't need dosage, that's stored in medication
    # dosage = Column(String)
    # quantity changed by
    # TODO: are we doing this so it could be positive or negative?
    quantity_changed_by = Column(Integer)
    timestamp = Column(DateTime, default=func.now())
    # what action type it was, e.g. 'add', 'discard', 'fillpresc', or 'sellnonpresc'
    type = Column(SQLAlchemyEnum(InventoryUpdateType))
    medication = relationship("Medication", back_populates="inventory_updates")
    user_activity = relationship("UserActivity", back_populates="inventory_updates")  # Correct the relationship
    # transaction = relationship("Transaction", back_populates="inventory_update")

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    patient_id = Column(Integer, ForeignKey('patients.id'))
    timestamp = Column(DateTime, default=func.now())
    payment_method = Column(String)

    patient = relationship("Patient", back_populates="transactions")
    user = relationship("User", back_populates="transactions")
    # inventory_update = relationship("InventoryUpdate", back_populates="transaction")  # This should link to the correct attribute