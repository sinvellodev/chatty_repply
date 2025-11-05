import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { createThread } from "~/services/openai.server";
import { initializeSheet } from "~/services/gspread.server";

/**
 * API Route: POST /api/chat/thread
 * Crea un nuevo thread de conversación
 */
export const action: ActionFunction = async ({ request }) => {
  // Solo permitir POST
  if (request.method !== "POST") {
    return json({ error: "Método no permitido" }, { status: 405 });
  }

  try {
    // Inicializar Google Sheets si es necesario (solo primera vez)
    await initializeSheet();

    // Crear nuevo thread
    const threadId = await createThread();

    return json({
      success: true,
      threadId
    });
  } catch (error) {
    console.error("Error al crear thread:", error);
    return json(
      {
        success: false,
        error: "Error al crear conversación"
      },
      { status: 500 }
    );
  }
};

// Manejar GET para debugging
export const loader = () => {
  return json({
    message: "Use POST para crear un nuevo thread de conversación"
  });
};
