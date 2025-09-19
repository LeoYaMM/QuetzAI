FROM python:3.13-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los requisitos e instálalos
COPY requirements.txt .

RUN apt update && apt install -y curl 


RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código fuente
COPY . .

# Expone el puerto en el que correrá FastAPI
EXPOSE 8000

# Comando por defecto para iniciar el servidor
CMD ["uvicorn", "Backend:app", "--host", "0.0.0.0", "--port", "8000"]
