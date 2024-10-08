# build a schema using pydantic

from typing import Optional
from pydantic import BaseModel, EmailStr


# region Users
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


# endregion
# region Prescriptions
class PrescriptionUpdate(BaseModel):
    # user_type: Optional[str] = None
    # email: Optional[EmailStr] = None
    # password: Optional[str] = None
    # is_locked_out: Optional[bool] = True
    patient_id: int
    user_entered_id: int
    user_filled_id: int
    # TODO: fix type
    # date_prescribed: Date
    date_prescribed: str
    # TODO: fix type
    filled_timestamp: str
    doctor_name: str
    dosage: str


# endregion
# region Medications




# endregion
# region Patients




