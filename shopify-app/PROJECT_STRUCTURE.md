# 🏗️ Estructura del Proyecto Eva Chatbot

## 📊 Vista General

```
chatty_repply/
│
├── 📂 [Proyecto Original - Streamlit]
│   ├── main.py                         # ✅ Migrado → app/routes/
│   ├── openai_assistant.py            # ✅ Migrado → app/services/openai.server.ts
│   ├── gspread_handler.py             # ✅ Migrado → app/services/gspread.server.ts
│   ├── streamlit_ui.py                # ✅ Migrado → extensions/eva-chat-widget/
│   └── proyecto-eva-service-account.json
│
└── 📂 shopify-app/                     # ← NUEVO PROYECTO
    ├── 📘 LEEME.md                     # Inicio rápido en español
    ├── 📘 README.md                    # Documentación completa
    ├── 📘 QUICKSTART.md                # Guía de instalación
    ├── 📘 DEPLOYMENT.md                # Guía de producción
    ├── 📘 SUMMARY.md                   # Resumen ejecutivo
    ├── 📘 COMMANDS.md                  # Comandos útiles
    ├── 📘 PROJECT_STRUCTURE.md         # Este archivo
    │
    ├── 📂 app/                         # 🔷 BACKEND (Remix + TypeScript)
    │   ├── 📂 routes/                  # Rutas de la aplicación
    │   │   ├── api.chat.thread.tsx    # POST /api/chat/thread
    │   │   └── api.chat.message.tsx   # POST /api/chat/message
    │   │
    │   ├── 📂 services/                # Lógica de negocio
    │   │   ├── openai.server.ts       # ✅ Migrado de openai_assistant.py
    │   │   ├── gspread.server.ts      # ✅ Migrado de gspread_handler.py
    │   │   └── shopify.server.ts      # 🆕 Nuevo: Acceso a Shopify API
    │   │
    │   ├── shopify.server.ts          # Configuración de Shopify
    │   ├── db.server.ts               # Cliente Prisma
    │   ├── entry.server.tsx           # Entry point del servidor
    │   ├── entry.client.tsx           # Entry point del cliente
    │   └── root.tsx                   # Layout raíz
    │
    ├── 📂 extensions/                  # 🔶 FRONTEND (React + TypeScript)
    │   └── 📂 eva-chat-widget/
    │       ├── 📂 src/
    │       │   ├── ChatWidget.tsx     # ✅ Componente principal (migrado de streamlit_ui.py)
    │       │   ├── ChatWidget.css     # Estilos del widget
    │       │   └── index.tsx          # Entry point del widget
    │       │
    │       ├── 📂 blocks/
    │       │   └── eva-chat.liquid    # Bloque Liquid para Shopify
    │       │
    │       ├── 📂 assets/
    │       │   └── sinvello_logo.png  # Logo de SinVello
    │       │
    │       ├── package.json           # Dependencias del widget
    │       ├── tsconfig.json          # Config TypeScript
    │       ├── vite.config.ts         # Config de build
    │       └── shopify.extension.toml # Config de la extensión
    │
    ├── 📂 prisma/                      # 🗄️ BASE DE DATOS
    │   └── schema.prisma              # Schema de Prisma (sesiones Shopify)
    │
    ├── 📂 .shopify/                    # Carpeta generada automáticamente
    ├── 📂 node_modules/                # Dependencias (ignorado en git)
    │
    ├── 📄 .env                         # Variables de entorno (NO COMMITAR)
    ├── 📄 .env.example                 # Template de variables
    ├── 📄 .gitignore                   # Archivos ignorados por git
    ├── 📄 package.json                 # Dependencias principales
    ├── 📄 tsconfig.json                # Config TypeScript global
    ├── 📄 vite.config.ts               # Config Vite
    └── 📄 shopify.app.toml             # Configuración de la app Shopify
```

---

## 🔷 Backend (app/)

### Rutas API

#### `app/routes/api.chat.thread.tsx`
**Responsabilidad**: Crear nuevo thread de conversación

```typescript
POST /api/chat/thread
Response: { success: true, threadId: "thread_abc123" }
```

**Flujo**:
1. Recibe POST request
2. Llama a `openai.server.ts` → `createThread()`
3. Inicializa Google Sheets si es necesario
4. Devuelve threadId

---

#### `app/routes/api.chat.message.tsx`
**Responsabilidad**: Procesar mensajes del usuario

```typescript
POST /api/chat/message
Body: {
  threadId: string,
  message: string,
  shopifyCustomerId?: string,
  includeProducts: boolean
}
Response: { success: true, response: string, hasProductContext: boolean }
```

**Flujo**:
1. Recibe mensaje del usuario
2. Si `includeProducts`:
   - Busca productos relevantes en Shopify
   - Formatea para contexto
