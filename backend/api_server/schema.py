# build a schema using pydantic

from typing import Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    user_type: str
    email: EmailStr
    password: str
    is_locked_out: bool = True

class UserUpdate(BaseModel):
    user_type: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_locked_out: Optional[bool] = True

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
    user_type: str
    email: str

class UserLogin(BaseModel):
    email: str
    password: str
    
class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True