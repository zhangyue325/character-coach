from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from routes.tts import router as text_to_speech

# server % uvicorn main:app --host 0.0.0.0 --port 8000

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(text_to_speech, prefix="/tts", tags=["TTS"])