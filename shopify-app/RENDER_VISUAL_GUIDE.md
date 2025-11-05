# 📸 Guía Visual: Render.com Paso a Paso

Esta guía te dice **exactamente** qué buscar en cada pantalla.

---

## 🔑 Paso 1: Crear Cuenta en Render

### Pantalla de Inicio (render.com)

```
┌─────────────────────────────────────────┐
│  🎨 Render                              │
│                                         │
│  Build, Deploy, and Scale              │
│  Apps with Unparalleled Ease          │
│                                         │
│  [Get Started] [Sign In]               │
└─────────────────────────────────────────┘
```

**Qué hacer**:
1. Click **"Get Started"** o **"Sign Up"**
2. Click **"Sign up with GitHub"** (botón negro con logo GitHub)
3. Autoriza Render a acceder a tus repos

---

## 🗄️ Paso 2: Crear PostgreSQL

### Dashboard de Render

```
┌─────────────────────────────────────────┐
│  Dashboard                              │
│  ┌─────────┐                           │
│  │ New +   │ ← Click aquí              │
│  └─────────┘                           │
│                                         │
│  Services                               │
│  (vacío por ahora)                      │
└─────────────────────────────────────────┘
```

**Qué hacer**: Click **"New +"**

---

### Menú desplegable

```
┌──────────────────┐
│ Web Service      │
│ Static Site      │
│ Private Service  │
│ Background Worker│
│ Cron Job         │
│ PostgreSQL       │ ← Click aquí
│ Redis            │
└──────────────────┘
```

**Qué hacer**: Click **"PostgreSQL"**

---

### Formulario PostgreSQL

```
┌─────────────────────────────────────────┐
│  New PostgreSQL                         │
│                                         │
│  Name: [eva-postgres          ]        │
│  Database: [eva_chatbot       ]        │
│  User: eva_user (auto-generated)       │
│                                         │
│  Region: ┌──────────────┐              │
│         │ Oregon (US)   │ ← Selecciona│
│         └──────────────┘              │
│                                         │
│  PostgreSQL Version: 16                │
│                                         │
│  Instance Type:                        │
│  ○ Starter ($7/month)                  │
│  ● Free (expires after 90 days) ← Esto │
│                                         │
│  [Create Database]                     │
└─────────────────────────────────────────┘
```

**Qué hacer**:
1. Name: `eva-postgres`
2. Database: `eva_chatbot`
3. Region: `Oregon`
4. Plan: **Free**
5. Click **"Create Database"**

---

### Página de la Base de Datos (después de crear)

```
┌─────────────────────────────────────────┐
│  eva-postgres                    🟢 Live│
│                                         │
│  Status: Available                      │
│                                         │
│  Info    Connect    Settings           │
│  ────                                   │
│                                         │
│  Internal Database URL:                │
│  postgresql://eva_user:abc123...       │
│  [Copy]                                │
│                                         │
│  External Database URL:    ← ESTE COPIA│
│  postgresql://eva_user:xyz789@dpg-...  │
│  [Copy]  ← Click aquí                  │
└─────────────────────────────────────────┘
```

**MUY IMPORTANTE**:
1. Click **"Copy"** en "External Database URL"
2. Pégalo en un documento de texto
3. Lo necesitarás en el paso siguiente

---

## 🚀 Paso 3: Crear Web Service

### Dashboard → New +

```
┌──────────────────┐
│ Web Service      │ ← Click aquí
│ Static Site      │
│ Private Service  │
│ Background Worker│
│ Cron Job         │
│ PostgreSQL       │
│ Redis            │
└──────────────────┘
```

---

### Seleccionar Fuente

