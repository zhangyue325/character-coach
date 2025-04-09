from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal, Optional
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, db

load_dotenv()
router = APIRouter()

# === Initialize OpenAI ===
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# === Initialize Firebase ===
if not firebase_admin._apps:
    cred = credentials.Certificate("../firebase_key.json")  # path to your private key
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://character-coach-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })

# === Get character prompt from Firebase ===
def get_prompt_by_id(character_id: str) -> str:
    ref = db.reference(f"characters/{character_id}")
    data = ref.get()

    if data and "prompt" in data:
        return data["prompt"]
    raise HTTPException(status_code=404, detail="Character not found in Firebase")

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
