from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base  = declarative_base()

class Item(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)


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