from datetime import datetime, timedelta, timezone
from jose import JWTError
from typing import Annotated, Union # for definding the types that our functions take in and return, could be useful... or not idk
import uvicorn
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import Base, Employee
from .schema import EmployeeCreate, EmployeeResponse
from pydantic import BaseModel
from passlib.context import CryptContext


# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(dependencies=[Depends(get_db)])

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
# #-----authentication values-------
# SECRET_KEY = "90FA9871DC0E001369671A27F90A0213"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# #------authentication classes------

# #temporary users
# #Hashed password needs to be generated by the get_password_hash function (incase you want to add a new example person)
# #These can be deleted when we connect the database
# #Manager password: password
# #Pharmacist password: password123
# fake_users_db = {
#     "manager@example.com": {
#         "full_name": "John Doe",
#         "username": "manager@example.com",
#         "hashed_password": "$2b$12$RZ40hSEXI8BuUqOCe1Gj/exWkH3pPFlPNtsahkWLIV2XiTzw8d4ym",
#         "role": "manager",
#         "disabled": False,
#     },
#     "pharmacist@example.com": {
#         "full_name": "Oliver",
#         "username": "pharmacist@example.com",
#         "hashed_password": "$2b$12$9N86kINZys6.SpJ9C/IRWudLqbWks80Z2BBcn/3Fsk7ZHsRCfa4HK",
#         "role": "pharmacist",
#         "disabled": False,
#     }
# }

# class Token(BaseModel):
#     access_token: str
#     token_type: str


# class TokenData(BaseModel):
#     username: str | None = None


# class User(BaseModel):
#     username: str | None = None
#     full_name: str | None = None
#     disabled: bool | None = None


# class UserInDB(User):
#     hashed_password: str

# #-------authentication functions---------
# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)


# def get_password_hash(password):
#     return pwd_context.hash(password)


# def get_user_auth(db, username: str):
#     if username in db:
#         user_dict = db[username]
#         return UserInDB(**user_dict)


# def authenticate_user(fake_db, username: str, password: str):
#     user = get_user_auth(fake_db, username)
#     if not user:
#         return False
        
#     if not verify_password(password, user.hashed_password):
#         return False
        
#     return user


# def create_access_token(data: dict, expires_delta: timedelta | None = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# def verify_token(token: Annotated[str, Depends(oauth2_scheme)]):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise HTTPException(status_code=403, detail="Token is invalid or expired")
#         return payload
        
#     except JWTError:
#         raise HTTPException(status_code=403, detail="Token is invalid or expired")


# async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TokenData(username=username)
#     except InvalidTokenError:
#         raise credentials_exception
#     user = get_user_auth(fake_users_db, username=token_data.username)
#     if user is None:
#         raise credentials_exception
#     return user


# async def get_current_active_user(
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     if current_user.disabled:
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user

# #-------user authentication calls-------

# @app.post("/token")
# async def login_for_access_token(
#     form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
# ) -> Token:
#     user = authenticate_user(fake_users_db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user.username}, expires_delta=access_token_expires
#     )
#     return Token(access_token=access_token, token_type="bearer")

# @app.get("/verify-token/{token}")
# async def verify_user_token(token: str):
#     verify_token(token=token)
#     return {'message': 'Token is valid.'}

# @app.get("/users/me/", response_model=User)
# async def read_users_me(
#     current_user: Annotated[User, Depends(get_current_active_user)],
# ):
#     return current_user


# @app.get("/users/me/items/")
# async def read_own_items(
#     current_user: Annotated[User, Depends(get_current_active_user)],
# ):
#     return [{"item_id": "Foo", "owner": current_user.username}]


# Create a database session dependency
DATABASE_URL = "postgresql://user:password@postgres/mydatabase"

# test endpoint
@app.get("/test") # this is a decorator that tells fastapi to run the function below when a GET request is made to http://localhost:8000/test
def read_root():
    return "this is an epic gamer moment!"

#-------USER CRUD OPERATIONS---------

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

##--------PATIENT CRUD OPERATIONS--------

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

print(get_password_hash("password123"))

#--------Logging configurations---------
log_config = uvicorn.config.LOGGING_CONFIG
log_config["formatters"]["access"]["fmt"] = "%(asctime)s - %(levelname)s - %(message)s"

#Run server
uvicorn.run(app, log_config=log_config)