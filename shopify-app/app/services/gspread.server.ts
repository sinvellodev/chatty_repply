import { google } from "googleapis";

// Configuración de Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || "1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o";

// Configurar credenciales desde variables de entorno
const getGoogleAuth = () => {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!serviceAccountEmail || !privateKey) {
    throw new Error("Las credenciales de Google Service Account no están configuradas");
  }

  return new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive"
    ]
  });
};

/**
 * Guarda una conversación en Google Sheets
 * Equivalente a save_to_sheet() en Python
 *
 * @param threadId - ID del thread de conversación
 * @param question - Pregunta del usuario
 * @param response - Respuesta del asistente
 * @param shopifyCustomerId - ID del cliente de Shopify (opcional)
 */
export async function saveToSheet(
  threadId: string,
  question: string,
  response: string,
  shopifyCustomerId?: string
): Promise<void> {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Fecha y hora actual
    const dateTime = new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    // Preparar fila de datos
    const values = [
      [
        threadId,
        question,
        response,
        dateTime,
        shopifyCustomerId || "N/A" // Nueva columna para ID de cliente Shopify
      ]
    ];

    // Añadir fila a la hoja
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:E", // Actualizado para incluir columna E
      valueInputOption: "RAW",
      requestBody: {
        values
      }
    });

    console.log("Conversación guardada en Google Sheets:", {
      threadId,
      shopifyCustomerId,
      timestamp: dateTime
    });
  } catch (error) {
    console.error("Error al guardar en Google Sheets:", error);
    // No lanzamos error para no interrumpir el flujo del chatbot
    // pero lo registramos para debugging
  }
}

/**
 * Inicializa la hoja con encabezados si es necesario
 */
export async function initializeSheet(): Promise<void> {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Verificar si la hoja tiene encabezados
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1:E1"
    });

    // Si no hay datos en la primera fila, añadir encabezados
    if (!response.data.values || response.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1!A1:E1",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            ["Thread ID", "Pregunta", "Respuesta", "Fecha/Hora", "Shopify Customer ID"]
          ]
        }
      });

      console.log("Encabezados inicializados en Google Sheets");
    }
  } catch (error) {
    console.error("Error al inicializar Google Sheets:", error);
  }
}

/**
 * Obtiene el historial de conversaciones de un thread
 * @param threadId - ID del thread
 * @returns Array de conversaciones
 */
export async function getThreadHistory(threadId: string): Promise<Array<{
  question: string;
  response: string;
  timestamp: string;
}>> {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:E"
    });

    const rows = response.data.values || [];
    const history: Array<{ question: string; response: string; timestamp: string }> = [];

    // Saltar encabezado y filtrar por threadId
    for (let i = 1; i < rows.length; i++) {
      const [rowThreadId, question, responseText, timestamp] = rows[i];
      if (rowThreadId === threadId) {
        history.push({
          question,
          response: responseText,
          timestamp
        });
      }
    }

    return history;
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
}