3. Llama a OpenAI Assistant con contexto
4. Guarda en Google Sheets
5. Limpia respuesta (elimina 【】)
6. Devuelve respuesta al frontend

---

### Servicios

#### `app/services/openai.server.ts`
**Migrado de**: `openai_assistant.py`

**Funciones**:
- `createThread()` - Crea thread en OpenAI
- `askAssistant()` - Envía pregunta y obtiene respuesta
- `cleanResponse()` - Limpia referencias a archivos

**Mejoras**:
- TypeScript type-safe
- Soporte para contexto de Shopify
- Mejor manejo de errores

---

#### `app/services/gspread.server.ts`
**Migrado de**: `gspread_handler.py`

**Funciones**:
- `saveToSheet()` - Guarda conversación
- `initializeSheet()` - Inicializa encabezados
- `getThreadHistory()` - Obtiene historial

**Mejoras**:
- Añade columna `shopify_customer_id`
- Inicialización automática de headers
- Credentials desde variables de entorno

---

#### `app/services/shopify.server.ts`
**Nuevo**: No existía en versión Streamlit

**Funciones**:
- `getProducts()` - Lista productos del catálogo
- `searchProducts()` - Busca productos por término
- `getCustomer()` - Obtiene info de cliente
- `formatProductsForContext()` - Formatea para OpenAI
- `extractProductKeywords()` - Extrae términos de búsqueda

---

## 🔶 Frontend (extensions/eva-chat-widget/)

### Componentes React

#### `src/ChatWidget.tsx`
**Migrado de**: `streamlit_ui.py`

**Estructura**:
```tsx
<ChatWidget>
  {!isOpen && <ChatBubble />}      // Botón flotante
  {isOpen && (
    <ChatWindow>
      <ChatHeader />                 // Header con logo y título
      <ChatMessages>                 // Lista de mensajes
        {messages.map(...)}
        <TypingIndicator />          // Animación al escribir
      </ChatMessages>
      <ChatInput />                  // Input y botón enviar
    </ChatWindow>
  )}
</ChatWidget>
```

**Estado**:
```typescript
const [isOpen, setIsOpen] = useState(false);         // Chat abierto/cerrado
const [messages, setMessages] = useState([]);        // Historial
const [inputValue, setInputValue] = useState('');    // Input actual
const [isLoading, setIsLoading] = useState(false);   // Esperando respuesta
const [threadId, setThreadId] = useState(null);      // ID de conversación
```

**Mejoras vs Streamlit**:
- ✅ Widget flotante profesional
- ✅ Animaciones suaves
- ✅ Auto-scroll al final
- ✅ Indicador de escritura
- ✅ Responsive (móvil y desktop)
- ✅ Sin recargas de página

---

#### `src/ChatWidget.css`
**Responsabilidad**: Estilos del widget

**Secciones**:
- `.eva-chat-bubble` - Botón flotante
- `.eva-chat-window` - Ventana principal
- `.eva-chat-header` - Header
- `.eva-chat-messages` - Área de mensajes
- `.eva-message` - Burbujas de mensaje
- `.eva-typing-indicator` - Animación
- `.eva-chat-input-container` - Input
- Media queries para responsive

**Colores principales**:
- Primary: `#e91e63` (Rosa SinVello)
- Secondary: `#c2185b` (Rosa oscuro)
- Background: `#f5f5f5`
- Text: `#333`

---

### Integración con Shopify

#### `blocks/eva-chat.liquid`
**Responsabilidad**: Inyectar widget en páginas de Shopify

**Variables disponibles**:
```liquid
{{ shop.permanent_domain }}      → Dominio de la tienda
{{ customer.id }}                → ID del cliente (si está logueado)
{{ block.settings.* }}           → Configuración del widget
```

**Configuraciones**:
- `enabled` - Habilitar/deshabilitar
- `welcome_message` - Mensaje de bienvenida
- `primary_color` - Color principal
- `position` - Posición (derecha/izquierda)

---

## 🗄️ Base de Datos

### Prisma Schema

```prisma
model Session {
  id          String    @id
  shop        String
  state       String
  isOnline    Boolean   @default(false)
  scope       String?
  expires     DateTime?
  accessToken String
  userId      BigInt?
  // ... más campos
}
```

**Propósito**: Almacenar sesiones de Shopify para autenticación OAuth

**Nota**: Las conversaciones se siguen guardando en Google Sheets, no en esta DB.

---

## 🔧 Archivos de Configuración

### `package.json` (raíz)
**Dependencias principales**:
```json
{
  "dependencies": {
    "@remix-run/node": "^2.8.0",
    "@shopify/shopify-app-remix": "^2.8.0",
    "openai": "^4.28.0",
    "googleapis": "^133.0.0",
    "@prisma/client": "^5.10.0"
  }
}
```

