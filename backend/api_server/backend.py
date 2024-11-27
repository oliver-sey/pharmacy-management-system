# region Imports and setup
from datetime import datetime, timedelta, timezone
from jose import JWTError
from typing import Annotated # for defining the types that our functions take in and return, could be useful... or not idk
import uvicorn
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, FastAPI, HTTPException, Query, status, Body, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from typing import Optional
from .database import SessionLocal, engine, Base
from .schema import (
    Token, TokenData, TransactionItemCreate, TransactionItemResponse, UserActivityCreate, UserCreate, UserEmailResponse, UserResponse, 
    UserLogin, UserSetPassword, UserToReturn, UserUpdate, PatientCreate, PatientUpdate, 
    PatientResponse, MedicationCreate, SimpleResponse, PrescriptionUpdate, InventoryUpdateCreate, 
    InventoryUpdateResponse, UserActivityResponse, TransactionResponse, TransactionCreate, MedicationUpdate
)
from . import models  # Ensure this is the SQLAlchemy model
from .models import UserActivity,InventoryUpdateType
from enum import Enum as PyEnum
from sqlalchemy.orm import Session, selectinload
from typing import List
from . import schema
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
import logging
import urllib

app = FastAPI()

# Create the database tables
Base.metadata.create_all(bind=engine)
# setup middleware
# app.middleware("http")(log_requests)


# this is to allow our react app to make requests to our fastapi app
# origins = [
#     'http://localhost:3000',
# ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# test endpoint
@app.get("/test") # this is a decorator that tells fastapi to run the function below when a GET request is made to http://localhost:8000/test
def read_root():
    return "this is an epic gamer moment!"


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#-----authentication values-------
SECRET_KEY = "90FA9871DC0E001369671A27F90A0213"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Token is invalid or expired")
        print(payload)
        return payload
        
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)],
                            db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # print(f"Received token: {token}")  # Print the token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        print("Invalid token", token)
        raise HTTPException(status_code=400, detail="token is invalid")
    user = db.query(models.User).filter(models.User.email == token_data.username).first()
    current_user = UserToReturn(id=user.id, email=user.email, user_type=user.user_type)
    if user is None:
        raise HTTPException(status_code=404, detail="get_current_user user not found")
    
    return current_user

# validate user type
def validate_user_type(current_user, allowed_user_types: list):
    if current_user.user_type not in allowed_user_types:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"User of type '{current_user.user_type}' is not authorized to perform this action",
        )
    
@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
) -> Token:
    
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/verify-token/{token}")
async def verify_user_token(token: str):
    verify_token(token=token)
    return {'message': 'Token is valid.'}


@app.get("/currentuser/me/", response_model=UserToReturn)
async def read_users_me(
    current_user:  Annotated[UserToReturn ,Depends(get_current_user)],
):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[UserToReturn, Depends(get_current_user)],
):
    return [{"item_id": "Foo", "owner": current_user.email}]



