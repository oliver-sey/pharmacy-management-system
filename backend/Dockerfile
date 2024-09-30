# FastAPI Dockerfile
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY api_server/ ./api_server

# Expose the port the app runs on
EXPOSE 8000

# Command to run the FastAPI app
CMD ["uvicorn", "api_server.backend:app", "--host", "0.0.0.0", "--port", "8000"]

