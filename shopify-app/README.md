# Eva - Chatbot de Depilación Láser para Shopify

![Eva Chatbot](https://img.shields.io/badge/Shopify-App-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-Assistant-orange)

Eva es un chatbot inteligente diseñado específicamente para tiendas Shopify de depilación láser. Utiliza OpenAI Assistant para proporcionar respuestas personalizadas sobre tratamientos, productos y servicios de depilación láser diodo.

## 📋 Características

- ✅ **Widget flotante profesional** - Interfaz moderna y responsive
- ✅ **Integración con OpenAI Assistant** - Respuestas inteligentes y contextuales
- ✅ **Acceso a productos de Shopify** - Recomendaciones basadas en tu catálogo
- ✅ **Guardado en Google Sheets** - Registro automático de conversaciones
- ✅ **Tracking de clientes** - Identifica clientes de Shopify
- ✅ **Totalmente personalizable** - Colores, posición y mensajes configurables

## 🏗️ Arquitectura

```
┌─────────────────┐
│  Shopify Store  │
│  (Theme)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Eva Widget     │ (React/TypeScript)
│  (Frontend)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Remix App      │ (Backend)
│  (API Routes)   │
└────┬────┬───────┘
     │    │
     ▼    ▼
┌─────────────┐  ┌──────────────┐
│ OpenAI API  │  │ Shopify API  │
└─────────────┘  └──────────────┘
     │
     ▼
┌─────────────────┐
│ Google Sheets   │ (Conversaciones)
└─────────────────┘
```

## 🚀 Instalación

### Prerequisitos

- Node.js 18+
- Una cuenta de Shopify Partners
- API Key de OpenAI
- Credenciales de Google Service Account
- PostgreSQL (para desarrollo local)

### Paso 1: Clonar y Configurar

```bash
cd shopify-app
npm install
```

### Paso 2: Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Shopify
SHOPIFY_API_KEY=tu_api_key_de_shopify
SHOPIFY_API_SECRET=tu_secret_de_shopify

# OpenAI
OPENAI_API_KEY=sk-proj-TU_KEY_AQUI
OPENAI_ASSISTANT_ID=asst_TJPRY2nXzvcemLVRdw1NQ7AR

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_KEY_AQUI\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/eva_chatbot

# App URL (se configura automáticamente en desarrollo)
SHOPIFY_APP_URL=https://tu-app-url.com
```

### Paso 3: Configurar Base de Datos

```bash
# Ejecutar migraciones de Prisma
npx prisma migrate dev
npx prisma generate
```

### Paso 4: Configurar Shopify App

```bash
# Vincular con tu app de Shopify Partners
npm run config:link

# Esto te pedirá:
# - Tu organización de Shopify Partners
# - La app que creaste en Partners
```

### Paso 5: Construir el Widget

```bash
# Ir al directorio de la extensión
cd extensions/eva-chat-widget

# Instalar dependencias
npm install

# Construir el widget
npm run build

# Volver al directorio raíz
cd ../..
```

### Paso 6: Ejecutar en Desarrollo

```bash
# Desde el directorio raíz (shopify-app)
npm run dev
```

Esto iniciará:
- El servidor de desarrollo de Remix
- El túnel de Shopify para exponer tu app
- Hot reload para desarrollo

## 📦 Deployment

### Opción 1: Deploy Automático con Shopify CLI

```bash
npm run deploy
```

### Opción 2: Deploy Manual

1. **Construir la aplicación:**

```bash
npm run build
cd extensions/eva-chat-widget
npm run build
cd ../..
```

2. **Deploy a tu servidor:**

Puedes deployar a cualquier plataforma que soporte Node.js:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS
- Google Cloud Platform

3. **Configurar variables de entorno** en tu plataforma de hosting

4. **Actualizar `shopify.app.toml`** con tu URL de producción

5. **Push de la app:**

```bash
npm run config:push
```

## 🎨 Personalización

### Cambiar Colores

Edita el tema desde el Shopify Theme Editor:
1. Ve a **Online Store > Themes**
2. Click en **Customize**
3. Busca **App embeds** en el panel izquierdo
4. Encuentra **Eva Chat Widget**
5. Ajusta el color principal y otras opciones

### Modificar el Asistente de OpenAI

El chatbot usa tu asistente existente de OpenAI (ID: `asst_TJPRY2nXzvcemLVRdw1NQ7AR`).

Para modificar las respuestas:
1. Ve a [platform.openai.com](https://platform.openai.com/assistants)
2. Edita el asistente Eva
3. Modifica el prompt, instrucciones o knowledge base
4. Los cambios se aplicarán automáticamente

### Personalizar el Widget

Los estilos del widget están en:
```
extensions/eva-chat-widget/src/ChatWidget.css
```

Puedes modificar:
- Colores
- Tamaños
- Animaciones
- Posicionamiento
- Tipografía

Después de modificar, reconstruye:
```bash
cd extensions/eva-chat-widget
npm run build
```

## 📊 Google Sheets

Las conversaciones se guardan automáticamente en Google Sheets con el siguiente formato:

| Thread ID | Pregunta | Respuesta | Fecha/Hora | Shopify Customer ID |
|-----------|----------|-----------|------------|---------------------|
| thread_abc | ... | ... | 2025-01-15 10:30 | 12345678 |

### Estructura de la Hoja

La hoja se inicializa automáticamente con encabezados en la primera ejecución.

### Acceder a los Datos

Puedes:
- Ver las conversaciones directamente en Google Sheets
- Exportar a CSV para análisis
- Crear dashboards en Google Data Studio
- Usar la API de Google Sheets para integraciones

## 🔧 Desarrollo

### Estructura del Proyecto

```
shopify-app/
├── app/                          # Aplicación Remix
│   ├── routes/                   # Rutas de la app
│   │   ├── api.chat.thread.tsx  # Crear thread
│   │   └── api.chat.message.tsx # Enviar mensaje
│   ├── services/                 # Lógica de negocio
│   │   ├── openai.server.ts     # Servicio OpenAI
│   │   ├── gspread.server.ts    # Servicio Google Sheets
│   │   └── shopify.server.ts    # Servicio Shopify
│   ├── shopify.server.ts        # Configuración Shopify
│   └── db.server.ts             # Cliente Prisma
├── extensions/                   # Extensiones de Shopify
│   └── eva-chat-widget/         # Widget del chat
│       ├── src/
│       │   ├── ChatWidget.tsx   # Componente principal
│       │   ├── ChatWidget.css   # Estilos
│       │   └── index.tsx        # Entry point
│       ├── blocks/
│       │   └── eva-chat.liquid  # Bloque Liquid
│       └── assets/              # Assets estáticos
├── prisma/
│   └── schema.prisma            # Schema de base de datos
└── package.json
```

### Scripts Útiles

```bash
# Desarrollo
npm run dev                 # Inicia servidor de desarrollo
npm run build              # Construye la aplicación
npm run deploy             # Deploya a Shopify

# Base de datos
npx prisma studio          # Interfaz visual de la DB
npx prisma migrate dev     # Crear nueva migración

# Widget
cd extensions/eva-chat-widget
npm run dev               # Desarrollo del widget
npm run build             # Construir widget
```

### API Routes

#### POST `/api/chat/thread`
Crea un nuevo thread de conversación.

**Response:**
```json
{
  "success": true,
  "threadId": "thread_abc123"
}
```

#### POST `/api/chat/message`
Envía un mensaje al asistente.

**Request:**
```json
{
  "threadId": "thread_abc123",
  "message": "¿Cuánto cuesta la depilación de piernas?",
  "shopifyCustomerId": "12345678",
  "includeProducts": true
}
```

**Response:**
```json
{
  "success": true,
  "response": "El tratamiento de depilación láser...",
  "hasProductContext": true
}
```

## 🔐 Seguridad

### Variables Sensibles

**NUNCA** commitees el archivo `.env` al repositorio. Está incluido en `.gitignore`.

### API Keys

- Las API keys se almacenan en variables de entorno
- En producción, usa un gestor de secretos (Railway Secrets, Heroku Config Vars, etc.)

### Permisos de Shopify

La app solicita los siguientes permisos:
- `read_products` - Leer productos del catálogo
- `read_customers` - Identificar clientes
- `read_orders` - (Opcional) Acceso a pedidos

## 🐛 Troubleshooting

### El widget no aparece

1. Verifica que la extensión esté habilitada en el Theme Editor
2. Comprueba que el bundle del widget esté construido (`npm run build`)
3. Revisa la consola del navegador para errores

### Errores de OpenAI

1. Verifica que `OPENAI_API_KEY` esté configurada correctamente
2. Comprueba que el `OPENAI_ASSISTANT_ID` sea válido
3. Revisa los logs del servidor

### Errores de Google Sheets

1. Verifica que las credenciales del service account sean correctas
2. Asegúrate de que el service account tenga acceso a la hoja
3. Comprueba que `GOOGLE_SPREADSHEET_ID` sea correcto

### Errores de Base de Datos

```bash
# Resetear la base de datos
npx prisma migrate reset

# Regenerar el cliente Prisma
npx prisma generate
```

## 📝 Migración desde Streamlit

Este proyecto es una migración completa de tu chatbot de Streamlit. Todos los componentes han sido portados:

| Componente Original | Nuevo Componente | Ubicación |
|---------------------|------------------|-----------|
| `openai_assistant.py` | `openai.server.ts` | `app/services/` |
| `gspread_handler.py` | `gspread.server.ts` | `app/services/` |
| `streamlit_ui.py` | `ChatWidget.tsx` | `extensions/.../src/` |
| `main.py` | Rutas API | `app/routes/api.chat.*` |

### Nuevas Funcionalidades

- ✅ Acceso a productos de Shopify
- ✅ Identificación de clientes
- ✅ Widget embebido (no requiere página separada)
- ✅ Configuración visual desde Shopify
- ✅ Más profesional y escalable

## 📞 Soporte

Para problemas o preguntas:
1. Revisa esta documentación
2. Consulta los logs del servidor
3. Verifica las variables de entorno

## 📄 Licencia

Proyecto privado de SinVello.

---

**Desarrollado para SinVello** - Tu experto en depilación láser diodo
