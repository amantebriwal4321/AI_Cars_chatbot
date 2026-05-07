# Implementation Plan

## Stack
- Backend: FastAPI (Python)
- Frontend: Vanilla JS, HTML, CSS (Custom modern UI)
- AI Model: `gemini-2.5-flash-lite` via `google-generativeai` SDK
- Rendering: `marked.js` for markdown support

## Components in Build Order
1. Setup Project & Environment: `requirements.txt`, `.env`
2. Frontend Layout & Styling: `index.html`, `style.css` (mobile-first, modern UI)
3. Frontend Logic: `script.js` (empty send guard, markdown rendering, API wiring)
4. Backend Setup: `main.py` with FastAPI, CORS, and Gemini initialization
5. Text Chat Endpoint: `POST /chat` with system instructions and error handling (429, 403)
6. Vision Endpoint: `POST /vision` with pre-flight topic check and detailed analysis
