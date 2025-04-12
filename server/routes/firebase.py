import firebase_admin
from firebase_admin import credentials, dbesponse
import uuid

# === Initialize Firebase ===
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")  # path to your private key
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://character-coach-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })