from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uuid
import shutil
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Step 1: Save the uploaded audio file
        file_id = str(uuid.uuid4())
        filename = f"{file_id}.m4a"
        save_path = f"static/audio/{filename}"

        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Step 2: Transcribe using OpenAI Whisper
        with open(save_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )

        # Step 3: Return both transcript and audio URL
        return {
            "text": transcription.text,
            "audioUrl": f"/static/audio/{filename}"
        }


    except Exception as e:
        return JSONResponse({
            "text": f"⚠️ Error: {str(e)}", 
            "audioUrl": None
        })