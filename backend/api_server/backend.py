from datetime import datetime, timedelta, timezone
from jose import JWTError
from typing import Annotated # for defining the types that our functions take in and return, could be useful... or not idk
import uvicorn
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, FastAPI, HTTPException, Query, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from typing import Optional
from .database import SessionLocal, engine, Base
from .schema import Token, TokenData, UserCreate, UserResponse, UserLogin, UserToReturn, UserUpdate, PatientCreate, PatientUpdate, PatientResponse, MedicationCreate, SimpleResponse, PrescriptionUpdate, PrescriptionFillRequest
from . import models  # Ensure this is the SQLAlchemy model
from sqlalchemy.orm import Session
from typing import List
from . import schema
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError

app = FastAPI()

# test endpoint
@app.get("/test") # this is a decorator that tells fastapi to run the function below when a GET request is made to http://localhost:8000/test
def read_root():
    return "this is an epic gamer moment!"



# Create the database tables
Base.metadata.create_all(bind=engine)


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

#for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# region User CRUD
# POST endpoint to create a user
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    user_data = user.model_dump()  # Get user data as dict
    user_data['password'] = hashed_password  # Set the hashed password
    db_user = models.User(**user_data)  # Now unpack user_data

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
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

@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
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

@app.get("/userslist", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    # Query all users from the database
    users = db.query(models.User).all()
    
    return users

#-----authentication values-------
SECRET_KEY = "90FA9871DC0E001369671A27F90A0213"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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
        return payload
        
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)],
                            db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.username).first()
    current_user = UserToReturn(id=user.id, email=user.email, user_type=user.user_type)
    if user is None:
        
        raise credentials_exception
    
    return current_user


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
    currentUser: Annotated[UserToReturn, Depends(get_current_user)]
):
    if not newPassword:
        raise HTTPException(status_code=400, detail="Password is required")
    
    # Checks that password is valid
    if len(newPassword) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    if not any(char.isdigit() for char in newPassword):
        raise HTTPException(status_code=400, detail="Password must contain at least one number.")
    if not any(char.isupper() for char in newPassword):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter.")
    if not any(char.islower() for char in newPassword):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter.")
    if not any(char in "!@#$%^&*()_+" for char in newPassword):
        raise HTTPException(status_code=400, detail="Password must contain at least one special character.")

    # Hash the new password
    hashedPassword = get_password_hash(newPassword)

    # Update the user's password in the fake database (in-memory)
    fake_users_db[currentUser.email]["hashed_password"] = hashedPassword

    return {"message": "Password has been successfully reset."}




# endregion
# region User CRUD
# POST endpoint to create a user
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    user_data = user.model_dump()  # Get user data as dict
    user_data['password'] = hashed_password  # Set the hashed password
    db_user = models.User(**user_data)  # Now unpack user_data

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
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


@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
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


