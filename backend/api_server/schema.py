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