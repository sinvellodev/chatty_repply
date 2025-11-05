import OpenAI from "openai";
import { saveToSheet } from "./gspread.server";

// Configuración de OpenAI
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || "asst_TJPRY2nXzvcemLVRdw1NQ7AR";
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error("OPENAI_API_KEY no está configurada en las variables de entorno");
}

const openai = new OpenAI({ apiKey: API_KEY });

/**
 * Crea un nuevo thread de conversación con OpenAI
 * Equivalente a create_thread() en Python
 */
export async function createThread(): Promise<string> {
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: "Inicio de la conversación"
      }
    ]
  });

  return thread.id;
}

/**
 * Envía una pregunta al asistente y espera la respuesta
 * Equivalente a ask_assistant() en Python
 *
 * @param threadId - ID del thread de conversación
 * @param question - Pregunta del usuario
 * @param shopifyCustomerId - ID del cliente de Shopify (opcional)
 * @param shopifyContext - Contexto adicional de Shopify (productos, etc.)
 * @returns Respuesta del asistente
 */
export async function askAssistant(
  threadId: string,
  question: string,
  shopifyCustomerId?: string,
  shopifyContext?: string
): Promise<string> {
  // Añadir contexto de Shopify si está disponible
  let enhancedQuestion = question;
  if (shopifyContext) {
    enhancedQuestion = `${question}\n\nContexto de la tienda: ${shopifyContext}`;
  }

  // Crear mensaje del usuario
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: enhancedQuestion
  });

  // Ejecutar el asistente
  let run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID
  });

  // Esperar a que el asistente complete la respuesta
  while (run.status !== "completed") {
    if (run.status === "failed" || run.status === "cancelled" || run.status === "expired") {
      throw new Error(`Run falló con estado: ${run.status}`);
    }

    // Esperar 500ms antes de verificar nuevamente
    await new Promise(resolve => setTimeout(resolve, 500));
    run = await openai.beta.threads.runs.retrieve(threadId, run.id);
  }

  // Obtener mensajes del thread
  const messages = await openai.beta.threads.messages.list(threadId);

  // Buscar la última respuesta del asistente
  for (const message of messages.data) {
    if (message.role === "assistant") {
      const content = message.content[0];
      if (content.type === "text") {
        const response = content.text.value;

        // Guardar en Google Sheets
        await saveToSheet(threadId, question, response, shopifyCustomerId);

        return response;
      }
    }
  }

  throw new Error("No se encontró respuesta del asistente");
}

/**
 * Limpia la respuesta del asistente eliminando referencias a archivos
 * Equivalente a clean_response() en Python
 */
export function cleanResponse(response: string): string {
  // Elimina texto entre 【 y 】
  return response.replace(/【[^】]*】/g, "");
}
