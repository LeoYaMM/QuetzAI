# Description: Este script se encarga de conectarse con el front y el back para realizar la lectura de los QRs y la generación de preguntas de trivia.
#* Status: Complete

from fastapi import *
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlConnector import *
from GeminiAPIResumen import resumen_Gemini
from GeminiAPITrivia import *

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas las solicitudes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)

# Pydantic model para las peticiones del NFC
class ScanRequest(BaseModel):
    scan_data: str  # NFC ID
    id_visitante: int

class Visitante(BaseModel): # Pydantic model para los visitantes
    nombre: str
    edad: int

# Modelo para recibir la solicitud
class TriviaRequest(BaseModel):
    id_visitante: int
    noResumen: int

# Ruta para registrar un visitante
@app.post("/registrar_visitante") #* Funciona correctamente
async def registrar_visitante(visitante: Visitante):
    # Crea un usuario temporal en la base de datos
    crear_usuario_temporal(visitante.nombre, visitante.edad)

    # Retorna el id del usuario temporal para guardar en las cookies
    id_visitante = obtener_id_visitante(visitante.nombre, visitante.edad)
    
    # Verifica si se obtuvo un id y retorna el JSON
    if id_visitante:
        return {"id_visitante": id_visitante}
    else:
        raise HTTPException(status_code=500, detail="Error al crear visitante")

# Ruta que recibe el NFC
@app.post("/scan_id")
async def scan_id(request: ScanRequest):
    # Obtener el ID que viene de NFC
    scan_data = request.scan_data
    id_visitante = request.id_visitante

    # Buscar el objeto en la base de datos
    id_objeto = obtener_id_objeto(scan_data)
    if not id_objeto:
        raise HTTPException(status_code=400, detail="No se encontró el objeto.")

    # Generar el resumen
    resumen = resumen_Gemini(id_objeto, id_visitante)

    return {"resumen": resumen}

@app.post("/trivia")
async def trivia(request: TriviaRequest):
    print("entrando al back jej")
    scanCount = request.noResumen
    info = obtener_resumenes_visitantes(request.id_visitante)
    edadVisitante = obtener_edad_usuario(request.id_visitante)
    
    # Procesar las preguntas antes de hacer el return
    preguntas = []
    for i in range(scanCount):
        pregunta = pregunta_trivia_Gemini(info[i], edadVisitante, request.id_visitante)
        preguntas.append(pregunta)
    
    # Devolver todas las preguntas procesadas
    return {"preguntas": preguntas}



#TODO: Para correr el servidor de FastAPI: uvicorn Backend:app --reload