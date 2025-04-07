from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import json
import os

router = APIRouter()

class CharacterSummary(BaseModel):
    id: str
    name: str
    role: str
    avatar: str
    prompt: str

CHARACTER_FILE = os.path.join("data", "character.json")

def load_characters():
    with open(CHARACTER_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", response_model=List[CharacterSummary])
async def get_characters():
    return load_characters()

@router.get("/{character_id}", response_model=CharacterSummary)
async def get_character_by_id(character_id: str):
    data = load_characters()
    for c in data:
        if c["id"] == character_id:
            return c
    raise HTTPException(status_code=404, detail="Character not found")
