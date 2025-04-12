import openai
from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import FileResponse
import uuid
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()
router = APIRouter()

openai.api_key = "YOUR_OPENAI_API_KEY"

@router.post("")
async def text_to_speech(request: Request):
    data = await request.json()
    text = data.get("text")
    filename = f"tts_{uuid.uuid4().hex}.mp3"
    filepath = f"static/audio/{filename}"

    response = openai.audio.speech.create(
        model="tts-1",  # or "tts-1-hd"
        voice="nova",   # "nova", "shimmer", "echo", etc.
        input=text
    )

    with open(filepath, "wb") as f:
        f.write(response.content)

    return {"audioUrl": f"/static/audio/{filename}"}
