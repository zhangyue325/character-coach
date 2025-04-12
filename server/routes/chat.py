from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Literal, Optional
from openai import OpenAI
import os
from dotenv import load_dotenv
import uuid


load_dotenv()
router = APIRouter()

# === Initialize OpenAI ===
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# === Models ===
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    type: str
    content: str
    audioUri: str
    timestamp: int

class ChatRequest(BaseModel):
    messages: Optional[List[ChatMessage]] = []
    prompt: str

@router.post("")
async def chat(req: ChatRequest):
    try:
        prompt = req.prompt

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
