# pharmacy-management-system

Developed in Fall 2024 by Skyler DeVaugh, Katelyn McLean, Oliver Seymour, Hsinwei Lin, CJ Reda, and Dalia Castro

## Walkthrough

When you first visit the pharmacy management system, you will be shown the homepage with information about location, hours and more.

<img src="readme_pictures\homepage.png">

You can click the login button to login to your account.

<img src="readme_pictures/login.png">

After you login, you will be shown the dashboard. The dashboard is different for every user type, this screenshot shows the dashboard for Pharmacy Managers.

<img src="readme_pictures/PM_dashboard.png">

You can naviagate to different places on the website using the navbar at the top or the buttons on the dashboard. Here are a few of the pages.

- Prescriptions:
  <img src="readme_pictures/prescriptions.png">
- User Acrtivity:
  <img src="readme_pictures/user_activity.png">
- Notifications:
  <img src="readme_pictures/notifications.png">

Each page serves a unique purpose, most are simple CRUD operations for prescriptions, medication, patients, and users. Pages like user activity, report engine, and notifications allow pharmacy managers to monitor logs and get repors.

## Setup

1. Install Docker (execute once)

   Download Docker Desktop [here](https://www.docker.com/products/docker-desktop/)

2. Check Docker status, making sure it's properly installed

   ```shell
   docker --version
   docker-compose --version
   ```

3. Build Docker container (execute once)

   ```shell
   docker-compose up --build
   ```

4. Future development with Docker container

   Start the container:

   ```shell
   docker-compose up
   ```

   Stop the container:

   ```shell
   ctrl + c
   ```

# Fish Bowl Software Architecture Overview

This document provides an overview of the software architecture for the project, which includes a **FastAPI** backend with **SQLAlchemy** models and schema design, a **PostgreSQL** database, a **React** frontend, and the use of **Docker** containers for easy deployment.

## Project Overview

The project follows a **full-stack/client-server** architecture with the following components:

- **FastAPI Backend**: Provides RESTful API endpoints for the frontend to interact with the database.
- **SQLAlchemy**: ORM (Object Relational Mapper) used to define models and handle database interactions.
- **PostgreSQL Database**: Relational database used to persist data.
- **React Frontend**: User interface built using React.js that communicates with the backend API.
- **Docker**: Containerization tool for easy deployment and isolation of all components.

---

## Architecture Diagram

```
+---------------------+      +---------------------+
|    React Frontend   | <--> |   FastAPI Backend   |
|    (User Interface) |      |    (API Server)     |
+---------------------+      +---------------------+
                                    |
                                    v
                             +---------------------+
                             |   SQLAlchemy ORM    |
                             |   (Models, Schema)  |
                             +---------------------+
                                    |
                                    v
                             +---------------------+
                             |  PostgreSQL Database|
                             |  (Data Persistence) |
                             +---------------------+
```
