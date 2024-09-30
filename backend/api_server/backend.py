from typing import Union # for definding the types that our functions take in and return, could be useful... or not idk

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Employee
from schemas import EmployeeCreate, EmployeeResponse

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(dependencies=[Depends(get_db)])

# this is to allow our react app to make requests to our fastapi app
origins = [
    'http://localhost:3000',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# test endpoint
@app.get("/test") # this is a decorator that tells fastapi to run the function below when a GET request is made to http://localhost:8000/test
def read_root():
    return "this is an epic gamer moment!"

### USER CRUD OPERATIONS ###

@app.get("/get/user/{user_id}")
def get_user(user_id: int):
    # make a call to our future database to get the user with the given user_id
    return {"user_id": user_id}

@app.post("/employee", response_model=EmployeeResponse)
def post_employee(employee: EmployeeCreate):
    db = next(get_db()) 
    db_employee = Employee(name=employee.name, email=employee.email, password=employee.password)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.put("/put/user/{user_id}")
def put_user(user_id: int, user: dict):
    # make a call to our future database to update the user with the given user_id
    return user

@app.delete("/delete/user/{user_id}")
def delete_user(user_id: int):
    # make a call to our future database to delete the user with the given user_id
    return {"user_id": user_id}

### PATIENT CRUD OPERATIONS ###

@app.get("/get/patient/{patient_id}")
def get_patient(patient_id: int):
    # make a call to our future database to get the patient with the given patient_id
    return {"patient_id": patient_id}

@app.post("/post/patient")
def post_patient(patient: dict):
    # make a call to our future database to add the patient to the database
    return patient

@app.put("/put/patient/{patient_id}")
def put_patient(patient_id: int, patient: dict):
    # make a call to our future database to update the patient with the given patient_id
    return patient

@app.delete("/delete/patient/{patient_id}")
def delete_patient(patient_id: int):
    # make a call to our future database to delete the patient with the given patient_id
    return {"patient_id": patient_id}
