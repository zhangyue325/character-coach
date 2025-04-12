import requests

response = requests.post("https://character-coach.onrender.com//chat", json={
    "characterId": "emma",
    "messages": [{"role": "user", "content": "Hello!"}]
})

data = response.json()
print(data)
# print("Reply:", data["reply"])
# print("Audio URL:", data["audioUrl"])
