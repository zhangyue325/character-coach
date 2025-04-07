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

@router.post("/{character_id}")
async def save_history(character_id: str, messages: List[ChatMessage]):
    path = os.path.join(HISTORY_DIR, f"{character_id}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump([m.dict() for m in messages], f, indent=2, ensure_ascii=False)
    return {"status": "ok"}

@router.get("/{character_id}", response_model=List[ChatMessage])
async def get_history(character_id: str):
    path = os.path.join(HISTORY_DIR, f"{character_id}.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
