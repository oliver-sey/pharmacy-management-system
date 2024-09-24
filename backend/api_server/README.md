# Backend

Hello y'all, I hope this readme helps. The backend will use FastAPI to define routes and logic and this other library called uvicorn is a webserver that hosts the API.

- FastAPI docs: https://fastapi.tiangolo.com/
- Uvicorn docs: https://www.uvicorn.org/

To srart, you should create a Python virtual environment, it basically is just a container that will hold all of our Python stuff. Sort of similar to Maven, all the libraries our Python code uses can be found in backend/requirements.
txt
To do this run these commands

make sure you are in the `pharmacy-management-system` directory

Thie command creates your virtual environment

```shell
python -m venv env
```

This command activates your virtual environment

```shell
env/Scripts/activate
```

This command downloads all of the packages we will need

```shell
pip install -r backend/requirements.txt
```

Great! Now you should have your environment setup and you can run the server. Use this command to do so.

```shell
uvicorn backend.api_server.backend:app --reload
```

The reload argument makes it so you don't need to stop and start the server every time you make a change.

If all is well, http://localhost:8000/test, should show some data served by our API.
