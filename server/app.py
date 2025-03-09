from google import genai
from dotenv import load_dotenv
from google.genai.types import GenerateContentConfig
import os
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import json

load_dotenv()


app = Flask(__name__)
CORS(app)

try:
  client  = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
  model = "gemini-2.0-flash"
  config = GenerateContentConfig(
      temperature = 1,
      top_k = 40,
      top_p = 0.95,
      max_output_tokens = 8192,
      response_mime_type = "text/plain"
  )
  chat = client.chats.create(model=model, config=config)
  gemini_initialized = True
except Exception as e:
  print(f"Error initializing Gemini client: {e}")
  gemini_initialized = False


@app.route("/chat", methods=["POST"])
def generate():
  if not gemini_initialized:
    return Response(json.dumps({"error": "Gemini client not initialized."}), status=500, content_type="application/json")
  
  data = request.get_json()
  prompt = data.get("message", "")
  if not prompt:
    return Response(json.dumps({"error": "Prompt is empty"}), status=400, content_type="application/json")
  
  def stream_chat():
    try:
      response = chat.send_message_stream(prompt)
      for chunk in response:
        yield chunk.text
    except Exception as e:
      print(f"Error in stream chat: {e}")
      yield json.dumps({"error": "Error getting AI response.", "details": str(e)})
    

  return Response(stream_chat(), status=200, content_type="text/event-stream")


if __name__ == "__main__":
  app.run(host="0.0.0.0.", port=os.getenv("PORT"), debug=True)