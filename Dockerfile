# Use lightweight official Python image
FROM python:3-slim

# Set working directory inside the container
WORKDIR /app

# Copy dependency definition
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY main.py .
COPY blog.py .
COPY public/ ./public/

# Expose port 8000 for FastAPI / Uvicorn
EXPOSE 8000

# Run FastAPI app with Uvicorn on port 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
