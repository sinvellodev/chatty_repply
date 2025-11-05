import time
import os
from openai import OpenAI
from gspread_handler import save_to_sheet

ASSISTANT_ID = os.getenv("OPENAI_ASSISTANT_ID", "asst_TJPRY2nXzvcemLVRdw1NQ7AR")
API_KEY = os.getenv("OPENAI_API_KEY")

if not API_KEY:
    raise ValueError("OPENAI_API_KEY no está configurada. Por favor configura la variable de entorno.")

client_openai = OpenAI(api_key=API_KEY)

def create_thread():
    thread = client_openai.beta.threads.create(
        messages=[{"role": "user", "content": "Inicio de la conversación"}]
    )
    return thread.id

def ask_assistant(thread_id, question):
    client_openai.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=question
    )
    
    run = client_openai.beta.threads.runs.create(thread_id=thread_id, assistant_id=ASSISTANT_ID)
    
    while run.status != "completed":
        time.sleep(0.5)
        run = client_openai.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
    
    message_response = client_openai.beta.threads.messages.list(thread_id=thread_id)
    messages = message_response.data
    
    for message in messages:
        if message.role == 'assistant':
            response = message.content[0].text.value
            save_to_sheet(thread_id, question, response)
            return response