```
┌─────────────────────────────────────────┐
│  You are creating a new Web Service     │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Build and deploy from a Git       │ │
│  │ repository                        │ │
│  └───────────────────────────────────┘ │
│           [Next]  ← Click             │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Deploy an existing image from a   │ │
│  │ registry                          │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Qué hacer**: Click **"Build and deploy from a Git repository"** → **Next**

---

### Conectar Repositorio

```
┌─────────────────────────────────────────┐
│  Connect a repository                   │
│                                         │
│  🔍 Search repositories...              │
│                                         │
│  📁 eva-shopify-chatbot  ← Tu repo     │
│     github.com/tu-usuario/eva-...      │
│     [Connect]  ← Click aquí            │
│                                         │
│  No ve tu repo?                         │
│  [Configure account] ← Da más permisos │
└─────────────────────────────────────────┘
```

**Qué hacer**:
- Si ves tu repo: Click **"Connect"**
- Si NO lo ves: Click **"Configure account"** y autoriza

---

### Configurar Web Service

```
┌─────────────────────────────────────────────────────┐
│  Create Web Service                                 │
│                                                     │
│  Name: [eva-chatbot              ]                 │
│                                                     │
│  Region: [Oregon ▼]                                │
│                                                     │
│  Branch: [main ▼]                                  │
│                                                     │
│  Root Directory: [                ]  (dejar vacío) │
│                                                     │
│  Runtime: Auto-detected (Node)                     │
│                                                     │
│  Build Command:                                    │
│  [npm install && cd extensions/eva-chat-widget &&  │
│   npm install && npm run build && cd ../.. &&      │
│   npx prisma generate && npm run build        ]    │
│                                                     │
│  Start Command:                                    │
│  [npm start                                    ]    │
│                                                     │
│  Instance Type:                                    │
│  ● Free                                            │
│    $0/month • Spins down after 15 min             │
│                                                     │
│  ▼ Advanced                                        │
│  ▼ Environment Variables  ← MUY IMPORTANTE        │
│                                                     │
│  [Create Web Service] ← NO HACER CLICK TODAVÍA    │
└─────────────────────────────────────────────────────┘
```

**Qué hacer**:
1. Scroll hasta **"Environment Variables"**
2. **NO** hacer click en "Create" todavía

---

### Environment Variables

```
┌─────────────────────────────────────────┐
│  Environment Variables                  │
│                                         │
│  [+ Add Environment Variable]          │
│  ↑ Click para cada variable            │
│                                         │
│  Variables añadidas:                   │
│  ┌───────────────────────────────────┐ │
│  │ NODE_ENV = production             │ │
│  │ DATABASE_URL = postgresql://...   │ │
│  │ SHOPIFY_API_KEY = abc123...       │ │
│  │ ... (10 variables en total)       │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Variables a añadir** (una por una):

1. **NODE_ENV**
   ```
   Key: NODE_ENV
   Value: production
   ```

2. **DATABASE_URL** (el que copiaste antes)
   ```
   Key: DATABASE_URL
   Value: postgresql://eva_user:xyz789@dpg-...
   ```

3. **SHOPIFY_API_KEY**
   ```
   Key: SHOPIFY_API_KEY
   Value: [tu key de partners.shopify.com]
   ```

4. **SHOPIFY_API_SECRET**
   ```
   Key: SHOPIFY_API_SECRET
   Value: [tu secret de partners.shopify.com]
   ```

5. **SHOPIFY_APP_URL** (placeholder por ahora)
   ```
   Key: SHOPIFY_APP_URL
   Value: https://placeholder.com
   ```

6. **OPENAI_API_KEY**
   ```
   Key: OPENAI_API_KEY
   Value: sk-proj-TU_KEY_AQUI
   ```

7. **OPENAI_ASSISTANT_ID**
   ```
   Key: OPENAI_ASSISTANT_ID
   Value: asst_TJPRY2nXzvcemLVRdw1NQ7AR
   ```

8. **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   ```
   Key: GOOGLE_SERVICE_ACCOUNT_EMAIL
   Value: tu-email@proyecto.iam.gserviceaccount.com
   ```

9. **GOOGLE_SPREADSHEET_ID**
   ```
   Key: GOOGLE_SPREADSHEET_ID
   Value: 1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o
   ```

10. **GOOGLE_PRIVATE_KEY** (especial)
    ```
    Key: GOOGLE_PRIVATE_KEY

    ← Click el ícono ⤢ (expandir) a la derecha

    En el modal que se abre, pega TODO esto:
    -----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASC...
    (todo el contenido, puede ser muy largo)
    ...
    -----END PRIVATE KEY-----

    [Save]
    ```

---

### Crear Service (finalmente!)

```
┌─────────────────────────────────────────┐
│  (scroll hasta abajo)                   │
│                                         │
│  [Create Web Service]  ← AHORA SÍ     │
└─────────────────────────────────────────┘
```

**Qué hacer**: Click **"Create Web Service"**

---

## ⏳ Paso 4: Esperar el Deploy

### Pantalla de Deploy

