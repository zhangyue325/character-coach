from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal, Optional
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# === Load character data ===
def load_characters():
    with open("data/character.json", "r", encoding="utf-8") as f:
        return json.load(f)

CHARACTER_DATA = load_characters()

def get_prompt_by_id(character_id: str) -> str:
    for char in CHARACTER_DATA:
        if char["id"] == character_id:
            return char["prompt"]
    raise HTTPException(status_code=404, detail="Character not found")

# === Models ===
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    characterId: str
    messages: Optional[List[ChatMessage]] = []

# === POST /chat ===
@router.post("")
async def chat(req: ChatRequest):
    try:
        prompt = get_prompt_by_id(req.characterId)

        recent_messages = req.messages[-5:] if req.messages else []
        messages = [{"role": "system", "content": prompt}] + recent_messages

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        return {"reply": f"⚠️ Error: {str(e)}"}