#--------- Reset Password ---------
@app.post("/resetpassword")
async def reset_password(
    newPassword: Annotated[str, Body(..., embed=True)],
    currentUser: Annotated[UserToReturn, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    if not newPassword:
        raise HTTPException(status_code=400, detail="Password is required")
    
    # Checks that password is valid
    # if len(newPassword) < 8:
    #     raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    # if not any(char.isdigit() for char in newPassword):
    #     raise HTTPException(status_code=400, detail="Password must contain at least one number.")
    # if not any(char.isupper() for char in newPassword):
    #     raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter.")
    # if not any(char.islower() for char in newPassword):
    #     raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter.")
    # if not any(char in "!@#$%^&*()_+" for char in newPassword):
    #     raise HTTPException(status_code=400, detail="Password must contain at least one special character.")

    # Hash the new password
    hashedPassword = get_password_hash(newPassword)

    
    user = db.query(models.User).filter(models.User.id == currentUser.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.password = hashedPassword
    db.commit()

    return {"message": "Password has been successfully reset."}


# # configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger("pharmacy_logger")

# def determine_activity_type(request: Request):
#     '''
#     Determines the type of activity based on the endpoint that was called
#     '''
#     logger.info(f"Request Path: {request.url.path}, Request Method: {request.method}")
#     logger.info(f"patients in path {'patients' in request.url.path}")
#     logger.info(f"method == post: {request.method == 'POST'}")
#     if "user" in request.url.path:
#         if request.method == "POST":
#             return models.UserActivityType.CREATE_USER
#         elif request.method == "PUT":
#             return models.UserActivityType.UPDATE_USER
#         elif request.method == "DELETE":
#             return models.UserActivityType.DELETE_USER
        
#     elif "patient" in request.url.path:
#         if request.method == "POST":
#             return models.UserActivityType.CREATE_PATIENT
#         elif request.method == "PUT":
#             return models.UserActivityType.UPDATE_PATIENT
#         elif request.method == "DELETE":
#             return models.UserActivityType.DELETE_PATIENT
    
#     elif "prescription" in request.url.path:
#         if request.method == "POST":
#             return models.UserActivityType.CREATE_PRESCRIPTION
    
#     elif "medication" in request.url.path:
#         if request.method == "POST":
#             return models.UserActivityType.CREATE_MEDICATION
#         elif request.method == "PUT":
#             return models.UserActivityType.UPDATE_MEDICATION
#         elif request.method == "DELETE":
#             return models.UserActivityType.DELETE_MEDICATION

#     else:
#         return models.UserActivityType.OTHER   

# # middleware for logging 
# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     '''
#     middleware for logging. 
#     '''
#     # these types of requests dont need to be logged. 
#     # only requests that change something should be logged in
#     # as well as login and logout
    
    
#     db: Session = SessionLocal()
#     logger.info(f"Request Path: {request.url.path}")
#     if request.url.path in ("/token"):
#         # check if a user is loggin in 
#         logger.info(f"logging in: {request.url.path}")
#          # Read the request body only once and store it
#         request_body = await request.body()
#         parsed_data = urllib.parse.parse_qs(request_body.decode())
#         email = parsed_data.get("username", [None])[0]
#         user = db.query(models.User).filter(models.User.email == email).first()
#         request = Request(request.scope, receive=lambda: request_body)
#         response = await call_next(request)
#         if request.url.path == "/token" and response.status_code == 200:

#             db_user_activity = models.UserActivity(
#                 user_id=user.id,
#                 activity_type=models.UserActivityType.LOGIN,
#                 timestamp=datetime.now(timezone.utc) # set the timestamp in UTC so timezones don't affect it
#             )

#             db.add(db_user_activity)
#             db.commit()
#             db.refresh(db_user_activity)
            
#         return response
#     elif "/verify-token/" in request.url.path:
#         # check if a user is verifying their token
#         logger.info(f"verifying token: {request.url.path}")
#         response = await call_next(request)
#         return response
#     elif "/currentuser/me/" in request.url.path:
#         #skip the log
#         logger.info(f"current user: {request.url.path}")
#         response = await call_next(request)
#         return response
#     elif request.method == "GET":
#         response = await call_next(request)
#         return response
#     else:
#         logger.info(f"request.headers: {request.headers.keys()}") 
#         token = request.headers.get("Authorization")
#         logger.info(f"token: {token}")
#         if token:
#             token = token.split(" ")[1]  # Remove 'Bearer' prefix
#         current_user = get_current_user(token, db)
#         logger.info(f"User (id={current_user.id}): {current_user.email} is making a request to {request.url.path} as a {current_user.user_type} ")
#         if request.method == "GET" :
#             # check if the request is a get. i.e. not changing anything
#             logger.info(f"GET request: {request.url.path}")
#             # rebuild request
#             request = Request(request.scope, receive=request.body)

#             response = call_next(request)
#             return response

#         try:
#             # Log incoming request details
#             logger.info(f"Received request: {request.method} {request.url}")

#             response = await call_next(request)

#             # Log successful response
#             logger.info(f"Completed request with status code: {response.status_code}")
#             activity_type = determine_activity_type(request)
#             logger.info(f"Activity Type: {activity_type}")
            
#             # Log this information to the database
#             db_user_activity = models.UserActivity(
#                 user_id=current_user.id,
#                 activity_type=activity_type,
#                 timestamp=datetime.now(timezone.utc) # set the timestamp in UTC so timezones don't affect it
#             )

#             db.add(db_user_activity)
#             db.commit()
#             db.refresh(db_user_activity)

#             return response
#         except SQLAlchemyError as e: # if there is an error with the database / ORM
#             logger.error(f"Database error occurred: {str(e)}")

#             # Insert log entry to database for DB errors
#             db_user_activity = models.UserActivity(
#                 user_id=current_user.id,
#                 activity_type=determine_activity_type(request),
#                 timestamp=datetime.now(timezone.utc) # set the timestamp in UTC so timezones don't affect it
#             )

#             db.add(db_user_activity)
#             db.commit()
#             db.refresh(db_user_activity)
#             # Re-raise error after logging
#             raise e  
#         except Exception as e: # if there is any other error
#             logger.error(f"An error occurred: {str(e)}")

#             # Insert log entry to database for other errors
#             db_user_activity = models.UserActivity(
#                 user_id=current_user.id,
#                 activity_type=determine_activity_type(request),
#                 timestamp=datetime.now(timezone.utc) # set the timestamp in UTC so timezones don't affect it
#             )

#             db.add(db_user_activity)
#             db.commit()
#             db.refresh(db_user_activity)

#             # Re-raise error after logging
#             raise e



# endregion
# region User CRUD
# POST endpoint to create a user
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    # validate_user_type(current_user, ["Pharmacy Manager"])
    # Check if the email already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    # if not create a new user
    user_data = user.model_dump()  # Get user data as dict

    # only set a password if one was passed
    # should mostly not get passed (like a manager making a password-less account for an employee)
    if user.password is not None:
        hashed_password = pwd_context.hash(user.password)
        user_data['password'] = hashed_password  # Set the hashed password

    db_user = models.User(**user_data)  # Now unpack user_data

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager"])

    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check for associated prescriptions
    prescriptions_count = db.query(models.Prescription).filter(
        (models.Prescription.user_entered_id == user_id) | 
        (models.Prescription.user_filled_id == user_id)
    ).count()

    if prescriptions_count > 0:
        raise HTTPException(status_code=400, detail="User cannot be deleted while having prescriptions")


    db.delete(db_user)
    db.commit()
    return SimpleResponse(message="User deleted successfully")


# *****an endpoint that doesn't need any authorization, since users who are in the process of setting
# their password (can't make a token yet) need to be able to call it

# only give the ability to set a password on a user that doesn't have a password yet
@app.put("/users/{user_id}/setpassword")
def set_user_password(user_id: int, user: UserSetPassword, db: Session = Depends(get_db)):
    # find the user by ID
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.password is not None:
        raise HTTPException(status_code=409, detail="User already has a password")
    
    # hash the password they provided
    db_user.password = pwd_context.hash(user.password)

    db.commit()
    db.refresh(db_user)
    return {"message": "Password successfully set, you can now log in", "user_id": user_id}


@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager"])

    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update only provided fields
    if user.first_name is not None:
        db_user.first_name = user.first_name
    if user.last_name is not None:
        db_user.last_name = user.last_name
    if user.user_type is not None:
        db_user.user_type = user.user_type
    if user.email is not None:
        db_user.email = user.email
    if user.password is not None:
        db_user.password = pwd_context.hash(user.password)  # Hashing the password if provided
    if user.is_locked_out is not None:
        db_user.is_locked_out = user.is_locked_out

    db.commit()
    db.refresh(db_user)
    return db_user


# *****an endpoint that doesn't need any authorization, since users who are in the process of setting
# their password (can't make a token yet) need to be able to call it

# get all users that don't have a password yet
# this gives a list of valid emails that can be entered on the setpassword page
@app.get("/userslist/new/", response_model=List[UserEmailResponse])
def list_new_users(db: Session = Depends(get_db)):

    # Query the database for all users with no password yet
    users = db.query(models.User).filter(models.User.password == None).all()
    

    return users



@app.get("/userslist", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])
    # Query all users from the database
    users = db.query(models.User).all()
    
    return users

# lock or recovery lock account, include a boolean query parameter to set lock or unlock
@app.put("/users/lock_status/{user_id}", response_model=UserResponse)
def change_user_lock_status(user_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    '''
    Locks or unlocks a user account based on the query parameter is_locked.
    '''
    validate_user_type(current_user, ["Pharmacy Manager"])
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    is_locked = not db_user.is_locked_out
    
    db_user.is_locked_out = is_locked  # Set is_locked_out based on query parameter
    db.commit()
    db.refresh(db_user)

    # create user activity if account is unlocked
    if is_locked == False:
        db_user_activity = models.UserActivity(
            user_id=user_id,
            activity_type=models.UserActivityType.UNLOCK_ACCOUNT,
            timestamp=datetime.now(timezone.utc) # set the timestamp in UTC so timezones don't affect it  
        )
        db.add(db_user_activity)
        db.commit()
        db.refresh(db_user_activity)

    return db_user

# endregion
# region Patient CRUD
#--------PATIENT CRUD OPERATIONS--------

@app.get("/patient/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db),current_user: UserToReturn = Depends(get_current_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    # fix the date_of_birth to be a string
    patient_to_return = PatientResponse.from_orm(patient)
    return patient_to_return

@app.get("/patients", response_model=List[PatientResponse])
def get_patients(db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    patients = db.query(models.Patient).all()
    # fix the date_of_birth to be a string
    patients = [PatientResponse.from_orm(patient) for patient in patients]
    return patients

@app.post("/patient")
def create_patient(patient: PatientCreate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    patient_data = patient.model_dump()
    email = patient_data['email']
    if db.query(models.Patient).filter(models.Patient.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    else:
        db_patient = models.Patient(**patient_data)
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        return db_patient

@app.put("/patient/{patient_id}")
def put_patient(patient_id: int, patient: PatientUpdate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # get the patient
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    # if patient is not found, raise an error
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    # get the data stored in the body of the put request
    patient_data = patient.model_dump()
    # update the fields of the existing patient
    for key, value in patient_data.items():
        setattr(db_patient, key, value)
    # commit and refresh
    db.commit()
    db.refresh(db_patient)

    return db_patient

@app.delete("/patient/{pid}")
def delete_patient(pid: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # make a call to our future database to delete the patient with the given patient_id
    patient = db.query(models.Patient).filter(models.Patient.id == pid).first()
    print(f"patient: {patient}")
    db.query(models.Prescription).filter(models.Prescription.patient_id == pid).update({models.Prescription.patient_id: None})
    
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"patient_id": pid}


# endregion
# region Medication CRUD
#-----Medication CRUD
# create medication
@app.post("/medication/", response_model=schema.MedicationResponse)
def create_medication(medication: schema.MedicationCreate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager"])

    db_medication = models.Medication(**medication.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)

    #create inventory update
    inventory_update = create_inventory_update(inventory_update=InventoryUpdateCreate(
        medication_id=db_medication.id,
        quantity_changed_by= - medication.quantity,
        activity_type=models.InventoryUpdateType.ADD
    ), db=db, current_user=current_user)
    return db_medication

# get medication by id
@app.get("/medication/{medication_id}", response_model=schema.MedicationResponse)
def get_medication(medication_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist", "Cashier"])

    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    return db_medication

# update medication by id
@app.put("/medication/{medication_id}", response_model=schema.MedicationResponse)
def update_medication(
    medication_id: int,
    new_medication: schema.MedicationUpdate,
    db: Session = Depends(get_db),
    current_user: UserToReturn = Depends(get_current_user),
):
    validate_user_type(current_user, ["Pharmacy Manager"])

    # Retrieve the existing medication from the database
    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()

    # Check if the medication exists
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")

    # Dump the data from the medication model
    medication_data = new_medication.model_dump()

    # Check for quantity change and create inventory update if applicable
    quantity_changed_by = None
    if "quantity" in medication_data and medication_data["quantity"] is not None:
        quantity_changed_by = medication_data["quantity"] - db_medication.quantity

    # Update the fields of the existing medication
    for key, value in medication_data.items():
        if value is not None:
            setattr(db_medication, key, value)

    # Commit the changes to the database
    db.commit()
    db.refresh(db_medication)

    # If the quantity changed, create an inventory update
    if quantity_changed_by is not None and quantity_changed_by != 0:
        # Determine activity type
        activity_type = (
            InventoryUpdateType.RESTOCK.value if quantity_changed_by > 0 else InventoryUpdateType.DISCARD.value
        )

        # Create inventory update data
        inventory_update_data = InventoryUpdateCreate(
            medication_id=medication_id,
            quantity_changed_by=quantity_changed_by,
            activity_type=activity_type,
            transaction_id=None,  # Set this to the appropriate transaction ID if applicable
        )

        # Pass the calculated resulting_total_quantity explicitly
        create_inventory_update_with_quantity(
            inventory_update_data, db_medication.quantity, db, current_user
        )

    return db_medication


# delete medication
@app.delete("/medication/{medication_id}")
def delete_medication(medication_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager"])

    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")

    db.delete(db_medication)
    db.commit()
    return {"message": "Medication deleted successfully", "medication_id": medication_id}

# get all medication
@app.get("/medicationlist/")
def list_medication(db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist", "Pharmacy Technician", "Cashier"])

    # Query the database for all medications
    medications = db.query(models.Medication).all()
    
    return medications

# endregion
# region Prescription CRUD
#--------PRESCRIPTION CRUD OPERATIONS--------
### Prescription CRUD ###

# get all prescriptions (**optional patient_id param lets you filter by one patient)
@app.get("/prescriptions", response_model=List[schema.PrescriptionResponse])
def get_prescriptions(patient_id: Optional[int] = Query(None), db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    '''
    endpoint to get prescriptions with optional patient_id.
    If patient_id is provided, only prescriptions for that patient are returned.
    call like so: /prescriptions?patient_id=1 or /prescriptions to get all prescriptions
    '''
    if patient_id:
        prescriptions = db.query(models.Prescription).filter(models.Prescription.patient_id == patient_id).all()
    else:
        prescriptions = db.query(models.Prescription).all()
    return prescriptions


# get prescription
@app.get("/prescription/{prescription_id}", response_model=schema.PrescriptionResponse)
def get_prescription(prescription_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    db_prescription = db.query(models.Prescription).filter(models.Prescription.id == prescription_id).first()
    if db_prescription is None:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    return db_prescription


# create prescription
@app.post("/prescription", response_model=schema.PrescriptionResponse)
def create_prescription(
    prescription: schema.PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: UserToReturn = Depends(get_current_user),
):
    # Ensure that prescription data is valid
    try:
        # db_prescription = models.Prescription(**prescription.model_dump())  # Use .model_dump() for Pydantic V2

        # not all the fields needed for the DB come from PrescriptionCreate (user_entered_id)
        # so we need to add it here
        db_prescription = models.Prescription(
            patient_id=prescription.patient_id,
            # get the user who entered the prescription from the current user
            user_entered_id=current_user.id,
            medication_id=prescription.medication_id,
            doctor_name=prescription.doctor_name,
            quantity=prescription.quantity,  # The number of units of medication that this prescription allows the patient to get
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # add the prescription
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription


# update prescription
@app.put("/prescription/{prescription_id}", response_model=schema.PrescriptionUpdate)
def update_prescription(prescription_id: int, prescription: schema.PrescriptionUpdate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # ** don't allow a prescription to be update if it has already been filled
    # since we rely on the prescription to store important details, and if it is already filled,
    # it doesn't make sense to change the patient_id, date_prescribed, medication_id, doctor_name, or quantity

    db_prescription = db.query(models.Prescription).filter(models.Prescription.id == prescription_id).first()
    if db_prescription is None:
        raise HTTPException(status_code=404, detail="Prescription not found")
    # don't allow a prescription to be updated if it has already been filled
    # check both the filled_timestamp and the user_filled_id just in case something weird happens and only one gets updated
    elif db_prescription.filled_timestamp is not None or db_prescription.user_filled_id is not None:
        raise HTTPException(status_code=409, detail="Prescriptions cannot be updated after they have already been filled")
    
    # Update only provided fields
    for key, value in prescription.model_dump().items():
        if value is not None:
            setattr(db_prescription, key, value)

    db.commit()
    db.refresh(db_prescription)
    return db_prescription


# delete prescription
@app.delete("/prescription/{prescription_id}")
def delete_prescription(prescription_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager"])
    '''
    deletes prescriptions
    not sure if this should be allowed tho... we should talk ab it
    '''
    db_prescription = db.query(models.Prescription).filter(models.Prescription.id == prescription_id).first()
    if db_prescription is None:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    db.delete(db_prescription)
    db.commit()
    return {"message": "Prescription deleted successfully", "prescription_id": prescription_id}



# fill a prescription
# Not sure the totally best way to order some of these steps here, but I think it's good enough
@app.put("/prescription/{prescription_id}/fill", response_model=schema.PrescriptionResponse)
def fill_prescription(prescription_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacist"])

    # the medication has the dosage, so if the IDs match up then it's the same dosage we wanted
    db_prescription = db.query(models.Prescription).filter(models.Prescription.id == prescription_id).first()
    if db_prescription is None:
        raise HTTPException(status_code=404, detail="Prescription not found")

    # if there is a value in the timestamp
    # (if the timestamp is not null/None)
    if not db_prescription.filled_timestamp is None:
        # 409 conflict. The request conflicts with the current state of the resource (has already been filled)
        raise HTTPException(status_code=409, detail="Prescription has already been filled")
    else:
        # Check prescription amount with medication inventory
        # there will only be one medication with the matching id (since the id is unique), so using first() is fine
        db_medication = db.query(models.Medication).filter(models.Medication.id == db_prescription.medication_id).first()
        # if none or not enough inventory, return 400, otherwise, decrease inventory quantity (later on)
        # I only change the inventory amount later on just in case there is an error with creating the inventory update
        if db_medication is None or db_medication.quantity < db_prescription.quantity:
            raise HTTPException(status_code=400, detail="There is no or insufficient inventory of this medication to fill the prescription")
        
        # if we successfully deduct medication from inventory, create an inventory update instance in InventoryUpdate table
        inventory_update_request = models.InventoryUpdate(
            medication_id=db_medication.id,
            # The quantity deducted - make it negative since we want it to be a delta of e.g. -20, instead of 20
            quantity_changed_by= - db_prescription.quantity,
            # no transaction_id since this is not associated with a transaction
            # TODO: is this right? or should we do "Fill prescription"

            activity_type=models.InventoryUpdateType.FILLPRESC   # set the type to fill prescription

        )

        # send the inventory_update_request to actually be stored in the database
        # this will add an entry to user_activities (for filling the prescription) for us
        create_inventory_update(inventory_update=inventory_update_request, db=db, current_user=current_user)


        # after making sure we have enough inventory and creating an inventory update (which create a user_activities entry for us)
        # finally fill the prescription
        # change the quantity of the medication in the inventory
        db_medication.quantity -= db_prescription.quantity
        
        # set the timestamp of filling to the current time
        db_prescription.filled_timestamp = datetime.now()
        # get the user_id of the user who filled the prescription from the current user
        db_prescription.user_filled_id = current_user.id

    db.commit()
    db.refresh(db_prescription)
    return db_prescription


# endregion
# region Non-Prescription items

# selling non-prescription items
@app.put("/non-prescription/{id}", response_model=InventoryUpdateResponse)
def sell_non_prescription_item(id: int, medication_update: schema.MedicationUpdate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # make sure only pharmacy managers or pharmacists can call this endpoint
    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    # query medication with id and make sure it's prescription-required is False
    db_medication = db.query(models.Medication).filter(models.Medication.id == id).first()
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    elif db_medication.prescription_required:
        raise HTTPException(status_code=400, detail="This medication requires a prescription to be sold")
    
    # update the medication
    for key, value in medication_update.model_dump().items():
        if value is not None:
            setattr(db_medication, key, value)

    # commit the changes
    db.commit()
    db.refresh(db_medication)

    #create inventory update
    inventory_update = create_inventory_update(inventory_update=InventoryUpdateCreate(
        medication_id=id,
        quantity_changed_by= - medication_update.quantity,
        activity_type=models.InventoryUpdateType.SELLNONPRESC
    ), db=db, current_user=current_user)
    return inventory_update



# endregion
# region Inventory Updates
#--------INVENTORY UPDATES--------

# create inventory_update
# just as a function that will get called by other endpoints
# @app.post("/inventory-updates", response_model=InventoryUpdateResponse)
def create_inventory_update(inventory_update: InventoryUpdateCreate, db: Session, current_user: UserToReturn):
    # Catch possible exceptions when creating the DB entries
    try:
        # Fetch the current medication
        medication = db.query(models.Medication).filter(models.Medication.id == inventory_update.medication_id).first()
        if not medication:
            raise HTTPException(status_code=404, detail="Medication not found")

        # Calculate the resulting total quantity
        resulting_total_quantity = medication.quantity + inventory_update.quantity_changed_by

        # Validate for negative inventory (optional, depending on your business rules)
        if resulting_total_quantity < 0:
            raise HTTPException(status_code=400, detail="Resulting total quantity cannot be negative")

        # Update the medication quantity
        medication.quantity = resulting_total_quantity
        db.add(medication)

        # create a user_activities entry for this
        # need to do this first so we can reference the user_activity_id in the inventory_update
        # any type of updating the inventory (add, discard, filling, selling), the user_activity entry for it will be "Inventory Update"
        # **NOTE: need to use the 'key' of the enum ('INVENTORY_UPDATE') instead of the 'value' ('Inventory Update')
        user_activity_create = UserActivityCreate(activity_type=models.UserActivityType.INVENTORY_UPDATE)
        new_user_activity = create_user_activity(user_activity_create, db, current_user)

        # populate the fields of the new inventory_update
        db_inventory_update = models.InventoryUpdate(
            medication_id=inventory_update.medication_id,
            user_activity_id=new_user_activity.id,
            # might be None if there is no transaction associated with this update
            transaction_id=inventory_update.transaction_id,
            quantity_changed_by=inventory_update.quantity_changed_by,
            # Store the resulting quantity
            resulting_total_quantity=resulting_total_quantity, 
            # set the timestamp in UTC so timezones don't affect it
            timestamp=datetime.now(timezone.utc),
            activity_type=inventory_update.activity_type
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # add the inventory_update to the database
    db.add(db_inventory_update)
    db.commit()
    db.refresh(db_inventory_update)
    return db_inventory_update

def create_inventory_update_with_quantity(
    inventory_update: InventoryUpdateCreate,
    resulting_total_quantity: int,
    db: Session,
    current_user: UserToReturn,
):
    try:
        # Fetch the current medication
        medication = db.query(models.Medication).filter(models.Medication.id == inventory_update.medication_id).first()
        if not medication:
            raise HTTPException(status_code=404, detail="Medication not found")

        # Create a user activity entry for this
        user_activity_create = UserActivityCreate(activity_type=models.UserActivityType.INVENTORY_UPDATE)
        new_user_activity = create_user_activity(user_activity_create, db, current_user)

        # Create the inventory update record with the provided resulting_total_quantity
        db_inventory_update = models.InventoryUpdate(
            medication_id=inventory_update.medication_id,
            user_activity_id=new_user_activity.id,
            transaction_id=inventory_update.transaction_id,
            quantity_changed_by=inventory_update.quantity_changed_by,
            resulting_total_quantity=resulting_total_quantity,  # Use the explicitly passed value
            timestamp=datetime.now(timezone.utc),  # Set timestamp in UTC
            activity_type=inventory_update.activity_type,
        )

        # Add the inventory_update to the database
        db.add(db_inventory_update)
        db.commit()
        db.refresh(db_inventory_update)

        # Optionally print the update for debugging
        print("Created Inventory Update:", db_inventory_update)

        return db_inventory_update

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# get one inventory_update
@app.get("/inventory-updates/{id}", response_model=InventoryUpdateResponse)
def get_inventory_update(id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # make sure only pharmacy managers or pharmacists can call this endpoint
    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    # there will only be one inventory_update with the matching id (since the id is unique), so using first() is fine
    db_inventory_update = db.query(models.InventoryUpdate).filter(models.InventoryUpdate.id == id).first()

    if db_inventory_update is None:
        raise HTTPException(status_code=404, detail="Inventory update not found")
    
    return db_inventory_update


# get all inventory_updates - **optional param to filter to one value of 'type'
@app.get("/inventory-updates", response_model=List[InventoryUpdateResponse])
# restrict type to the values in InventoryUpdateType
def get_inventory_updates(activity_type: Optional[models.InventoryUpdateType] = Query(None), start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None), db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    '''
    endpoint to get inventory_updates with optional type (e.g. add, discard, fillpresc, sellnonpresc).
    If type is provided, only inventory_updates for that type are returned.
    call this endpoint like so: /inventory_updates?type=1 or /inventory_updates to get all inventory_updates
    '''
    # make sure only pharmacy managers or pharmacists can call this endpoint
    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    # # if type is provided, return all inventory_updates of that type
    # if activity_type:
    #     inventory_updates = db.query(models.InventoryUpdate).filter(models.InventoryUpdate.activity_type == activity_type).all()
    # # else return all inventory_updates
    # else:
    #     # inventory_updates = db.query(models.InventoryUpdate).all()
    #     # Query inventory updates and load related medication
    #     inventory_updates = db.query(models.InventoryUpdate).options(selectinload(models.InventoryUpdate.medication)).all()

# Start building the query for inventory updates
    query = db.query(models.InventoryUpdate).options(selectinload(models.InventoryUpdate.medication))

    # Apply filter for activity_type if provided
    if activity_type:
        query = query.filter(models.InventoryUpdate.activity_type == activity_type)

    # Apply date range filter if start_date and end_date are provided
    if start_date and end_date:
        query = query.filter(models.InventoryUpdate.timestamp >= start_date, models.InventoryUpdate.timestamp <= end_date)
    elif start_date:
        query = query.filter(models.InventoryUpdate.timestamp >= start_date)
    elif end_date:
        query = query.filter(models.InventoryUpdate.timestamp <= end_date)

    # Execute the query to retrieve the inventory updates
    inventory_updates = query.all()
        # Convert to response format with medication names
    inventory_update_responses = [
            InventoryUpdateResponse(
                id=update.id,
                medication_id=update.medication_id,
                user_activity_id=update.user_activity_id,
                transaction_id=update.transaction_id,
                quantity_changed_by=update.quantity_changed_by,
                activity_type=update.activity_type,
                timestamp=update.timestamp,
                medication_name=update.medication.name if update.medication else None  # Medication name
            )
            for update in inventory_updates
        ]
        # return inventory_update_responses
    # return inventory_updates
    return inventory_update_responses



# endregion
# region User Activities CRUD
def create_user_activity(user_activity: UserActivityCreate, db: Session, current_user: UserToReturn):
    # Create a new UserActivity instance
    db_user_activity = models.UserActivity(
        # get user_id from current_user
        user_id=current_user.id,
        activity_type=user_activity.activity_type,
        timestamp=datetime.now(timezone.utc) # set the timestamp in UTC so timezones don't affect it
    )

    db.add(db_user_activity)
    db.commit()
    db.refresh(db_user_activity)
    return db_user_activity

@app.get("/user-activities", response_model=List[UserActivityResponse])
def get_all_user_activities(db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    # make sure only pharmacy managers or pharmacists can call this endpoint
    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    activities = db.query(UserActivity).all()

    if not activities:
        raise HTTPException(status_code=404, detail="No activities found")
    return activities


# endregion
# region Transaction CRUD

# transaction crud for checkout, don't have update or delete since we are not deleting or updating transaction
# create a transaction
@app.post("/transaction", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # make sure only pharmacy managers or pharmacists can call this endpoint
    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    # create a new transaction
    # but ignore the transaction_items field since we will create those separately
    db_transaction = models.Transaction(
        # get the user_id from the current_user
        user_id=current_user.id,
        patient_id=transaction.patient_id,
        # total_cost=total_cost,
        timestamp=datetime.now(timezone.utc), # set the timestamp in UTC so timezones don't affect it
        payment_method=transaction.payment_method
    )

    # add the transaction to the database
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    # make a transaction_items entry for each of the items that got passed to this endpoint
    # pass the transaction_id of the transaction we just created
    for transaction_item in transaction.transaction_items:
        create_transaction_item(
            transaction_item=transaction_item, transaction_id=db_transaction.id, db=db, current_user=current_user
        )

    # Create a user activity
    # TODO: ***************fix the user_activity type
    user_activity = UserActivityCreate(activity_type=models.UserActivityType.OTHER)
    create_user_activity(user_activity=user_activity, db=db, current_user=current_user)
    
    return db_transaction

# get a transaction
@app.get("/transaction/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # make sure only pharmacy managers or pharmacists can call this endpoint
    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    # there will only be one transaction with the matching id (since the id is unique), so using first() is fine
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return db_transaction

# get all transactions
@app.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # make sure only pharmacy managers or pharmacists can call this endpoint
    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    transactions = db.query(models.Transaction).all()
    return transactions

    
# endregion
# region Transaction Items CRUD
# transaction items crud for checkout, don't have update or delete since we are not deleting or updating transaction items

# create a transaction item
# @app.post("/transaction-item", response_model=TransactionItemResponse)
# def create_transaction_item(transaction_item: TransactionItemCreate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
def create_transaction_item(transaction_item: TransactionItemCreate, transaction_id: int, db: Session, current_user: UserToReturn):
    # allow all user types 

    # create a new transaction item
    db_transaction_item = models.TransactionItem(
        # get the transaction_id from the parameter, from the transaction that we just created
        transaction_id=transaction_id,
        medication_id=transaction_item.medication_id,
        quantity=transaction_item.quantity,
    )

    db.add(db_transaction_item)
    db.commit()
    db.refresh(db_transaction_item)
    return db_transaction_item


# get a transaction item
@app.get("/transaction-item/{transaction_item_id}", response_model=TransactionItemResponse)
def get_transaction_item(transaction_item_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    # allow all user types 

    # there will only be one transaction item with the matching id (since the id is unique), so using first() is fine
    db_transaction_item = db.query(models.TransactionItem).filter(models.TransactionItem.id == transaction_item_id).first()

    if db_transaction_item is None:
        raise HTTPException(status_code=404, detail="Transaction item not found")
    
    return db_transaction_item


# get all transaction items
@app.get("/transaction-items", response_model=List[TransactionItemResponse])
def get_transaction_items(transaction_id: Optional[int] = Query(None), db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    '''
    endpoint to get transaction_items with optional transaction_id.
    If transaction_id is provided, only transaction_items for that patient are returned.
    call like so: /transaction-items?transaction_id=1 or /transaction-items to get all transaction_items
    '''
    # allow all user types 

    # if transaction_id is provided, return all transaction_items for that transaction
    if transaction_id:
        transaction_items = db.query(models.TransactionItem).filter(models.TransactionItem.transaction_id == transaction_id).all()
    # otherwise just return all transaction items
    else:
        transaction_items = db.query(models.TransactionItem).all()

    return transaction_items