**Scripts**:
- `dev` - Servidor de desarrollo
- `build` - Build de producción
- `deploy` - Deploy a Shopify

---

### `.env`
**Variables requeridas**:
```bash
# Shopify
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...

# OpenAI
OPENAI_API_KEY=...
OPENAI_ASSISTANT_ID=...

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_SPREADSHEET_ID=...

# Database
DATABASE_URL=...
```

---

### `shopify.app.toml`
**Configuración de la app Shopify**:
```toml
name = "eva-chatbot"
client_id = "..."
application_url = "https://..."
embedded = true

[access_scopes]
scopes = "write_products,read_products,read_orders,read_customers"
```

---

## 📊 Flujo de Datos

### Conversación Completa

```
1. Usuario abre el chat
   ↓
2. Frontend: ChatWidget.tsx
   - Llama a POST /api/chat/thread
   ↓
3. Backend: api.chat.thread.tsx
   - Crea thread en OpenAI
   - Devuelve threadId
   ↓
4. Usuario escribe mensaje
   ↓
5. Frontend: ChatWidget.tsx
   - Llama a POST /api/chat/message
   - Muestra typing indicator
   ↓
6. Backend: api.chat.message.tsx
   - Busca productos en Shopify (si aplica)
   - Formatea contexto
   ↓
7. OpenAI Service: openai.server.ts
   - Envía a OpenAI Assistant
   - Espera respuesta
   ↓
8. Google Sheets Service: gspread.server.ts
   - Guarda conversación
   - Añade timestamp y customer_id
   ↓
9. Backend: api.chat.message.tsx
   - Limpia respuesta
   - Devuelve al frontend
   ↓
10. Frontend: ChatWidget.tsx
    - Muestra respuesta
    - Scroll al final
```

---

## 🔄 Ciclo de Desarrollo

### Desarrollo Local

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Widget (si estás modificando)
cd extensions/eva-chat-widget
npm run dev
```

**Hot Reload**: Ambos recargan automáticamente al guardar cambios.

---

### Build y Deploy

```bash
# Build del widget
cd extensions/eva-chat-widget
npm run build

# Build de la app
cd ../..
npm run build

# Deploy a Shopify
npm run deploy
```

---

## 📦 Dependencias Clave

### Backend
- `@shopify/shopify-app-remix` - Framework para Shopify Apps
- `openai` - Cliente oficial de OpenAI
- `googleapis` - Google Sheets API
- `@prisma/client` - ORM para base de datos

### Frontend
- `react` - UI library
- `react-dom` - React para DOM
- `typescript` - Type safety

### Dev Tools
- `vite` - Build tool rápido
- `prisma` - Database toolkit
- `@shopify/cli` - CLI de Shopify

---

## 🎯 Puntos de Entrada

### Usuario final (tienda)
1. Visita página de la tienda
2. Ve botón flotante de Eva
3. Click → se abre ChatWidget
4. Escribe mensaje
5. Recibe respuesta

### Desarrollador (código)
- **Backend**: `app/routes/api.chat.*.tsx`
- **Frontend**: `extensions/eva-chat-widget/src/ChatWidget.tsx`
- **Servicios**: `app/services/*.server.ts`

### Admin (configuración)
- **Shopify Admin**: Theme Editor > App embeds > Eva Chat Widget
- **Variables**: Railway/Heroku dashboard
- **OpenAI**: platform.openai.com/assistants
- **Google Sheets**: docs.google.com/spreadsheets

---

## 🔒 Seguridad

### Variables Sensibles
❌ **NUNCA** en código:
- API Keys
- Secrets
- Private Keys
- Database URLs

✅ **SIEMPRE** en:
- `.env` (local)
- Variables de entorno (producción)

### Archivos Ignorados (.gitignore)
```
.env
node_modules/
dist/
*service-account*.json
```

---

## 📈 Escalabilidad

### Actual
- 1 servidor Remix
- 1 instancia PostgreSQL
- OpenAI API (serverless)
- Google Sheets (gratis hasta 10M celdas)

### Si crece
- **Caching**: Añadir Redis
- **Load Balancing**: Múltiples instancias
- **Database**: Read replicas
- **CDN**: Cloudflare para widget
- **Queue**: Background jobs para sheets

---

## ✅ Checklist de Componentes

- [x] Backend API completo
- [x] Frontend widget completo
- [x] Integración OpenAI
- [x] Integración Google Sheets
- [x] Integración Shopify
- [x] Base de datos Prisma
- [x] Configuración de la app
- [x] Extensión de tema
- [x] Documentación completa
- [x] Guías de instalación
- [x] Guías de deployment

---

**Todo está listo para usar!** Sigue la guía `QUICKSTART.md` para empezar.
