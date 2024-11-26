# Pharmacy Management and Point-of-Sale Web App

Developed in Fall 2024 by Skyler DeVaugh, Katelyn McLean, Oliver Seymour, Hsinwei Lin, CJ Reda, and Dalia Castro

## Overview

This is a complete Web App for managing a modern pharmacy, including managing prescriptions, inventory, employee accounts, and more, and selling items to customers with a point-of-sale.

Security and user experience were considered during all points of the development process, as well as future maintainability and extensibility.

### System Summary

This pharmacy management system is a robust and scalable solution designed to streamline pharmacy operations. It integrates modern technologies such as React, FastAPI, and PostgreSQL to provide a seamless user experience and efficient data management. The system's architecture ensures maintainability, security, and extensibility, making it an ideal choice for modern pharmacies looking to enhance their operational efficiency.

**Note:** more details on the system are below the 'Running the code' section.

Key users of this app include:

- Pharmacy Managers: can create and manage user (employee) accounts, manage and update inventory, view logs of all user actions and inventory changes, receive notifications for medications expiring soon or with low stock
- Pharmacists: can fill prescriptions, view employee accounts, view medication inventory, view the same logs as pharmacy managers, receive same notifications as pharmacy managers
- Pharmacy technicians: Can view medication inventory and checkout customers
- Cashiers: can checkout customers

## Table of Contents

