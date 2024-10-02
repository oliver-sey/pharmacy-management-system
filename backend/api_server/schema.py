# build a schema using pydantic

from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    user_type: str
    email: EmailStr
    password: str
    is_locked_out: bool = True

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