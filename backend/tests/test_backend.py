import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api_server.backend import app, get_db  # Importing app and get_db from the backend
from api_server.database import Base  # Importing Base from database.py
import api_server.models as backend_models  # Importing models if needed

# Create a new database session for testing
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgres_test/test_database"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


client = TestClient(app)

# Dependency override for testing, sessionLocal connect to the test database
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create a fresh database for each test session
@pytest.fixture(scope="module")
def setup_database():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the database tables after tests
    Base.metadata.drop_all(bind=engine)

# Test case for creating a user
def test_create_user(setup_database):
    response = client.post("/users/", json={"email": "test@example.com", "password": "password123", "user_type": "admin"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

# Test case for getting a user
def test_get_user(setup_database):
    # First create a user
    create_response = client.post("/users/", json={"email": "test2@example.com", "password": "password123", "user_type": "admin"})
    user_id = create_response.json()["id"]

    # Now retrieve the user
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["email"] == "test2@example.com"

# Test case for updating a user
def test_update_user(setup_database):
    # First create a user
    create_response = client.post("/users/", json={"email": "test3@example.com", "password": "password123", "user_type": "admin"})
    user_id = create_response.json()["id"]

    # Update the user
    response = client.put(f"/users/{user_id}", json={"email": "updated@example.com"})
    assert response.status_code == 200
    assert response.json()["email"] == "updated@example.com"

# # Test case for deleting a user
# def test_delete_user(setup_database):
#     # First create a user
#     create_response = client.post("/users/", json={"email": "test4@example.com", "password": "password123", "user_type": "admin"})
#     user_id = create_response.json()["id"]

#     # Delete the user
#     response = client.delete(f"/users/{user_id}")
#     print("Test response: " + str(response.json())) # Print the response for debugging
#     assert response.status_code == 200
#     assert response.json()["message"] == "User deleted successfully"

#     # Try to get the deleted user
#     response = client.get(f"/users/{user_id}")
#     assert response.status_code == 404