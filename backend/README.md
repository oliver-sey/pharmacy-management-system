# Backend Services Documentation

This document provides an overview of the backend services in the FastAPI application, focusing on the models, schemas, database connectivity, authentication, and user management functionalities.

## Overview

The backend is built using **FastAPI**, with a **PostgreSQL** database managed through **SQLAlchemy**. This application exposes several RESTful API endpoints for authentication, user management, patient management, and password resetting. The backend also incorporates JWT-based authentication for secure API access.

---

## Key Components

## 1. **Database Connectivity**
The application uses **SQLAlchemy** for interacting with a PostgreSQL database. The `SessionLocal` object is used to manage database sessions.

#### Database Session Dependency
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

## 2. **Authentication Endpoints**

The authentication system in the backend is based on JSON Web Tokens (JWT). The following endpoints are responsible for handling user authentication, token issuance, and token verification:

### **POST /token**
This endpoint is used for user authentication. It accepts the username (email) and password, verifies the credentials, and returns a JWT access token. This token is then used for subsequent requests to authenticate the user.

- **Input**: Username (email) and password.
- **Output**: A JWT token that the user can use for authorization in future requests.

### **GET /verify-token/{token}**
This endpoint allows a user to verify whether their JWT token is valid. It decodes the token and checks its expiration time. If the token is valid, it returns a success message.

- **Input**: JWT token.
- **Output**: A message indicating if the token is valid.

## 3. **User Management Endpoints**

These endpoints manage user accounts and their details:

- **POST /users/**: Creates a new user.
- **GET /users/{user_id}**: Retrieves details of a specific user.
- **DELETE /users/{user_id}**: Deletes a user if no prescriptions are associated.
- **PUT /users/{user_id}**: Updates the details of an existing user.
- **GET /userslist/**: Lists all users in the system.
- **PUT /users/unlock/{user_id}**: Unlocks a user account.

---

## 4. **Patient Management Endpoints**

These endpoints handle patient records:

- **POST /patient**: Creates a new patient.
- **GET /patient/{patient_id}**: Retrieves details of a specific patient.
- **GET /patients**: Lists all patients in the system.
- **PUT /patient/{patient_id}**: Updates a patient’s information.
- **DELETE /patient/{patient_id}**: Deletes a patient and updates any associated prescriptions.

---

## 5. **Medication CRUD Endpoints**

These endpoints are used to manage medications in the system:

- **POST /medication/**: Adds a new medication to the database.
- **GET /medication/{medication_id}**: Retrieves details of a specific medication.
- **PUT /medication/{medication_id}**: Updates details of an existing medication.
- **DELETE /medication/{medication_id}**: Deletes a specific medication from the system.
- **GET /medicationlist/**: Lists all medications in the system.

---

## 6. **Prescription CRUD Endpoints**

These endpoints handle prescription management, including creation, updating, deletion, and filling:

- **GET /prescriptions**: Retrieves all prescriptions, optionally filtered by patient ID.
- **GET /prescription/{prescription_id}**: Retrieves a specific prescription.
- **POST /prescription**: Creates a new prescription.
- **PUT /prescription/{prescription_id}**: Updates an existing prescription (unless it has been filled).
- **DELETE /prescription/{prescription_id}**: Deletes a prescription.
- **PUT /prescription/{prescription_id}/fill**: Marks a prescription as filled and updates inventory accordingly.

---

## 7. **Inventory Update Endpoints**

These endpoints manage changes to medication inventory, such as adding, filling, or selling medications:

- **POST /inventory-updates**: Creates an inventory update (used internally).
- **GET /inventory-updates/{id}**: Retrieves a specific inventory update.
- **GET /inventory-updates**: Lists all inventory updates, optionally filtered by activity type (e.g., "add", "fillpresc", "sellnonpresc").

---

## 8. **User Activities CRUD Endpoints**

These endpoints track user activities, such as inventory updates and prescription fillings:

- **POST /user-activities**: Creates a new user activity (used internally).
- **GET /user-activities**: Lists all user activities recorded in the system.

---

## 9. **Transaction CRUD Endpoints**

These endpoints manage transactions in the pharmacy system:

- **POST /transaction**: Creates a new transaction.
- **GET /transaction/{transaction_id}**: Retrieves a specific transaction.
- **GET /transactions**: Lists all transactions in the system.


## 10. **Models**

### 1. **User**
Represents a user in the system (e.g., Pharmacy Manager, Technician, etc.).

| Column Name     | Data Type            |
|-----------------|----------------------|
| id              | Integer (Primary Key)|
| first_name      | String               |
| last_name       | String               |
| user_type       | SQLAlchemyEnum(UserType) |
| email           | String (Unique)      |
| password        | String               |
| is_locked_out   | Boolean (Default: True) |

---

### 2. **Patient**
Represents a patient with personal and insurance details.

| Column Name          | Data Type            |
|----------------------|----------------------|
| id                   | Integer (Primary Key)|
| first_name           | String               |
| last_name            | String               |
| date_of_birth        | Date                 |
| address              | String               |
| phone_number         | String               |
| email                | String (Unique)      |
| insurance_name       | String               |
| insurance_group_number | String             |
| insurance_member_id  | String               |

---

### 3. **Prescription**
Represents a prescription given to a patient, including medication details.

| Column Name          | Data Type            |
|----------------------|----------------------|
| id                   | Integer (Primary Key)|
| patient_id           | Integer (ForeignKey) |
| user_entered_id      | Integer (ForeignKey) |
| user_filled_id       | Integer (ForeignKey) |
| date_prescribed      | Date (Default: current date) |
| filled_timestamp     | DateTime (Nullable)  |
| medication_id        | Integer (ForeignKey) |
| doctor_name          | String               |
| quantity             | Integer              |

---

### 4. **Medication**
Represents a medication, including its name, dosage, and inventory details.

| Column Name          | Data Type            |
|----------------------|----------------------|
| id                   | Integer (Primary Key)|
| name                 | String               |
| dosage               | String               |
| quantity             | Integer              |
| prescription_required| Boolean              |
| expiration_date      | Date                 |
| dollars_per_unit     | Float                |

---

### 5. **UserActivity**
Tracks a user's activities in the system (e.g., login, logout, etc.).

| Column Name          | Data Type            |
|----------------------|----------------------|
| id                   | Integer (Primary Key)|
| user_id              | Integer (ForeignKey) |
| activity_type        | SQLAlchemyEnum(UserActivityType) |
| timestamp            | DateTime (Default: current time) |

---

### 6. **InventoryUpdate**
Represents changes to the inventory, such as adding or discarding medication.

| Column Name          | Data Type            |
|----------------------|----------------------|
| id                   | Integer (Primary Key)|
| medication_id        | Integer (ForeignKey) |
| user_activity_id     | Integer (ForeignKey) |
| transaction_id       | Integer (ForeignKey, Nullable) |
| quantity_changed_by  | Integer              |
| timestamp            | DateTime (Default: current time) |
| activity_type        | SQLAlchemyEnum(InventoryUpdateType) |

---

### 7. **Transaction**
Represents a transaction involving a user and a patient (e.g., payment for medication).

| Column Name          | Data Type            |
|----------------------|----------------------|
| id                   | Integer (Primary Key)|
| user_id              | Integer (ForeignKey) |
| patient_id           | Integer (ForeignKey) |
| timestamp            | DateTime (Default: current time) |
| payment_method       | String               |

---

### Enums

#### UserType
Defines the roles for a user.

| Value                |
|----------------------|
| PHARMACY_MANAGER     |
| PHARMACY_TECHNICIAN  |
| CASHIER              |
| PHARMACIST           |

#### UserActivityType
Defines the types of user activities.

| Value                |
|----------------------|
| LOGIN                |
| LOGOUT               |
| UNLOCK_ACCOUNT       |
| INVENTORY_UPDATE     |
| CREATE_USER          |
| DELETE_USER          |
| UPDATE_USER          |
| CREATE_PATIENT       |
| DELETE_PATIENT       |
| UPDATE_PATIENT       |
| CREATE_PRESCRIPTION  |
| CREATE_MEDICATION    |
| DELETE_MEDICATION    |
| UPDATE_MEDICATION    |
| OTHER                |
| ERROR                |

#### InventoryUpdateType
Defines the types of inventory updates.

| Value                |
|----------------------|
| ADD                  |
| DISCARD              |
| FILLPRESC            |
| SELLNONPRESC         |

### 8. **InventoryUpdate**
Represents updates made to the inventory, such as adding or discarding medication.

| Column Name          | Data Type            |
|----------------------|----------------------|
| id                   | Integer (Primary Key)|
| medication_id        | Integer (ForeignKey) |
| user_activity_id     | Integer (ForeignKey) |
| transaction_id       | Integer (ForeignKey, Nullable) |
| quantity_changed_by  | Integer              |
| timestamp            | DateTime (Default: current time) |
| activity_type        | SQLAlchemyEnum(InventoryUpdateType) |

---

### 9. **Transaction**
Represents a transaction between a user and a patient (e.g., payment for medications or services).

| Column Name          | Data Type            |
|----------------------|----------------------|
| id                   | Integer (Primary Key)|
| user_id              | Integer (ForeignKey) |
| patient_id           | Integer (ForeignKey) |
| timestamp            | DateTime (Default: current time) |
| payment_method       | String               |