```
┌─────────────────────────────────────────┐
│  eva-chatbot              🟡 Deploying  │
│                                         │
│  Deploy    Events    Logs    Settings  │
│  ──────                                 │
│                                         │
│  In Progress                            │
│  ├─ Building...                        │
│  │  ├─ Cloning repository... ✓        │
│  │  ├─ Installing dependencies... ✓   │
│  │  ├─ Building widget... 🔄          │
│  │  ├─ Running Prisma... ⏳           │
│  │  └─ Building app... ⏳             │
│  └─ Starting... ⏳                     │
│                                         │
│  (esto toma 10-15 minutos)             │
└─────────────────────────────────────────┘
```

**Qué hacer**:
- Ve a hacer un café ☕
- Espera hasta que veas **"Live 🟢"**

---

### Cuando esté listo

```
┌─────────────────────────────────────────┐
│  eva-chatbot                    🟢 Live │
│                                         │
│  https://eva-chatbot-abc123.onrender.com│
│  ↑ COPIA ESTA URL                      │
│                                         │
│  Last deployed 2 minutes ago           │
└─────────────────────────────────────────┘
```

**MUY IMPORTANTE**:
1. Copia la URL completa
2. La necesitarás para actualizar variables

---

## 🔄 Paso 5: Actualizar SHOPIFY_APP_URL

### Ir a Environment

```
┌─────────────────────────────────────────┐
│  eva-chatbot                    🟢 Live │
│                                         │
│  Deploy                                 │
│  Events                                 │
│  Logs                                   │
│  Environment  ← Click aquí             │
│  Settings                               │
└─────────────────────────────────────────┘
```

---

### Editar Variable

```
┌─────────────────────────────────────────┐
│  Environment                            │
│                                         │
│  Environment Variables                 │
│                                         │
│  SHOPIFY_APP_URL                       │
│  https://placeholder.com               │
│  ✏️  🗑️  ← Click el lápiz (editar)    │
│                                         │
│  (modal se abre)                       │
│  Value: [https://eva-chatbot-abc123... ]│
│         ↑ Cambia a tu URL real         │
│  [Save]                                │
└─────────────────────────────────────────┘
```

**Qué hacer**:
1. Click el ícono ✏️ en SHOPIFY_APP_URL
2. Reemplaza `placeholder.com` con tu URL real
3. Click "Save"
4. Render re-deploya (2-3 min)

---

## 🛠️ Paso 6: Ejecutar Migraciones

### Opción A: Shell en Render

```
┌─────────────────────────────────────────┐
│  eva-chatbot                    🟢 Live │
│                                         │
│  Deploy                                 │
│  Events                                 │
│  Logs                                   │
│  Shell  ← Click aquí                   │
│  Environment                            │
└─────────────────────────────────────────┘
```

Espera a que se abra la terminal:

```
┌─────────────────────────────────────────┐
│  Shell - eva-chatbot                    │
│                                         │
│  Connecting to shell...                │
│  Connected!                             │
│                                         │
│  $                                      │
│  ↑ Cuando veas esto, escribe:          │
└─────────────────────────────────────────┘
```

**Escribir**:
```bash
npx prisma migrate deploy
```

**Deberías ver**:
```
✓ Migrations applied successfully
```

---

## 🏪 Paso 7: Configurar Shopify

### Obtener Client ID

```
┌─────────────────────────────────────────┐
│  partners.shopify.com                   │
│                                         │
│  Apps > Eva Chatbot                    │
│                                         │
│  Configuration                          │
│  ─────────────                          │
│                                         │
│  Client ID                              │
│  abc123def456                          │
│  [Copy] ← Click para copiar            │
└─────────────────────────────────────────┘
```

---

### Actualizar URLs en Shopify Partners

```
┌─────────────────────────────────────────┐
│  App URL                                │
│  [https://eva-chatbot-abc123.onrender...│
│   ↑ Pega tu URL de Render              │
│                                         │
│  Allowed redirection URL(s)            │
│  https://eva-chatbot-abc123.onrender.../│
│  auth/callback                          │
│  https://eva-chatbot-abc123.onrender.../│
│  auth/shopify/callback                  │
│  https://eva-chatbot-abc123.onrender.../│
│  api/auth/callback                      │
│  ↑ Añade estas 3 URLs                  │
│                                         │
│  [Save]                                │
└─────────────────────────────────────────┘
```

---

## ✅ Paso 8: Instalar en Tienda

### Shopify Partners

