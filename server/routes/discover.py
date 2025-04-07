from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import json
import os

router = APIRouter()

# === Model ===
class DiscoverPost(BaseModel):
    id: str
    authorId: str
    authorName: str
    avatar: str
    timestamp: str
    content: str
    image: Optional[str] = None

# === Load posts from JSON file ===
def load_posts_from_json() -> List[DiscoverPost]:
    filepath = os.path.join("data", "post.json")
    with open(filepath, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
    return [DiscoverPost(**post) for post in raw_data]

# === GET route ===
@router.get("", response_model=List[DiscoverPost])
async def get_discover_posts():
    return load_posts_from_json()
