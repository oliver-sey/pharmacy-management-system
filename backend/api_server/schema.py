# build a schema using pydantic

from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date, datetime

class SimpleResponse(BaseModel):
    message: str

# region Users
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    user_type: str
    email: EmailStr
    password: str
    is_locked_out: bool = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_type: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_locked_out: Optional[bool] = True

class UserDeleteResponse(BaseModel):
    message: str
    user_id: int

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: str
    address: str
    phone_number: str
    email: EmailStr
    insurance_name: str
    insurance_group_number: str
    insurance_member_id: str

class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    insurance_name: Optional[str] = None
    insurance_group_number: Optional[str] = None
    insurance_member_id: Optional[str] = None

class PatientResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    date_of_birth: str
    address: str
    phone_number: str
    email: EmailStr
    insurance_name: str
    insurance_group_number: str
    insurance_member_id: str

    class Config:
        orm_mode = True

    # this handles converting the date_of_birth from a datetime object to a string
    @staticmethod
    def from_orm(patient):
        # Ensure date_of_birth is converted to a string
        return PatientResponse(
            id=patient.id,
            first_name=patient.first_name,
            last_name=patient.last_name,
            date_of_birth=patient.date_of_birth.strftime('%Y-%m-%d'),  # Convert datetime to string
            address=patient.address,
            phone_number=patient.phone_number,
            email=patient.email,
            insurance_name=patient.insurance_name,
            insurance_group_number=patient.insurance_group_number,
            insurance_member_id=patient.insurance_member_id
        )

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    user_type: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
    
class MedicationCreate(BaseModel):
    name: str
    dosage: int
    quantity: int
    prescription_required: bool
    expiration_date: date
    dollars_per_unit: float

class MedicationResponse(MedicationCreate):
    id: int

    class Config:
        orm_mode = True

class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[int] = None
    quantity: Optional[int] = None
    prescription_required: Optional[bool] = None
    expiration_date: Optional[date] = None
    dollars_per_unit: Optional[float] = None

class PrescriptionResponse(BaseModel):
    id: int
    patient_id: int
    user_entered_id: int
    user_filled_id: Optional[int]
    date_prescribed: date
    filled_timestamp: Optional[datetime]
    medication_id: int
    doctor_name: str
    dosage: int

    class Config:  
        from_attributes = True 

class PrescriptionCreate(BaseModel):
    patient_id: int
    user_entered_id: int
    user_filled_id: Optional[int] = None
    filled_timestamp: Optional[datetime] = None
    medication_id: int
    doctor_name: str
    dosage: int

    class Config:
        orm_mode = True

class PrescriptionUpdate(BaseModel):
    patient_id: Optional[int] = None
    user_entered_id: Optional[int] = None
    user_filled_id: Optional[int] = None
    date_prescribed: Optional[date] = None
    filled_timestamp: Optional[date] = None
    medication_id: Optional[int] = None
    doctor_name: Optional[str] = None
    dosage: Optional[int] = None


class PrescriptionFillRequest(BaseModel):
    user_filled_id: int
    class Config:
        orm_mode = True