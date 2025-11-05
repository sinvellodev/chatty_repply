# 🚀 Render.com en 10 Pasos SIMPLES

## ¿Qué es Render?
Es como un "botón mágico" que toma tu código y lo pone en internet. NO necesitas saber de servidores.

---

## 📋 Lo que necesitas tener listo (5 minutos)

Abre un documento de texto y copia estos valores:

```
SHOPIFY_API_KEY = [De partners.shopify.com]
SHOPIFY_API_SECRET = [De partners.shopify.com]
OPENAI_API_KEY = sk-proj-[tu key]
OPENAI_ASSISTANT_ID = asst_TJPRY2nXzvcemLVRdw1NQ7AR
GOOGLE_SERVICE_ACCOUNT_EMAIL = [tu email]
GOOGLE_PRIVATE_KEY = [tu key completa con BEGIN y END]
GOOGLE_SPREADSHEET_ID = 1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o
```

---

## 🎯 10 Pasos (30 minutos total)

### 1️⃣ Subir a GitHub (5 min)

```bash
cd /Users/josegilartealvarez/Desktop/chatty_repply/shopify-app

git init
git add .
git commit -m "Mi chatbot Eva"

# Ir a github.com → New repository → "eva-chatbot"
# Copiar la URL que te da

git remote add origin https://github.com/TU_USUARIO/eva-chatbot.git
git push -u origin main
```

---

### 2️⃣ Crear cuenta en Render (1 min)

1. Ve a **render.com**
2. Click **"Sign up with GitHub"**
3. Autoriza Render

---

### 3️⃣ Crear base de datos (2 min)

1. En Render, click **"New +"** arriba
2. Click **"PostgreSQL"**
3. Nombre: `eva-postgres`
4. Plan: **Free** (90 días gratis)
5. Click **"Create Database"**
6. **COPIAR** el "External Database URL" (lo necesitarás en paso 5)

Ejemplo de URL:
```
postgresql://usuario:password@dpg-xxx.oregon-postgres.render.com/eva_chatbot
```

---

### 4️⃣ Crear tu app (3 min)

1. Click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from Git"**
3. Selecciona tu repo: `eva-chatbot`
4. Configuración:

```
Name: eva-chatbot
Branch: main
Runtime: Node

Build Command: (copiar y pegar esto completo)
npm install && cd extensions/eva-chat-widget && npm install && npm run build && cd ../.. && npx prisma generate && npm run build

Start Command: (copiar y pegar esto)
npm start

Plan: Free
```

5. **NO HACER CLICK EN CREATE TODAVÍA**

---

### 5️⃣ Añadir variables (10 min)

Scroll hasta "Environment Variables" y añade una por una:

#### Variable 1
```
Key: NODE_ENV
Value: production
```

#### Variable 2
```
Key: DATABASE_URL
Value: [PEGA EL URL DEL PASO 3]
```

#### Variable 3-9 (copia del documento que preparaste)
```
Key: SHOPIFY_API_KEY
Value: [tu valor]

Key: SHOPIFY_API_SECRET
Value: [tu valor]

Key: OPENAI_API_KEY
Value: [tu valor]

Key: OPENAI_ASSISTANT_ID
Value: asst_TJPRY2nXzvcemLVRdw1NQ7AR

Key: GOOGLE_SERVICE_ACCOUNT_EMAIL
Value: [tu valor]

Key: GOOGLE_SPREADSHEET_ID
Value: 1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o

Key: SHOPIFY_APP_URL
Value: https://placeholder.com
```

#### Variable 10 (la más larga)
```
Key: GOOGLE_PRIVATE_KEY
Value: [Click el ícono de expandir y pega la key completa]
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhki...
(todo el texto)
...
-----END PRIVATE KEY-----
```

---

### 6️⃣ Deployar (1 click, esperar 10 min)

1. Scroll hasta abajo
2. Click **"Create Web Service"**
3. Ve a hacer un café ☕
4. Espera hasta ver **"Live" 🟢**

