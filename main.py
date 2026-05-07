import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, PermissionDenied, GoogleAPIError
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env")

genai.configure(api_key=API_KEY)

app = FastAPI(title="AutoExpert API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_INSTRUCTION = """
You are AutoExpert, a friendly and highly knowledgeable specialized AI chatbot dedicated entirely to the domain of cars, automotive engineering, vehicle maintenance, troubleshooting, and automotive history.

Core Domain: Engine, Transmission, Suspension, Brakes, Aerodynamics, Drivetrain, Fuel System.

Your Personality: A friendly expert who is extremely helpful but clearly establishes boundaries. 

Rules:
1. You MUST ONLY respond to questions related to cars, driving, automotive engineering, or vehicle maintenance.
2. If a user asks an off-topic question, politely redirect them: "I'm specialized in cars and automotives. I can't help with that, but feel free to ask me about car maintenance, engine parts, or vehicle history!"
3. Be HELPFUL and not paranoid. You can answer general automotive queries and provide maintenance advice (e.g., how to change oil, what a check engine light might mean) with appropriate disclaimers. 
4. REFUSE only serious harmful instructions, prescription-level advice (irrelevant here, but as a general rule), or completely off-topic asks.
5. Use Markdown formatting to make your responses readable (use bolding for key terms, lists for steps).
"""

generation_config = {
  "temperature": 0.7,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 1024,
}

chat_model = genai.GenerativeModel(
    model_name="gemini-2.5-flash-lite",
    system_instruction=SYSTEM_INSTRUCTION,
    generation_config=generation_config
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

def handle_google_api_error(e: Exception):
    if isinstance(e, ResourceExhausted):
        return JSONResponse(status_code=429, content={"error": "Rate limit exceeded. Please try again later."})
    elif isinstance(e, PermissionDenied) or "API_KEY_INVALID" in str(e):
        return JSONResponse(status_code=403, content={"error": f"API Error: {str(e)}"})
    elif isinstance(e, GoogleAPIError):
        return JSONResponse(status_code=500, content={"error": f"Google API Error: {str(e)}"})
    else:
        return JSONResponse(status_code=500, content={"error": f"Internal Server Error: {str(e)}"})

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        formatted_history = []
        for msg in req.history:
            formatted_history.append({"role": msg.role, "parts": [msg.content]})
            
        chat = chat_model.start_chat(history=formatted_history)
        response = chat.send_message(req.message)
        
        return {"reply": response.text}
    except Exception as e:
        return handle_google_api_error(e)

@app.post("/vision")
async def vision_endpoint(image: UploadFile = File(...), prompt: Optional[str] = Form(None)):
    try:
        if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
            return JSONResponse(status_code=400, content={"error": "Only JPEG, PNG, and WEBP images are supported."})
            
        contents = await image.read()
        if len(contents) > 4 * 1024 * 1024:
            return JSONResponse(status_code=400, content={"error": "Image file too large (Max 4MB)."})

        image_part = {
            "mime_type": image.content_type,
            "data": contents
        }

        preflight_prompt = "Does this image relate to cars, vehicle parts, driving, or automotive engineering? Reply with ONLY the word 'yes' or 'no'. No other text, no punctuation."
        preflight_response = chat_model.generate_content([preflight_prompt, image_part])
        
        answer = preflight_response.text.strip().lower()
        if "no" in answer:
            return {"reply": "This image doesn't seem to be related to cars or automotives. I'm specialized in cars — try uploading a picture of an engine bay, a dashboard warning light, or a specific car part."}

        user_prompt = prompt if prompt else "Describe this image in detail in the context of cars and automotives. Be specific, helpful, and useful to the user. Use Markdown for formatting (bold key terms, use lists where helpful)."
        
        analysis_response = chat_model.generate_content([user_prompt, image_part])
        
        return {"reply": analysis_response.text}
        
    except Exception as e:
        return handle_google_api_error(e)

@app.get("/")
def read_root():
    return FileResponse("index.html")

@app.get("/{filename}")
def read_static(filename: str):
    if os.path.exists(filename) and filename in ["style.css", "script.js"]:
        return FileResponse(filename)
    return JSONResponse(status_code=404, content={"error": "Not Found"})
