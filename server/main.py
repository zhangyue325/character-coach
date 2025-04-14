from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from routes.chat import router as chat_router
from routes.tts import router as text_to_speech
from routes.whisper import router as whisper_router

# this is for testing
# uvicorn main:app --reload

app = FastAPI()
os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# IMPORTANT: CORS middleware must be added BEFORE mounting static files
# to ensure OPTIONS requests are handled correctly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=600,  # Cache preflight requests for 10 minutes
)
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(text_to_speech, prefix="/tts", tags=["TTS"])
app.include_router(whisper_router, prefix="/whisper", tags=["Whisper"])
