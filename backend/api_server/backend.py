from datetime import datetime, timedelta, timezone
from jose import JWTError
from typing import Annotated, Union # for definding the types that our functions take in and return, could be useful... or not idk
import uvicorn
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, FastAPI, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from typing import Optional
from .database import SessionLocal, engine, Base
from .schema import UserCreate, UserResponse, UserLogin, UserUpdate
from . import models  # Ensure this is the SQLAlchemy model
from sqlalchemy.orm import Session
from typing import List

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

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

# for create_access_token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


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

@app.delete("/users/{user_id}", response_model=UserResponse)
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
    return {"message": "User deleted successfully", "user_id": user_id}

@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
        # Update only provided fields
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


@app.post("/login")
def user_login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.email}, expires_delta=access_token_expires)

    return {"message": "Login successful", "user_id": db_user.id, "token": access_token}

@app.get("/userslist/", response_model=List[UserResponse])
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

#------authentication classes------

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

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    hashed_password: str

#-------authentication functions---------
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user_auth(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user_auth(fake_db, username)
    if not user:
        return False
        
    if not verify_password(password, user.hashed_password):
        return False
        
    return user


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


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
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
    user = get_user_auth(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

#-------user authentication calls-------

@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/verify-token/{token}")
async def verify_user_token(token: str):
    verify_token(token=token)
    return {'message': 'Token is valid.'}

@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.username}]


# test endpoint
@app.get("/test") # this is a decorator that tells fastapi to run the function below when a GET request is made to http://localhost:8000/test
def read_root():
    return "this is an epic gamer moment!"

#-------USER CRUD OPERATIONS---------



##--------PATIENT CRUD OPERATIONS--------

@app.get("/get/patient/{patient_id}")
def get_patient(patient_id: int):
    # make a call to our future database to get the patient with the given patient_id
    return {"patient_id":  patient_id}

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

#--------Logging configurations---------
log_config = uvicorn.config.LOGGING_CONFIG
log_config["formatters"]["access"]["fmt"] = "%(asctime)s - %(levelname)s - %(message)s"



 #--------- Reset Password ---------
@app.post("/resetpassword")
async def reset_password(
    newPassword: Annotated[str, Body(..., embed=True)],
    currentUser: Annotated[UserInDB, Depends(get_current_active_user)]
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
    fake_users_db[currentUser.username]["hashed_password"] = hashedPassword

    return {"message": "Password has been successfully reset."}

