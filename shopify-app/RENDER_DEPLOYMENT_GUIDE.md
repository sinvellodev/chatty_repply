# 🎯 Guía Completa: Deploy a Render.com

## ✅ Checklist Rápido

- [ ] Código subido a GitHub
- [ ] Cuenta creada en Render.com
- [ ] PostgreSQL creado en Render
- [ ] Web Service creado en Render
- [ ] Variables de entorno configuradas
- [ ] App deployada y funcionando
- [ ] Migraciones de Prisma ejecutadas
- [ ] URL actualizada en Shopify
- [ ] App instalada en tienda de desarrollo

---

## 📝 Valores que Necesitas Preparar

Antes de empezar, ten a mano:

### 1. Shopify (de Shopify Partners)
- `SHOPIFY_API_KEY` - De tu app en partners.shopify.com
- `SHOPIFY_API_SECRET` - De tu app en partners.shopify.com
- Client ID - Lo obtendrás de partners.shopify.com

### 2. OpenAI (de platform.openai.com)
- `OPENAI_API_KEY` - Tu API key: `sk-proj-...`
- `OPENAI_ASSISTANT_ID` - Ya lo tienes: `asst_TJPRY2nXzvcemLVRdw1NQ7AR`

### 3. Google Cloud (de console.cloud.google.com)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - De tu service account
- `GOOGLE_PRIVATE_KEY` - La private key completa
- `GOOGLE_SPREADSHEET_ID` - Ya lo tienes: `1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o`

---

## 🚀 Paso a Paso

### Paso 1: Subir a GitHub

```bash
cd /Users/josegilartealvarez/Desktop/chatty_repply/shopify-app

# Inicializar git
git init
git add .
git commit -m "Initial commit - Eva Chatbot"

# En GitHub (web):
# 1. Crear nuevo repositorio "eva-shopify-chatbot"
# 2. Copiar la URL del repo

# Conectar y subir
git remote add origin https://github.com/TU_USUARIO/eva-shopify-chatbot.git
git branch -M main
git push -u origin main
```

---

### Paso 2: Crear PostgreSQL en Render