@app.get("/userslist/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    # Query all users from the database
    users = db.query(models.User).all()
    
    return users


#temporary users
#Hashed password needs to be generated by the get_password_hash function (incase you want to add a new example person)
#These can be deleted when we connect the database
#Manager password: password
#Pharmacist password: password123
fake_users_db = {
    "manager@example.com": {
        "full_name": "John Doe",
        "username": "manager@example.com",
        "hashed_password": "$2b$12$RZ40hSEXI8BuUqOCe1Gj/exWkH3pPFlPNtsahkWLIV2XiTzw8d4ym",
        "role": "manager",
        "disabled": False,
    },
    "pharmacist@example.com": {
        "full_name": "Oliver",
        "username": "pharmacist@example.com",
        "hashed_password": "$2b$12$9N86kINZys6.SpJ9C/IRWudLqbWks80Z2BBcn/3Fsk7ZHsRCfa4HK",
        "role": "pharmacist",
        "disabled": False,
    }
}

@app.get("/get/user/{user_id}")
def get_user(user_id: int):
    # make a call to our future database to get the user with the given user_id
    return {"user_id": user_id}

@app.post("/post/user")
def post_user(user: dict):
    # make a call to our future database to add the user to the database
    return user

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
@app.post("/medication", response_model=schema.MedicationResponse)
def create_medication(medication: schema.MedicationCreate, db: Session = Depends(get_db)):
    db_medication = models.Medication(**medication.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication

# get medication by id
@app.get("/medication/{medication_id}", response_model=schema.MedicationResponse)
def get_medication(medication_id: int, db: Session = Depends(get_db)):
    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    return db_medication

# update medication by id
@app.put("/medication/{medication_id}", response_model=schema.MedicationResponse)
def update_medication(medication_id: int, new_medication: schema.MedicationUpdate, db: Session = Depends(get_db)):
    # Retrieve the existing medication from the database
    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()

    # Check if the medication exists
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")

    # Dump the data from the medication model
    medication_data = new_medication.model_dump()

    # Update the fields of the existing medication
    for key, value in medication_data.items():
        if value is not None:
            setattr(db_medication, key, value)

    # Commit the changes to the database
    db.commit()
    db.refresh(db_medication)

    return db_medication

# delete medication
@app.delete("/medication/{medication_id}")
def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")

    db.delete(db_medication)
    db.commit()
    return {"message": "Medication deleted successfully", "medication_id": medication_id}

# get all medication
@app.get("/medicationlist")
def list_medication(db: Session = Depends(get_db)):
    # Query the database for all medications
    medications = db.query(models.Medication).all()
    
    return medications

# endregion
# region Prescription CRUD
#--------PRESCRIPTION CRUD OPERATIONS--------
### Prescription CRUD ###

# get all prescriptions (**optional patient_id param lets you filter by one patient)
@app.get("/prescriptions", response_model=List[schema.PrescriptionResponse])
def get_prescriptions(patient_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
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
def get_prescription(prescription_id: int, db: Session = Depends(get_db)):
    db_prescription = db.query(models.Prescription).filter(models.Prescription.id == prescription_id).first()
    if db_prescription is None:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    return db_prescription


# create prescription
@app.post("/prescription", response_model=schema.PrescriptionResponse)
def create_prescription(prescription: schema.PrescriptionCreate, db: Session = Depends(get_db)):
    '''
    we may need to edit this in the future depending on how we pass the patient info and medication info
    currently, this code assumes it gets the id of patient and medication, but if it receives a name or something
    other than the id, we will need to query the DB to get the ids.
    '''
    # Ensure that prescription data is valid
    try:
        db_prescription = models.Prescription(**prescription.model_dump())  # Use .model_dump() for Pydantic V2
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # moved code for checking if we have enough inventory, subtracting from the inventory, etc.
    # to the fill prescription route, since that's when that happens, not right when a prescription is made

    # add the prescription
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription


# update prescription
@app.put("/prescription/{prescription_id}", response_model=schema.PrescriptionUpdate)
def update_prescription(prescription_id: int, prescription: schema.PrescriptionUpdate, db: Session = Depends(get_db)):
    
    db_prescription = db.query(models.Prescription).filter(models.Prescription.id == prescription_id).first()
    if db_prescription is None:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    # Update only provided fields
    for key, value in prescription.model_dump().items():
        if value is not None:
            setattr(db_prescription, key, value)

    db.commit()
    db.refresh(db_prescription)
    return db_prescription


# delete prescription
@app.delete("/prescription/{prescription_id}")
def delete_prescription(prescription_id: int, db: Session = Depends(get_db)):
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
@app.put("/prescription/{prescription_id}/fill", response_model=schema.PrescriptionResponse)
def fill_prescription(prescription_id: int, current_user: Annotated[UserToReturn, Depends(get_current_user)], db: Session = Depends(get_db)):
    # # check permissions first
    # current_user = get_current_user(token=fill_request.token)
    
    # # TODO: not 100% sure on this
    # # only pharmacists, pharmacy managers, and pharmacy techs can view medication inventory
    # if current_user.user_type not in ["pharmacist", "pharmacy_manager", "pharmacy_tech"]:
    #     raise HTTPException(
    #         status_code=401,
    #         detail=f"User of type '{current_user}' is not authorized to fill a prescription",
    #     )

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
        # if none or not enough inventory, return 400, otherwise, decrease inventory quantity
        if db_medication is None or db_medication.quantity < db_prescription.quantity:
            raise HTTPException(status_code=400, detail="There is no or insufficient inventory of this medication to fill the prescription")
        else:
            db_medication.quantity -= db_prescription.quantity

        # if we successfully deduct medication from inventory, create an inventory update instance in InventoryUpdate table
        # TODO: ******is this sufficient to update the inventory?????
        # inventory_update = models.InventoryUpdate(
        #     medication_id=db_medication.id,
        #     user_activity_id=db_prescription.user_filled_id,    # user who filled the prescription
        #     quantity_changed=db_prescription.quantity                  # The quantity deducted
        # )

        # Add the inventory update to the session
        # db.add(inventory_update)

        # after update medication in inventory and create an inventory update, finally fill the prescription
        # set the timestamp of filling to the current time
        db_prescription.filled_timestamp = datetime.now()
        # get the user who filled the prescription from PrescriptionFillRequest
        db_prescription.user_filled_id = current_user.id

    db.commit()
    db.refresh(db_prescription)
    return db_prescription
