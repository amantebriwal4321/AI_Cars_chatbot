# Build Tasks
1. Create `prd.md`, `plan.md`, `tasks.md` documents.
2. Develop a custom modern UI with HTML/CSS featuring a chat area, input box, image upload, and empty send guard.
3. Integrate `marked.js` to render Markdown in chat bubbles.
4. Set up a FastAPI backend with CORS middleware to serve the static frontend.
5. Load `GEMINI_API_KEY` from `.env` and initialize the `google-generativeai` client using `gemini-2.5-flash-lite`.
6. Implement `POST /chat` endpoint with a helpful, car-focused system prompt.
7. Implement rate limit (429) retry logic (1 retry, 2s backoff) and specific error handling (403 vs generic).
8. Implement `POST /vision` endpoint that validates image types and sizes.
9. Add a pre-flight vision check to confirm the image is car-related ("yes"/"no").
10. If car-related, analyze the image with a detailed prompt and return the result.
11. Wire the frontend image upload button to the `/vision` endpoint.
12. Initialize a Git repository, create `.gitignore` and `README.md`.