1. Ve a **[render.com](https://render.com)** → Sign up con GitHub
2. Click **"New +"** → **"PostgreSQL"**
3. Configuración:
   ```
   Name: eva-postgres
   Database: eva_chatbot
   Region: Oregon
   Plan: Free (90 días gratis)
   ```
4. Click **"Create Database"**
5. **IMPORTANTE**: Copia el **"External Database URL"**
   - Ejemplo: `postgresql://eva_user:pass123@dpg-xxx.oregon-postgres.render.com/eva_chatbot`

---

### Paso 3: Crear Web Service

1. Click **"New +"** → **"Web Service"**
2. **"Build and deploy from a Git repository"** → Next
3. Selecciona tu repo: `eva-shopify-chatbot`
4. Configuración:

```
Name: eva-chatbot
Region: Oregon
Branch: main
Runtime: Node

Build Command:
npm install && cd extensions/eva-chat-widget && npm install && npm run build && cd ../.. && npx prisma generate && npm run build

Start Command:
npm start

Plan: Free
```

5. **NO HAGAS CLICK EN "CREATE" TODAVÍA**

---

### Paso 4: Añadir Variables de Entorno

Scroll hasta **"Environment Variables"** y añade:

#### Variables Básicas
```bash
NODE_ENV = production
```

#### Base de Datos
```bash
DATABASE_URL = [PEGAR EL EXTERNAL URL DEL PASO 2]
```

#### Shopify
```bash
SHOPIFY_API_KEY = [Tu API Key de Shopify Partners]
SHOPIFY_API_SECRET = [Tu Secret de Shopify Partners]
SHOPIFY_APP_URL = https://placeholder.com
```
(Actualizaremos SHOPIFY_APP_URL después)

#### OpenAI
```bash
OPENAI_API_KEY = sk-proj-TU_KEY_AQUI
OPENAI_ASSISTANT_ID = asst_TJPRY2nXzvcemLVRdw1NQ7AR
```

#### Google Sheets
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL = tu-email@proyecto.iam.gserviceaccount.com
GOOGLE_SPREADSHEET_ID = 1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o
```

Para `GOOGLE_PRIVATE_KEY`:
1. Click el ícono de expandir (⤢)
2. Pega la key completa:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
(tu key completa, puede ser muy larga)
...
-----END PRIVATE KEY-----
```
3. Click "Save"

---

### Paso 5: Crear y Deployar

1. Scroll hasta abajo
2. Click **"Create Web Service"**
3. **Espera 10-15 minutos** (primera vez es lento)
4. Monitorea los logs (scroll en la página)

#### Logs que deberías ver:
```
==> Cloning from https://github.com/...
==> Running build command: npm install...
==> Installing dependencies...
==> Building widget...
==> Running Prisma generate...
==> Building Remix app...
==> Build successful
==> Starting server...
==> Your service is live 🎉
```

---

### Paso 6: Obtener URL y Actualizar

1. Cuando veas **"Live" 🟢**, copia tu URL
   - Ejemplo: `https://eva-chatbot-abc123.onrender.com`

2. Actualizar `SHOPIFY_APP_URL`:
   - Click **"Environment"** (menú izquierdo)
   - Edita `SHOPIFY_APP_URL`
   - Pega tu URL real
   - Save → Render re-deploya (2-3 min)

---

### Paso 7: Ejecutar Migraciones Prisma

#### Opción A: Desde tu Mac
```bash
# En tu terminal
DATABASE_URL="postgresql://[TU_DATABASE_URL_COMPLETO]" npx prisma migrate deploy
```

#### Opción B: Desde Render Shell
1. En Render, click **"Shell"** (menú izquierdo)
2. Ejecuta:
```bash
npx prisma migrate deploy
```

Deberías ver: `✓ Migrations applied successfully`

---

### Paso 8: Configurar Shopify App

#### A. Obtener Client ID

1. Ve a **[partners.shopify.com](https://partners.shopify.com)**
2. **Apps** → Tu app "Eva Chatbot"
3. **Configuration** → Copia el **"Client ID"**

#### B. Actualizar shopify.app.toml

En tu proyecto local, edita `shopify.app.toml`:

```toml
name = "eva-chatbot"
client_id = "TU_CLIENT_ID_AQUI"  # ← Pega el Client ID
application_url = "https://eva-chatbot-abc123.onrender.com"  # ← Tu URL de Render
embedded = true

[access_scopes]
scopes = "write_products,read_products,read_orders,read_customers"

[auth]
redirect_urls = [
  "https://eva-chatbot-abc123.onrender.com/auth/callback",
  "https://eva-chatbot-abc123.onrender.com/auth/shopify/callback",
  "https://eva-chatbot-abc123.onrender.com/api/auth/callback"
]

[webhooks]
api_version = "2024-01"

[pos]
embedded = false

[build]
automatically_update_urls_on_dev = false
dev_store_url = "TU_TIENDA.myshopify.com"  # ← Tu tienda de desarrollo
```

#### C. Actualizar en Shopify Partners

```bash
# Desde tu terminal
cd /Users/josegilartealvarez/Desktop/chatty_repply/shopify-app

# Push cambios
git add shopify.app.toml
git commit -m "Update production URLs"
git push

# Actualizar config en Shopify
npm run config:push
```

O manualmente en partners.shopify.com:
1. **Apps** → Eva Chatbot → **Configuration**
2. **App URL**: `https://eva-chatbot-abc123.onrender.com`
3. **Allowed redirection URL(s)**: Añade:
   ```
   https://eva-chatbot-abc123.onrender.com/auth/callback
   https://eva-chatbot-abc123.onrender.com/auth/shopify/callback
   https://eva-chatbot-abc123.onrender.com/api/auth/callback
   ```
4. Click **"Save"**

---

### Paso 9: Instalar en tu Tienda

1. En Shopify Partners, ve a tu app
2. Click **"Select store"** → Selecciona tu tienda de desarrollo
3. Click **"Install app"**
4. Autoriza los permisos
5. ¡Listo! La app está instalada

---

### Paso 10: Activar el Widget

1. En el admin de Shopify, ve a **Online Store** → **Themes**
2. Click **"Customize"** en tu tema activo
3. En el panel izquierdo, scroll hasta abajo → **"App embeds"**
4. Busca **"Eva Chat Widget"**
5. Activa el toggle ✅
6. Click **"Save"**

---

## 🧪 Probar que Funciona

1. Click **"View online store"** (arriba a la derecha)
2. Deberías ver el botón flotante de Eva (esquina inferior derecha)
3. Click en el botón → Se abre el chat
4. Escribe: "Hola, ¿qué servicios ofrecen?"
5. Eva debería responder

### Si funciona:
✅ Verifica en Google Sheets que se guardó la conversación

### Si NO funciona:
1. Abre DevTools (F12) → Console
2. Busca errores en rojo
3. En Render: Logs → Busca errores

---

## 🐛 Troubleshooting

### "Service Unavailable" o error 503
- La app está "dormida" (plan free duerme después de 15 min sin uso)
- Espera 30-60 segundos, se activará automáticamente

### "Cannot connect to OpenAI"
- Verifica `OPENAI_API_KEY` en Environment Variables
- Asegúrate de que no tenga espacios al inicio/final

### "Google Sheets error"
- Verifica que `GOOGLE_PRIVATE_KEY` tenga los saltos de línea correctos
- Verifica que el service account tenga acceso a la hoja

### "Prisma Client not found"
- Ejecuta las migraciones (Paso 7)
- O en Render Shell: `npx prisma generate`

### Widget no aparece
- Verifica que esté activado en Theme Editor → App embeds
- Verifica que el widget esté construido correctamente (logs de build)
- Clear caché del navegador (Ctrl+Shift+R)

---

## 💰 Costos de Render.com

### Plan Free
- **Web Service**: GRATIS
  - ⚠️ Duerme después de 15 min sin uso
  - ⚠️ 750 horas/mes (suficiente para testing)

- **PostgreSQL**: GRATIS por 90 días
  - ⚠️ Después: $7/mes
  - Alternativa: Migrar a otro servicio free

### Para evitar costos después de 90 días
Opciones:
1. Migrar DB a otro servicio (Supabase, Neon.tech - tienen planes gratis)
2. Pagar $7/mes (si la app ya genera valor)
3. Migrar todo a otro servicio

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
# 1. Editar código
# 2. Commit y push
git add .
git commit -m "Descripción del cambio"
git push

# 3. Render auto-deploya (5-10 min)
```

### Monitorear deploy
- Ve a Render Dashboard
- Tu servicio mostrará "Deploying" → "Live"

---

## 📊 Monitoreo

### Ver logs en tiempo real
1. Render Dashboard → Tu servicio
2. **Logs** (menú izquierdo)
3. Auto-scroll activado

### Métricas
- **Metrics** → CPU, Memory, Request rate

### Alertas
- **Settings** → **Notifications**
- Añade tu email para recibir alertas de errores

---

## ✅ Checklist Final

Antes de considerar el deploy completo:

- [ ] App deployada en Render (status: Live 🟢)
- [ ] Database creada y conectada
- [ ] Todas las variables de entorno configuradas
- [ ] Migraciones ejecutadas correctamente
- [ ] URL actualizada en Shopify Partners
- [ ] App instalada en tienda de desarrollo
- [ ] Widget activado en Theme Editor
- [ ] Chat funciona y responde
- [ ] Conversaciones se guardan en Google Sheets
- [ ] Productos de Shopify aparecen en respuestas (si los mencionas)

---

## 🎉 ¡Felicitaciones!

Si llegaste aquí, tu Eva Chatbot está funcionando en producción con Render.com 🚀

**Limitaciones del plan Free**:
- ✅ Perfecto para testing y desarrollo
- ⚠️ La app "duerme" (30-60s para despertar)
- ⚠️ PostgreSQL gratis solo 90 días

**Para producción real**: Considera upgrade a plan pago ($7-25/mes) o migrar a Railway/Heroku.

---

## 📞 Próximos Pasos

1. **Testea extensivamente**: Usa el chat, prueba diferentes preguntas
2. **Revisa Google Sheets**: Verifica que todo se guarde correctamente
3. **Optimiza el asistente**: Ajusta prompts en OpenAI Platform
4. **Personaliza colores**: Desde Theme Editor
5. **Monitorea costos**: Revisa uso de OpenAI API

---

**¿Preguntas?** Revisa la sección de Troubleshooting o los logs en Render.
