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
from .schema import Token, TokenData, UserActivityCreate, UserCreate, UserResponse, UserLogin, UserToReturn, UserUpdate, PatientCreate, PatientUpdate, PatientResponse, MedicationCreate, SimpleResponse, PrescriptionUpdate, InventoryUpdateCreate,  InventoryUpdateResponse
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
    allow_origins=["http://localhost:3000"],  # Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.username).first()
    current_user = UserToReturn(id=user.id, email=user.email, user_type=user.user_type)
    if user is None:
        raise credentials_exception
    
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
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager"])
    # Check if the email already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    # if not create a new user
    hashed_password = pwd_context.hash(user.password)
    user_data = user.model_dump()  # Get user data as dict
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


@app.get("/userslist/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])
    # Query all users from the database
    users = db.query(models.User).all()
    
    return users

# endregion
# region Patient CRUD
#--------PATIENT CRUD OPERATIONS--------

@app.get("/get/patient/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db),current_user: UserToReturn = Depends(get_current_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    return patient

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
    return db_medication

# get medication by id
@app.get("/medication/{medication_id}", response_model=schema.MedicationResponse)
def get_medication(medication_id: int, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    return db_medication

# update medication by id
@app.put("/medication/{medication_id}", response_model=schema.MedicationResponse)
def update_medication(medication_id: int, new_medication: schema.MedicationUpdate, db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):

    validate_user_type(current_user, ["Pharmacy Manager"])
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

    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

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
            medication_id=prescription.id,
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
            type=models.InventoryUpdateType.FILLPRESC   # set the type to fill prescription
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
# region Inventory Updates
#--------INVENTORY UPDATES--------

# create inventory_update
# just as a function that will get called by other endpoints
# @app.post("/inventory-updates", response_model=InventoryUpdateResponse)
def create_inventory_update(inventory_update: InventoryUpdateCreate, request: Request, db: Session = Depends(get_db)):
    # Ensure that inventory_update data is valid
    try:
        db_inventory_update = models.InventoryUpdate(**inventory_update.model_dump())  # Use .model_dump() for Pydantic V2
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # create a user_activities entry for this
    # any type of updating the inventory (add, discard, filling, selling), the user_activity entry for it will be "Inventory Update"
    user_activity_create = UserActivityCreate(activity=models.UserActivityType.INVENTORY_UPDATE)
    create_user_activity(user_activity_create, db)


    # add the inventory_update to the database
    db.add(db_inventory_update)
    db.commit()
    db.refresh(db_inventory_update)
    return db_inventory_update


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
def get_inventory_updates(type: Optional[models.InventoryUpdateType] = Query(None), db: Session = Depends(get_db), current_user: UserToReturn = Depends(get_current_user)):
    '''
    endpoint to get inventory_updates with optional type (e.g. add, discard, fillpresc, sellnonpresc).
    If type is provided, only inventory_updates for that type are returned.
    call this endpoint like so: /inventory_updates?type=1 or /inventory_updates to get all inventory_updates
    '''
    # make sure only pharmacy managers or pharmacists can call this endpoint
    validate_user_type(current_user, ["Pharmacy Manager", "Pharmacist"])

    # if type is provided, return all inventory_updates of that type
    if type:
        inventory_updates = db.query(models.InventoryUpdate).filter(models.InventoryUpdate.type == type).all()
    # else return all inventory_updates
    else:
        inventory_updates = db.query(models.InventoryUpdate).all()
    return inventory_updates



# endregion
# region User Activities CRUD
def create_user_activity(user_activity: UserActivityCreate, db: Session, current_user: UserToReturn):

    # Create a new UserActivity instance
    db_user_activity = models.UserActivity(
        # get user_id from current_user
        user_id=current_user.id,
        type=user_activity.type,
        timestamp=datetime.now(timezone.utc) # set the timestamp in UTC so timezones don't affect it
    )

    db.add(db_user_activity)
    db.commit()
    db.refresh(db_user_activity)
    return db_user_activity