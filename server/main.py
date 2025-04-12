from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routes.chat import router as chat_router
from routes.tts import router as text_to_speech
from routes.whisper import router as whisper_router

# this is for testing
# uvicorn main:app --reload

app = FastAPI()
os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(text_to_speech, prefix="/tts", tags=["TTS"])
app.include_router(whisper_router, prefix="/whisper_router", tags=["Whisper"])
