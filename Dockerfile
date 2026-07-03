# Use lightweight official Python image
FROM python:3-slim

# Set working directory inside the container
WORKDIR /app

# Copy dependency definition
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files (main.py, index.html, JS, CSS, images)
COPY main.py .
COPY index.html .
COPY app.js .
COPY style.css .
COPY me.webp .
COPY refai_stats_card.webp .
COPY favicon.ico .

# Expose port 8000 for FastAPI / Uvicorn
EXPOSE 8000

# Run FastAPI app with Uvicorn on port 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
