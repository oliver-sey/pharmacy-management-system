# build a schema using pydantic

from pydantic import BaseModel, EmailStr

class EmployeeCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True