from elevenlabs import *
import requests

client = ElevenLabs(
    api_key="sk_05fb0705f00451002dc97fd00eb53c7829d3c4fbe9fb40c7",
)

res = client.conversational_ai.get_agent(agent_id="yfkNHLr60mYSc39AGH70",)

res = client.conversational_ai.get_conversations(agent_id="yfkNHLr60mYSc39AGH70")


res = client.text_to_speech.convert_as_stream(
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    output_format="mp3_44100_128",
    text="The first move is what sets everything in motion.",
    model_id="eleven_multilingual_v2",
)

print(type(res.response))