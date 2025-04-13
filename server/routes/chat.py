from fastapi import APIRouter, HTTPException, Request
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
    type: Optional[str] = "text"
    content: str
    audioUri: Optional[str] = ""         
    timestamp: Optional[int] = None

class ChatRequest(BaseModel):
    messages: Optional[List[ChatMessage]] = []
    prompt: str

# Add an explicit OPTIONS handler for the chat endpoint
@router.options("")
async def options_chat():
    return JSONResponse(
        status_code=200,
        content={"detail": "OK"},
    )

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
            "text": reply_text,
            "audioUrl": audio_url
        })

    except Exception as e:
        import traceback
        traceback.print_exc()  

        return JSONResponse({
            "text": f"⚠️ Error: {str(e)}", 
            "audioUrl": None
        })