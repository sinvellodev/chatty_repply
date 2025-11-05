import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidget } from './ChatWidget';

// Función para inicializar el widget
function initEvaChatWidget() {
  // Crear contenedor si no existe
  let container = document.getElementById('eva-chat-widget-root');

  if (!container) {
    container = document.createElement('div');
    container.id = 'eva-chat-widget-root';
    document.body.appendChild(container);
  }

  // Obtener configuración del widget
  const shopDomain = (window as any).Shopify?.shop || window.location.hostname;
  const customerId = (window as any).Shopify?.customer?.id;

  // Renderizar el widget
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget shopDomain={shopDomain} customerId={customerId} />
    </React.StrictMode>
  );
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEvaChatWidget);
} else {
  initEvaChatWidget();
}

// Exportar para uso manual si es necesario
export { initEvaChatWidget, ChatWidget };
