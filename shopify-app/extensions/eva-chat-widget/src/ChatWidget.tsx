import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  shopDomain: string;
  customerId?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ shopDomain, customerId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar thread al abrir el chat por primera vez
  useEffect(() => {
    if (isOpen && !threadId) {
      initializeChat();
    }
  }, [isOpen, threadId]);

  const initializeChat = async () => {
    try {
      const response = await fetch(`https://${shopDomain}/api/chat/thread`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.threadId) {
        setThreadId(data.threadId);
        // Mensaje de bienvenida
        setMessages([
          {
            role: 'assistant',
            content: 'Hola! Soy Eva, tu asistente en depilación láser diodo. ¿En qué puedo ayudarte?',
          },
        ]);
      }
    } catch (error) {
      console.error('Error al inicializar chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !threadId || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Añadir mensaje del usuario
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`https://${shopDomain}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          message: userMessage,
          shopifyCustomerId: customerId,
          includeProducts: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ]);
      } else {
        throw new Error(data.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, hubo un error. Por favor, intenta de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          className="eva-chat-bubble"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chat con Eva"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="eva-chat-window">
          {/* Header */}
          <div className="eva-chat-header">
            <div className="eva-chat-header-content">
              <div className="eva-chat-avatar">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="16" fill="#e91e63" />
                  <text
                    x="16"
                    y="22"
                    fontSize="16"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                  >
                    E
                  </text>
                </svg>
              </div>
              <div className="eva-chat-title">
                <h3>Eva - Asistente de Depilación</h3>
                <span className="eva-chat-status">En línea</span>
              </div>
            </div>
            <button
              className="eva-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="eva-chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`eva-message eva-message-${message.role}`}
              >
                <div className="eva-message-content">{message.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="eva-message eva-message-assistant">
                <div className="eva-message-content eva-typing-indicator">
                  <span>Eva está escribiendo</span>
                  <div className="eva-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="eva-chat-input-container">
            <input
              type="text"
              className="eva-chat-input"
              placeholder="Escribe tu mensaje aquí..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="eva-chat-send"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Enviar mensaje"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10L18 2L10 18L8.5 12.5L2 10Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
