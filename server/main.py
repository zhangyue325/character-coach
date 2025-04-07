from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from routes.discover import router as discover_router
from routes.characters import router as characters_router
from routes.history import router as history_router

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
app.include_router(discover_router, prefix="/discover", tags=["Discover"])
app.include_router(characters_router, prefix="/characters", tags=["Characters"])
app.include_router(history_router, prefix="/history", tags=["Discover"])
