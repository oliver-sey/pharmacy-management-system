from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

Base  = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    user_type = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_locked_out = Column(Boolean, default=True)

    prescriptions = relationship("Prescription", back_populates="user")
    user_activities = relationship("UserActivity", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")

class Patient(Base):
    __tablename__ = 'patients'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    date_of_birth = Column(DateTime)
    address = Column(String)
    phone_number = Column(String)
    email = Column(String, index=True, unique=True)
    insurance_name = Column(String)
    insurance_group_number = Column(String)
    insurance_member_id = Column(String) # is this unique?

    prescriptions = relationship("Prescription", back_populates="patient")
    transactions = relationship("Transaction", back_populates="patient")

class Prescription(Base):
    __tablename__ = 'prescriptions'

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    user_entered_id = Column(Integer, ForeignKey('users.id')) # user who typed in the prescription (must be a pharmacy technician or higher level)
    user_filled_id = Column(Integer, ForeignKey('users.id')) # user who filled the prescription (must be a pharmacist)
    date_prescribed = Column(DateTime, default=func.now())

    # prescription lifecycle: prescribed -> filled -> picked up
    # a doctor can prescribe a medication and have a pharmacist manually enter it into the system
    # a pharmacist can fill the presctiption
    # a patient can pick up the prescription
    filled_timestamp = Column(DateTime, default=func.now())
    medication = Column(Integer, ForeignKey('medications.id'))
    doctor_name = Column(String)
    dosage = Column(String)

    patient = relationship("Patient", back_populates="prescriptions")
    user = relationship("User", back_populates="prescriptions")
    medication = relationship("Medication", back_populates="prescriptions")

class Medication(Base):
    __tablename__ = 'medications'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    dosage = Column(String)
    quantity = Column(Integer)
    prescription_required = Column(Boolean)
    expiration_date = Column(DateTime)
    dollars_per_unit = Column(Float)

    prescriptions = relationship("Prescription", back_populates="medication")

class UserActivity(Base):
    __tablename__ = 'user_activities'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    activity = Column(String) # login, logout, enter prescription, fill presctiption
    timestamp = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="user_activities")

class InventoryUpdate(Base):
    __tablename__ = 'inventory_updates'

    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey('medications.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    quantity = Column(Integer)
    timestamp = Column(DateTime, default=func.now())

    medication = relationship("Medication", back_populates="inventory_updates")
    user_activity = relationship("UserActivity", back_populates="inventory_updates")
    transaction = relationship("Transaction", back_populates="inventory_updates")

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    timestamp = Column(DateTime, default=func.now())
    payment_method = Column(String)

    patients = relationship("Patient", back_populates="transactions", nullable=False)
    user = relationship("User", back_populates="transactions", nullable=False)
    inventory_update = relationship("InventoryUpdate", back_populates="transactions", nullable=False)