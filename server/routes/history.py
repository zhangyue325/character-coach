from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal
import os
import json

router = APIRouter()
HISTORY_DIR = "data/history"
os.makedirs(HISTORY_DIR, exist_ok=True)

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

# Helper to build file path
def get_user_file_path(user_id: str, character_id: str) -> str:
    user_dir = os.path.join(HISTORY_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)  # Create folder if it doesn't exist
    return os.path.join(user_dir, f"{character_id}.json")

@router.post("/{character_id}")
async def save_history(user_id: str, character_id: str, messages: List[ChatMessage]):
    path = get_user_file_path(user_id, character_id)
    with open(path, "w", encoding="utf-8") as f:
        json.dump([m.dict() for m in messages], f, indent=2, ensure_ascii=False)
    return {"status": "ok"}

@router.get("/{user_id}/{character_id}", response_model=List[ChatMessage])
async def get_history(user_id: str, character_id: str):
    path = get_user_file_path(user_id, character_id)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
