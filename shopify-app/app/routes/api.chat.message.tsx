import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { askAssistant, cleanResponse } from "~/services/openai.server";
import { authenticate } from "~/shopify.server";
import { getProducts, formatProductsForContext, extractProductKeywords, searchProducts } from "~/services/shopify.server";

/**
 * API Route: POST /api/chat/message
 * Envía un mensaje al asistente y obtiene respuesta
 */
export const action: ActionFunction = async ({ request }) => {
  // Solo permitir POST
  if (request.method !== "POST") {
    return json({ error: "Método no permitido" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { threadId, message, shopifyCustomerId, includeProducts } = body;

    // Validar datos requeridos
    if (!threadId || !message) {
      return json(
        {
          success: false,
          error: "threadId y message son requeridos"
        },
        { status: 400 }
      );
    }

    // Preparar contexto de Shopify si es necesario
    let shopifyContext = "";

    if (includeProducts) {
      try {
        // Intentar autenticar con Shopify
        const { admin } = await authenticate.public.appProxy(request);

        // Extraer palabras clave de la pregunta
        const keywords = extractProductKeywords(message);

        let products = [];

        if (keywords.length > 0) {
          // Buscar productos relacionados con las palabras clave
          for (const keyword of keywords) {
            const found = await searchProducts(admin, keyword);
            products.push(...found);
          }

          // Eliminar duplicados
          products = Array.from(new Map(products.map(p => [p.id, p])).values());
        } else {
          // Si no hay palabras clave específicas, obtener productos generales
          products = await getProducts(admin, 5);
        }

        if (products.length > 0) {
          shopifyContext = formatProductsForContext(products);
        }
      } catch (error) {
        console.log("No se pudo obtener productos de Shopify:", error);
        // Continuar sin productos si hay error
      }
    }

    // Enviar mensaje al asistente
    const rawResponse = await askAssistant(
      threadId,
      message,
      shopifyCustomerId,
      shopifyContext
    );

    // Limpiar respuesta
    const cleanedResponse = cleanResponse(rawResponse);

    return json({
      success: true,
      response: cleanedResponse,
      hasProductContext: shopifyContext.length > 0
    });
  } catch (error) {
    console.error("Error al procesar mensaje:", error);
    return json(
      {
        success: false,
        error: "Error al procesar mensaje",
        details: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  }
};

// Manejar GET para debugging
export const loader = () => {
  return json({
    message: "Use POST para enviar un mensaje al chatbot",
    expectedBody: {
      threadId: "string (required)",
      message: "string (required)",
      shopifyCustomerId: "string (optional)",
      includeProducts: "boolean (optional, default: false)"
    }
  });
};