---

### 7️⃣ Copiar tu URL (1 min)

1. Cuando veas "Live 🟢"
2. Arriba verás algo como: `https://eva-chatbot-abc123.onrender.com`
3. **COPIAR ESTA URL**

---

### 8️⃣ Actualizar URL (2 min)

1. Click **"Environment"** (menú izquierdo)
2. Busca `SHOPIFY_APP_URL`
3. Click el lápiz (editar)
4. Pega tu URL real
5. Save
6. Espera 2 minutos a que re-deploya

---

### 9️⃣ Configurar base de datos (2 min)

#### Opción A: Desde tu Mac
```bash
DATABASE_URL="[TU_URL_DE_BD_DEL_PASO_3]" npx prisma migrate deploy
```

#### Opción B: Desde Render
1. Click **"Shell"** (menú izquierdo)
2. Cuando se abra, escribe:
```bash
npx prisma migrate deploy
```

---

### 🔟 Configurar Shopify (5 min)

1. Ve a **partners.shopify.com** → Tu app
2. Configuration → Copia el **Client ID**
3. En tu Mac, edita `shopify.app.toml`:

```toml
client_id = "TU_CLIENT_ID_AQUI"
application_url = "https://eva-chatbot-abc123.onrender.com"

[auth]
redirect_urls = [
  "https://eva-chatbot-abc123.onrender.com/auth/callback",
  "https://eva-chatbot-abc123.onrender.com/auth/shopify/callback",
  "https://eva-chatbot-abc123.onrender.com/api/auth/callback"
]
```

4. Guarda y push:
```bash
git add shopify.app.toml
git commit -m "Update URLs"
git push
```

---

## ✅ Instalar y Probar (5 min)

### Instalar en Shopify
1. partners.shopify.com → Tu app
2. "Select store" → Tu tienda de desarrollo
3. "Install app"
4. Autorizar

### Activar widget
1. Shopify Admin → Online Store → Themes
2. Customize → App embeds (abajo)
3. Activar "Eva Chat Widget" ✅
4. Save

### Probar
1. "View online store"
2. Busca el botón flotante (esquina inferior derecha)
3. Click → Escribe "Hola"
4. Eva debe responder

---

## 🐛 Si algo falla

### Error 503 / App no responde
- **Causa**: App dormida (plan free)
- **Solución**: Espera 60 segundos, se despierta sola

### Widget no aparece
- ¿Activaste en Theme Editor → App embeds?
- Recarga con Ctrl+Shift+R (limpiar caché)

### Chat no responde
1. F12 → Console → Busca errores rojos
2. Render Dashboard → Logs → Busca errores
3. Verifica variables de entorno (paso 5)

### "Cannot connect to database"
- Verifica que `DATABASE_URL` sea correcto
- Ejecuta las migraciones (paso 9)

---

## 💰 ¿Cuánto cuesta?

### Gratis (para empezar)
- Web Service: GRATIS
- PostgreSQL: GRATIS por 90 días

### Después de 90 días
- PostgreSQL: $7/mes
- O migras a otro servicio gratis (Supabase, Neon)

### OpenAI (aparte)
- ~$10-30/mes según uso
- Configura límites en platform.openai.com

---

## 🎉 ¡Listo!

Si llegaste aquí, tu chatbot está VIVO en internet 🚀

**Limitaciones plan gratis**:
- Duerme después de 15 min sin uso
- Tarda 30-60s en despertar
- Perfecto para testing

**Para uso real con clientes**: Considera plan pago ($7-14/mes) para que nunca duerma.

---

## 📱 Siguiente

1. ✅ Prueba extensivamente
2. 🎨 Personaliza colores (Theme Editor)
3. 🤖 Optimiza respuestas (OpenAI Platform)
4. 📊 Revisa conversaciones (Google Sheets)

---

**¿Dudas?** Lee `RENDER_DEPLOYMENT_GUIDE.md` para detalles completos.
