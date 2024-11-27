# build a schema using pydantic

from typing import Optional, Union
from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from .models import UserType, UserActivityType, InventoryUpdateType
from enum import Enum as PyEnum

class SimpleResponse(BaseModel):
    message: str


# region Auth, tokens
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserInDB(BaseModel):
     hashed_password: str

# endregion
# region Users
class UserToReturn(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    id: Optional[int] = None
    email: Optional[str] = None
    user_type: Optional[UserType] = None


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    user_type: UserType
    email: str
    is_locked_out: bool

# only for use by the route that lets you see users with no password yet,
# and doesn't require a token to call
# we don't want to give out a lot of details to people with no token

class UserEmailResponse(BaseModel):
    id: int
    email: str    

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    user_type: UserType
    email: EmailStr
    # optional password so a manager can create an user account for an employee
    # and the employee will add a password later
    password: Optional[str] = None
    is_locked_out: bool = False

# only for use by the route that lets you create a password for a user account that doesn't already have one
class UserSetPassword(BaseModel):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_type: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_locked_out: Optional[bool] = True

class UserDeleteResponse(BaseModel):
    message: str
    user_id: int  


# endregion
# region Patients
class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: str
    address: str
    phone_number: str
    email: EmailStr
    insurance_name: str
    insurance_group_number: str
    insurance_member_id: str

class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    insurance_name: Optional[str] = None
    insurance_group_number: Optional[str] = None
    insurance_member_id: Optional[str] = None

class PatientResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    date_of_birth: date
    address: str
    phone_number: str
    email: EmailStr
    insurance_name: str
    insurance_group_number: str
    insurance_member_id: str

    
    class Config:
        orm_mode = True

    
    @staticmethod
    def from_orm(patient):
        # Ensure date_of_birth is converted to a string
        return PatientResponse(
            id=patient.id,
            first_name=patient.first_name,
            last_name=patient.last_name,
            date_of_birth=patient.date_of_birth.strftime('%Y-%m-%d'),  # Convert datetime to string
            address=patient.address,
            phone_number=patient.phone_number,
            email=patient.email,
            insurance_name=patient.insurance_name,
            insurance_group_number=patient.insurance_group_number,
            insurance_member_id=patient.insurance_member_id
        )

# endregion
# region Medications
class MedicationCreate(BaseModel):
    name: str
    # the strength of the medication per pill
    # if we have multiple different strengths for the same medicine (e.g. tylenol), 
    # those need to be multiple different rows in the medication table
    dosage: str
    # the total number of pills of this medication we have
    quantity: int
    prescription_required: bool
    expiration_date: date
    dollars_per_unit: float

class MedicationResponse(MedicationCreate):
    id: int

    class Config:
        orm_mode = True

class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    # the strength of the medication per pill
    # if we have multiple different strengths for the same medicine (e.g. tylenol), 
    # those need to be multiple different rows in the medication table
    dosage: Optional[str] = None
    # the total number of pills of this medication we have
    quantity: Optional[int] = None
    prescription_required: Optional[bool] = None
    expiration_date: Optional[date] = None
    dollars_per_unit: Optional[float] = None


# endregion
# region Prescriptions
class PrescriptionResponse(BaseModel):
    id: int
    patient_id: int
    user_entered_id: int
    user_filled_id: Optional[int]
    date_prescribed: date
    filled_timestamp: Optional[datetime]
    medication_id: int
    doctor_name: str
    # the number of pills the patient is allowed to have of this medication with this prescription
    quantity: int

    class Config:  
        from_attributes = True 

class PrescriptionCreate(BaseModel):
    patient_id: int
    # user_id comes from the token
    # user_entered_id: int
    # TODO: i don't think you should be allowed to create an already filled prescription right away
    # it makes more sense to make them call the fill prescription route after creating the prescription
    # user_filled_id: Optional[int] = None
    # filled_timestamp: Optional[datetime] = None
    medication_id: int
    doctor_name: str
    # the number of pills the patient is allowed to have of this medication with this prescription
    quantity: int

    class Config:
        orm_mode = True

# **NOTE: prescriptions are only able to be edited until they are filled
# since we rely on the prescription to store important information and it doesn't
# make sense to edit info after the patients already has the medication
class PrescriptionUpdate(BaseModel):
    patient_id: Optional[int] = None
    # Not allowing user to change who entered the prescription, this comes from the token anyways
    # to see who modified a prescription, look at user_activities
    # user_entered_id: Optional[int] = None

    # I think you should have to call the fill prescription route to edit these
    # so we can have control over checking if we're able to fill the prescription
    # user_filled_id: Optional[int] = None
    # filled_timestamp: Optional[date] = None
    date_prescribed: Optional[date] = None
    medication_id: Optional[int] = None
    doctor_name: Optional[str] = None
    # the number of pills the patient is allowed to have of this medication with this prescription
    quantity: Optional[int] = None


# endregion
# region Inventory Updates
class InventoryUpdateCreate(BaseModel):
    medication_id: int
    # get user_id from token
    # create an entry in user_activities, and then we will put that ID here
    # optional since some updates will not be associated with a transaction (e.g. add or discard)
    transaction_id: Optional[int] = None
    quantity_changed_by: int
    activity_type: InventoryUpdateType

class InventoryUpdateResponse(BaseModel):
    id: int
    medication_id: int
    user_activity_id: int
    transaction_id: Optional[int] = None
    quantity_changed_by: int
    activity_type: Union[InventoryUpdateType, str]
    medication_name: Optional[str] = None
    timestamp: Optional[datetime] = None
    resulting_total_quantity: int = Field(..., example=100) 


# **NOTE: we will not be allowing updating or deleting inventory_updates


# endregion
# region User Activities
class UserActivityCreate(BaseModel):
    activity: UserActivityType # the activity type, an enum which can be "Login", "Logout", "Unlock Account", "Inventory Update"
    # TODO: let the database set the timestamp to the current time?

class UserActivityResponse(BaseModel):
    id: int
    user_id: int
    activity: UserActivityType # the activity type, an enum
    timestamp: datetime

# endregion
# region Transaction Items


class TransactionItemCreate(BaseModel):
    transaction_id: int
    medication_id: int
    quantity: int


class TransactionItemResponse(BaseModel):
    id: int
    transaction_id: int
    medication_id: int
    quantity: int

    class Config:
        from_attributes = True


# endregion
# region Transactions
class TransactionCreate(BaseModel):
    user_id: int
    patient_id: Optional[int] = None
    payment_method: str


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    patient_id: Optional[int] = None
    timestamp: datetime
    payment_method: str

    class Config:
        from_attributes = True
