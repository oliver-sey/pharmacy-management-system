from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Employee(Base):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    user_type = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_locked_out = Column(Boolean, default=True)

    prescriptions = relationship("Prescription", back_populates="user")

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

class Prescription(Base):
    __tablename__ = 'prescriptions'

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    user_id = Column(Integer, ForeignKey('users.id')) # user who typed in the prescription
    date_prescribed = Column(DateTime, default=func.now())
    timestamp = Column(DateTime, default=func.now())
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
