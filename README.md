# pharmacy-management-system

Developed in Fall 2024 by Skyler DeVaugh, Katelyn McLean, Oliver Seymour, Hsinwei Lin, CJ Reda, and Dalia Castro

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