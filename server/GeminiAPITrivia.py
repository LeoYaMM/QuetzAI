# Description: Este script se encarga de generar preguntas para la trivia, de acuerdo a la edad del visitante y la info recopilada.
#! Status: In Progress

import os
from sqlConnector import *
import google.generativeai as genai
import json


genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

def pregunta_trivia_Gemini(info, edadVisitante, id_visitante):
    # Formulacion de la pregunta
    respuesta = model.generate_content( 
        contents=f"""A partir de este resumen: {info}. Dame una pregunta de opción multiple en ingles; 
                limitatate a dar solo la pregunta con sus 4 opciones y la opcion correcta nada mas pero damela en nivel de dificultad 
                acorde a mi edad {edadVisitante}, al final de tu respuesta no hagas más preguntas, damelas en el formato del
                siguiente ejemplo pero quita la parte ```json``` al inicio y al final: {{"pregunta" : "..?", "opciones" : ["Si", "No", "Tal vez", "No se"], 
                "respuesta" : "Si"}}"""
    )
    pregunta = respuesta.text
    guarda_pregunta_trivia(id_visitante, pregunta)
    return json.loads(pregunta)

def califica_trivia_Gemini(id_visitante):
    #! Obtiene el id del visitante de las cookies

    # Obtiene las preguntas de la trivia
    preguntas = obtener_preguntas_trivia(id_visitante) # Lista de resumenes
    respuestas = obtener_respuestas_trivia(id_visitante)
    aciertos = 0

    for i in range(len(preguntas)):
        # Calificación de la respuesta
        response = model.generate_text(
            contents=f"Tengo esta pregunta: {preguntas[i]}, mi respuesta es: {respuestas[i]}, calificala por favor. Si es correcta solo escribe '1', si es incorrecta solo escribe '0'.",
        )
        calificacion = response.text
        print(calificacion)
        if calificacion == "1":
            aciertos += 1

    return aciertos
