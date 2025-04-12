from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal, Optional
from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
import uuid


import firebase_admin
from firebase_admin import credentials, db

load_dotenv()
router = APIRouter()

# === Initialize OpenAI ===
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# === Initialize Firebase ===
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")  # path to your private key
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://character-coach-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })

# === Models ===
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    characterId: str
    messages: Optional[List[ChatMessage]] = []

@router.post("")
async def chat(req: ChatRequest):
    try:
        prompt = "you are a english coach"

        recent_messages = req.messages[-5:] if req.messages else []
        messages = [{"role": "system", "content": prompt}] + [
            {"role": m.role, "content": m.content} for m in recent_messages
        ]

        # Step 1: Get GPT reply
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        reply_text = response.choices[0].message.content

        # Step 2: Generate speech
        tts_response = client.audio.speech.create(
            model="tts-1",  # or "tts-1-hd"
            voice="nova",   # options: nova, shimmer, echo, etc.
            input=reply_text
        )

        filename = f"reply_{uuid.uuid4().hex}.mp3"
        filepath = f"static/audio/{filename}"
        with open(filepath, "wb") as f:
            f.write(tts_response.content)

        audio_url = f"/static/audio/{filename}"

        return JSONResponse({
            "reply": reply_text,
            "audioUrl": audio_url
        })

    except Exception as e:
        import traceback
        traceback.print_exc()  

        return JSONResponse({
            "reply": f"⚠️ Error: {str(e)}", 
            "audioUrl": None
        })
