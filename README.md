# AutoExpert Chatbot

A specialized AI chatbot focused entirely on cars, automotive engineering, troubleshooting, and vehicle maintenance. 

## Features
- Ask questions about any car-related topic.
- Upload images of car parts, dashboard warning lights, or vehicle issues for identification and detailed analysis.
- Prevents off-topic conversations or non-car image uploads.

## Tech Stack
- **Backend:** FastAPI (Python)
- **AI Model:** Google Gemini 2.5 Flash Lite (`google-generativeai` SDK)
- **Frontend:** Vanilla JS, HTML, CSS
- **Markdown:** Rendered using `marked.js`

## How to Run Locally

1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
2. Add your own Gemini API key to a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
4. Open your browser and go to `http://localhost:8000`