```
┌─────────────────────────────────────────┐
│  Eva Chatbot                            │
│                                         │
│  [Select store ▼]                      │
│  ↑ Click                               │
│                                         │
│  (menú desplegable)                    │
│  ┌─────────────────────┐               │
│  │ my-dev-store        │ ← Tu tienda   │
│  │ other-store         │               │
│  └─────────────────────┘               │
│                                         │
│  [Install app]  ← Click después        │
└─────────────────────────────────────────┘
```

---

### Autorización

```
┌─────────────────────────────────────────┐
│  Install Eva Chatbot                    │
│                                         │
│  This app will be able to:             │
│  ✓ Read and modify products            │
│  ✓ Read customers                      │
│  ✓ Read orders                         │
│                                         │
│  [Install app]  ← Click                │
└─────────────────────────────────────────┘
```

---

## 🎨 Paso 9: Activar Widget

### Shopify Admin → Themes

```
┌─────────────────────────────────────────┐
│  Online Store > Themes                  │
│                                         │
│  Current theme                          │
│  ┌─────────────────────┐               │
│  │ Dawn                │               │
│  │ [Customize]  ←─────┼─ Click        │
│  └─────────────────────┘               │
└─────────────────────────────────────────┘
```

---

### Theme Editor

```
┌───────────────┬─────────────────────────┐
│ Sections      │                         │
│               │  (preview de la tienda) │
│ ▼ Header      │                         │
│ ▼ Main        │                         │
│ ▼ Footer      │                         │
│               │                         │
│ (scroll abajo)│                         │
│               │                         │
│ App embeds    │  ← Buscar aquí         │
│ ─────────     │                         │
│ ☐ Eva Chat... │  ← Activar este toggle │
│               │                         │
│ [Save] ←──────┼─ Click después         │
└───────────────┴─────────────────────────┘
```

**Qué hacer**:
1. Scroll hasta abajo en el panel izquierdo
2. Busca "App embeds"
3. Activa el toggle de "Eva Chat Widget"
4. Click "Save" (arriba a la derecha)

---

## 🎉 Paso 10: ¡Probar!

### Ver Tienda

```
┌─────────────────────────────────────────┐
│  (Theme Editor, arriba)                 │
│                                         │
│  [View online store] ← Click           │
└─────────────────────────────────────────┘
```

---

### Tu Tienda con Eva

```
┌─────────────────────────────────────────┐
│  TU TIENDA                              │
│                                         │
│  Products    Collections    About      │
│                                         │
│  [Product images and content]          │
│                                         │
│                                         │
│                                 ┌─────┐ │
│                                 │  💬 │ │
│                                 └─────┘ │
│                        ↑ Botón de Eva   │
└─────────────────────────────────────────┘
```

**Click el botón 💬**:

```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐   │
│  │ Eva - Asistente      [×]       │   │
│  │ ● En línea                     │   │
│  ├─────────────────────────────────┤   │
│  │                                 │   │
│  │ Hola! Soy Eva, tu asistente... │   │
│  │                                 │   │
│  ├─────────────────────────────────┤   │
│  │ Escribe tu mensaje...    [▶]   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Escribe**: "Hola, ¿qué servicios ofrecen?"

**Eva responde**: "¡Hola! En SinVello ofrecemos..."

---

## ✅ ¡Funcionando!

Si llegaste aquí y Eva responde, **¡LO LOGRASTE!** 🎉

### Verifica Google Sheets

1. Abre tu Google Sheet
2. Deberías ver una nueva fila:
   ```
   | thread_xxx | Hola, ¿qué... | ¡Hola! En... | 2025-01-15... | N/A |
   ```

---

## 🐛 Si algo no funciona

### Render dice "Service Unavailable"
**Causa**: App dormida (plan free)
**Fix**: Espera 60 segundos, se despierta

### Widget no aparece
1. ¿Activaste en Theme Editor → App embeds?
2. Ctrl+Shift+R (limpiar caché)
3. Verifica que build haya terminado en Render

### Chat no responde
1. F12 → Console → Busca errores
2. Render → Logs → Busca "Error"
3. Verifica variables de entorno

---

## 📞 Ayuda Extra

Si sigues teniendo problemas:
1. Lee `RENDER_DEPLOYMENT_GUIDE.md` (detalles completos)
2. Revisa `RENDER_SIMPLE.md` (checklist rápido)
3. Verifica cada variable de entorno (paso 5)

**La mayoría de problemas son**: Variable mal escrita o sin configurar.

---

¡Éxito! 🚀