<!-- 3. [Tech Stack](#tech-stack) -->
1. [Overview](#overview)
2. [Features](#features)
3. [Setup Instructions](#setup-instructions)
4. [Code Structure](#code-structure)
5. [Architecture](#architecture)
6. [Frontend](#frontend)
7. [Backend](#backend)
8. [API Documentation](#api-documentation)
9. [Screenshots](#screenshots)

## Features

### User-Facing Features

- **Feature 1**: Describe feature (e.g., "User authentication with role-based access control").
- **Feature 2**: Another feature (e.g., "Dynamic data visualization through interactive dashboards").

### Admin Features

- **Feature A**: Describe feature (e.g., "Ability to monitor and manage users").


## Setup Instructions

Follow these steps to run the project locally.

### Prerequisites

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. Install [Python](https://www.python.org/)
3. Check Docker status, making sure it's properly installed

    ```shell
    docker --version
    docker-compose --version
    ```

### Installation and first-time setup

1. Clone the repository:

    ```bash
    git clone https://github.com/oliver-sey/pharmacy-management-system
    ```

2. Navigate to the project directory:

    ```bash
    cd pharmacy-management-system
    ```

3. Build Docker container

    You only need to run this command with the `--build` flag the first time or after changing the environment (importing a new package, etc).

    ```shell
    docker-compose up --build
    ```

    The Docker container should now be up and running, and the website should be available at [localhost:3000](http://localhost:3000) in your browser.

### Running Locally

1. Starting the container in a typical situation:

    Start the container:

    ```shell
    docker-compose up
    ```

2. Stop the container (stops the code):

    ```shell
    ctrl (control key) c
    ```

## Code Structure

The project is organized into the following directories:

- **frontend/**: Contains the React application for the user interface.

  - **src/**: Source code for the React components, pages, and utilities.
  - **public/**: Public assets and the main HTML file.
  - **build/**: Build output for the React application.
  - **Dockerfile**: Dockerfile for building the frontend container.
  - **package.json**: Configuration file for npm dependencies and scripts.

- **backend/**: Contains the FastAPI application for the backend logic.

  - **api_server/**: Source code for the FastAPI application, including models, schemas, and routes.
  - **database/**: SQL scripts and database-related files.
  - **tests/**: Unit tests for the backend.
  - **Dockerfile**: Dockerfile for building the backend container.
  - **requirements.txt**: List of Python dependencies.

- **docker-compose.yml**: Docker Compose file for orchestrating the frontend and backend containers.

This structure ensures a clear separation of concerns, making the project easy to navigate and maintain.

## Architecture
<!-- TODO -->

This project follows a **[describe design approach, e.g., MVC or microservices]** architecture.

### Interconnection

The frontend and backend are interconnected through RESTful APIs. The frontend makes HTTP requests to the backend to perform various operations. The backend processes these requests, interacts with the database, and returns the appropriate responses. Docker is used to containerize both the frontend and backend, ensuring a consistent and isolated environment for the application.

### Tech Stack

| Layer    | Technology Used                 |
| -------- | ------------------------------- |
| Frontend | React (JavaScript), Material-UI |
| Backend  | FastAPI (Python), Pydantic      |
| Database | PostgreSQL                      |


### Components

1. **Frontend**: Built with React.
    - Handles user interface and logic.
2. **Backend**: Powered by FastAPI, providing APIs and core logic.
    - Implements RESTful APIs for interaction.
    - Utilizes Pydantic for **\_\_\_** TODO
    <!-- TODO -->
3. **Database**: PostgreSQL for structured data storage.

## Frontend

The frontend of the application is built using React and Material-UI. It provides a dynamic and responsive user interface that allows users to interact with the system seamlessly. Key features include:

- **Component-Based Architecture**: The frontend is structured into reusable components, making it easy to maintain and extend.
- **State Management**: React's state management is used to handle the application's state, ensuring a smooth user experience.
- **Form Validation**: Custom validation logic is implemented to ensure data integrity before submission.
- **API Integration**: The frontend communicates with the backend via RESTful APIs to fetch and submit data.

## Backend

The backend is powered by FastAPI, a modern, high-performance web framework for building APIs with Python. It handles the core logic and data processing of the application. Key features include:

- **Database Management**: PostgreSQL is used as the database to store structured data. SQLAlchemy is used for ORM (Object-Relational Mapping).
- **Authentication and Authorization**: Secure authentication mechanisms are implemented using JWT (JSON Web Tokens).
- **Data Validation**: Pydantic is used for data validation and serialization, ensuring that the data conforms to the expected schema.
- **API Endpoints**: FastAPI is used to define RESTful API endpoints for various operations such as managing prescriptions, inventory, and user accounts.

<!-- TODO -->

Key Actions
For Users:
[Briefly describe key actions users can perform.]
For Admins:
[Briefly describe admin functionalities.]
Screenshots
Login Page

Figure 5: Screenshot of the login page.

Dashboard

Figure 6: User dashboard displaying data.

## API Documentation

Refer to the API Documentation for detailed routes, methods, and payload formats.

TODO: *********API documentation is from AI and is all wrong currently

### **Users**

---
Users represent the employees of the pharmacy, these are the people who have login access to the system. There are pharmacy managers, pharmacists, pharmacy technicians, and cashiers.

### Create a New User

**Endpoint**: `/users`

**Method**: `POST`

**Description**: This endpoint allows admins to create a new user.

**Authorized Users**: Admins

**Request Body**:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "role": "Pharmacist"
}
```

**Response**:

Success (201 Created):

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "role": "Pharmacist"
}
```

### Get All Users

**Endpoint**: `/userslist`

**Method**: `GET`

**Description**: This endpoint retrieves a list of all users.

**Authorized Users**: Admins, Pharmacists, Pharmacy Managers

**Response**:

Success (200 OK):

```json
[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "Pharmacist"
  },
  ...
]
```

### Update a User

**Endpoint**: `/user/{user_id}`

**Method**: `PUT`

**Description**: This endpoint allows admins to update user details.

**Authorized Users**: Admins

**Request Body**:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "role": "Pharmacy Manager"
}
```

**Response**:

Success (200 OK):

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "role": "Pharmacy Manager"
}
```

### Delete a User

**Endpoint**: `/user/{user_id}`

**Method**: `DELETE`

**Description**: This endpoint allows admins to delete a user.

**Authorized Users**: Admins

**Response**:

Success (200 OK):

```json
{
  "message": "User deleted successfully",
  "user_id": 1
}
```

### **Patients**

---
Patients represent the individuals who receive prescriptions and other services from the pharmacy.

### Create a New Patient

**Endpoint**: `/patient`

**Method**: `POST`

**Description**: This endpoint allows users to create a new patient.

**Authorized Users**: Pharmacists, Pharmacy Managers

**Request Body**:

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "phone_number": "555-1234",
  "email": "jane.doe@example.com",
  "insurance_name": "Health Insurance",
  "insurance_group_number": "12345",
  "insurance_member_id": "67890"
}
```

**Response**:

Success (201 Created):

```json
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "phone_number": "555-1234",
  "email": "jane.doe@example.com",
  "insurance_name": "Health Insurance",
  "insurance_group_number": "12345",
  "insurance_member_id": "67890"
}
```

### Get All Patients

**Endpoint**: `/patients`

**Method**: `GET`

**Description**: This endpoint retrieves a list of all patients.

**Authorized Users**: Pharmacists, Pharmacy Managers

**Response**:

Success (200 OK):

```json
[
  {
    "id": 1,
    "first_name": "Jane",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01",
    "address": "123 Main St",
    "phone_number": "555-1234",
    "email": "jane.doe@example.com",
    "insurance_name": "Health Insurance",
    "insurance_group_number": "12345",
    "insurance_member_id": "67890"
  },
  ...
]
```

### Get a Patient by ID

**Endpoint**: `/get/patient/{patient_id}`

**Method**: `GET`

**Description**: This endpoint retrieves details of a specific patient by ID.

**Authorized Users**: Pharmacists, Pharmacy Managers

**Response**:

Success (200 OK):

```json
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "phone_number": "555-1234",
  "email": "jane.doe@example.com",
  "insurance_name": "Health Insurance",
  "insurance_group_number": "12345",
  "insurance_member_id": "67890"
}
```

### Update a Patient

**Endpoint**: `/patient/{patient_id}`

**Method**: `PUT`

**Description**: This endpoint allows users to update patient details.

**Authorized Users**: Pharmacists, Pharmacy Managers

**Request Body**:

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "phone_number": "555-1234",
  "email": "jane.doe@example.com",
  "insurance_name": "Health Insurance",
  "insurance_group_number": "12345",
  "insurance_member_id": "67890"
}
```

**Response**:

Success (200 OK):

```json
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "phone_number": "555-1234",
  "email": "jane.doe@example.com",
  "insurance_name": "Health Insurance",
  "insurance_group_number": "12345",
  "insurance_member_id": "67890"
}
```

### Delete a Patient

**Endpoint**: `/patient/{patient_id}`

**Method**: `DELETE`

**Description**: This endpoint allows users to delete a patient.

**Authorized Users**: Pharmacists, Pharmacy Managers

**Response**:

Success (200 OK):

```json
{
  "message": "Patient deleted successfully",
  "patient_id": 1
}
```

### **Prescriptions**

---
Prescriptions represent the medications prescribed to patients by doctors.

### Create a New Prescription

**Endpoint**: `/prescription`

**Method**: `POST`

**Description**: This endpoint allows pharmacists to create a new prescription for a patient.

**Authorized Users**: Pharmacists

**Request Body**:

```json
{
  "patient_id": 1,
  "medication_id": 1,
  "doctor_name": "Dr. John Doe",
  "quantity": 30
}
```

**Response**:

Success (201 Created):

```json
{
  "id": 123,
  "patient_id": 1,
  "medication_id": 1,
  "doctor_name": "Dr. John Doe",
  "quantity": 30,
  "date_prescribed": "2023-10-01",
  "filled_timestamp": null,
  "user_entered_id": 1,
  "user_filled_id": null
}
```

### Get All Prescriptions

**Endpoint**: `/prescriptions`

**Method**: `GET`

**Description**: This endpoint retrieves a list of all prescriptions, optionally filtered by patient ID.

**Authorized Users**: Pharmacists, Pharmacy Managers

**Response**:

Success (200 OK):

```json
[
  {
    "id": 123,
    "patient_id": 1,
    "medication_id": 1,
    "doctor_name": "Dr. John Doe",
    "quantity": 30,
    "date_prescribed": "2023-10-01",
    "filled_timestamp": null,
    "user_entered_id": 1,
    "user_filled_id": null
  },
  ...
]
```

### Get a Prescription by ID

**Endpoint**: `/prescription/{prescription_id}`

**Method**: `GET`

**Description**: This endpoint retrieves details of a specific prescription by ID.

**Authorized Users**: Pharmacists, Pharmacy Managers

**Response**:

Success (200 OK):

```json
{
  "id": 123,
  "patient_id": 1,
  "medication_id": 1,
  "doctor_name": "Dr. John Doe",
  "quantity": 30,
  "date_prescribed": "2023-10-01",
  "filled_timestamp": null,
  "user_entered_id": 1,
  "user_filled_id": null
}
```

### Update a Prescription

**Endpoint**: `/prescription/{prescription_id}`

**Method**: `PUT`

**Description**: This endpoint allows pharmacists to update prescription details.

**Authorized Users**: Pharmacists

**Request Body**:

```json
{
  "patient_id": 1,
  "medication_id": 1,
  "doctor_name": "Dr. John Doe",
  "quantity": 30
}
```

**Response**:

Success (200 OK):

```json
{
  "id": 123,
  "patient_id": 1,
  "medication_id": 1,
  "doctor_name": "Dr. John Doe",
  "quantity": 30,
  "date_prescribed": "2023-10-01",
  "filled_timestamp": null,
  "user_entered_id": 1,
  "user_filled_id": null
}
```

### Fill a Prescription

**Endpoint**: `/prescription/{prescription_id}/fill`

**Method**: `PUT`

**Description**: This endpoint allows pharmacists to fill a prescription.

**Authorized Users**: Pharmacists

**Response**:

Success (200 OK):

```json
{
  "id": 123,
  "patient_id": 1,
  "medication_id": 1,
  "doctor_name": "Dr. John Doe",
  "quantity": 30,
  "date_prescribed": "2023-10-01",
  "filled_timestamp": "2023-10-02T10:00:00Z",
  "user_entered_id": 1,
  "user_filled_id": 2
}
```

### Delete a Prescription

**Endpoint**: `/prescription/{prescription_id}`

**Method**: `DELETE`

**Description**: This endpoint allows pharmacists to delete a prescription.

**Authorized Users**: Pharmacists

**Response**:

Success (200 OK):

```json
{
  "message": "Prescription deleted successfully",
  "prescription_id": 123
}
```

### **Medications**

---
Medications represent the drugs available in the pharmacy's inventory.

### Create a New Medication

**Endpoint**: `/medication`

**Method**: `POST`

**Description**: This endpoint allows pharmacy managers to create a new medication.

**Authorized Users**: Pharmacy Managers

**Request Body**:

```json
{
  "name": "Amoxicillin",
  "dosage": "500mg",
  "quantity": 100,
  "prescription_required": true,
  "expiration_date": "2024-12-31",
  "dollars_per_unit": 0.50
}
```

**Response**:

Success (201 Created):

```json
{
  "id": 1,
  "name": "Amoxicillin",
  "dosage": "500mg",
  "quantity": 100,
  "prescription_required": true,
  "expiration_date": "2024-12-31",
  "dollars_per_unit": 0.50
}
```

### Get All Medications

**Endpoint**: `/medicationlist`

**Method**: `GET`

**Description**: This endpoint retrieves a list of all medications.

**Authorized Users**: Pharmacy Managers, Pharmacists, Pharmacy Technicians

**Response**:

Success (200 OK):

```json
[
  {
    "id": 1,
    "name": "Amoxicillin",
    "dosage": "500mg",
    "quantity": 100,
    "prescription_required": true,
    "expiration_date": "2024-12-31",
    "dollars_per_unit": 0.50
  },
  ...
]
```

### Get a Medication by ID

**Endpoint**: `/medication/{medication_id}`

**Method**: `GET`

**Description**: This endpoint retrieves details of a specific medication by ID.

**Authorized Users**: Pharmacy Managers, Pharmacists, Pharmacy Technicians

**Response**:

Success (200 OK):

```json
{
  "id": 1,
  "name": "Amoxicillin",
  "dosage": "500mg",
  "quantity": 100,
  "prescription_required": true,
  "expiration_date": "2024-12-31",
  "dollars_per_unit": 0.50
}
```

### Update a Medication

**Endpoint**: `/medication/{medication_id}`

**Method**: `PUT`

**Description**: This endpoint allows pharmacy managers to update medication details.

**Authorized Users**: Pharmacy Managers

**Request Body**:

```json
{
  "name": "Amoxicillin",
  "dosage": "500mg",
  "quantity": 100,
  "prescription_required": true,
  "expiration_date": "2024-12-31",
  "dollars_per_unit": 0.50
}
```

**Response**:

Success (200 OK):

```json
{
  "id": 1,
  "name": "Amoxicillin",
  "dosage": "500mg",
  "quantity": 100,
  "prescription_required": true,
  "expiration_date": "2024-12-31",
  "dollars_per_unit": 0.50
}
```

### Delete a Medication

**Endpoint**: `/medication/{medication_id}`

**Method**: `DELETE`

**Description**: This endpoint allows pharmacy managers to delete a medication.

**Authorized Users**: Pharmacy Managers

**Response**:

Success (200 OK):

```json
{
  "message": "Medication deleted successfully",
  "medication_id": 1
}
```

### **Inventory Updates**

---
Inventory updates represent changes to the inventory, such as adding or removing medications.

### Get All Inventory Updates

**Endpoint**: `/inventory-updates`

**Method**: `GET`

**Description**: This endpoint retrieves a list of all inventory updates.

**Authorized Users**: Pharmacy Managers, Pharmacists

**Response**:

Success (200 OK):

```json
[
  {
    "id": 1,
    "medication_id": 1,
    "quantity_changed_by": -10,
    "activity_type": "Sell non-prescription item",
    "timestamp": "2023-10-01T10:00:00Z"
  },
  ...
]
```



## Screenshots

<!-- TODO: put screenshots of various pages here with captions -->