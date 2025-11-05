# 🚀 Guía Rápida de Instalación - Eva Chatbot

Esta guía te llevará de cero a tener Eva funcionando en tu tienda Shopify en aproximadamente 30 minutos.

## ✅ Checklist Pre-Instalación

Antes de empezar, asegúrate de tener:

- [ ] Node.js 18+ instalado ([descargar](https://nodejs.org/))
- [ ] Una tienda de desarrollo de Shopify ([crear una](https://shopify.dev/docs/apps/tools/development-stores))
- [ ] API Key de OpenAI ([obtener](https://platform.openai.com/api-keys))
- [ ] Credenciales de Google Service Account ([crear](https://console.cloud.google.com/))
- [ ] PostgreSQL instalado localmente o acceso a una instancia ([Railway](https://railway.app/) es gratis para empezar)

## 📋 Pasos de Instalación

### 1. Instalar Shopify CLI (si no lo tienes)

```bash
npm install -g @shopify/cli @shopify/app
```

Verifica la instalación:
```bash
shopify version
```

### 2. Preparar el Proyecto

```bash
# Navegar al directorio del proyecto
cd shopify-app

# Instalar dependencias
npm install

# Instalar dependencias del widget
cd extensions/eva-chat-widget
npm install
cd ../..
```

### 3. Crear la App en Shopify Partners

1. Ve a [partners.shopify.com](https://partners.shopify.com/)
2. Click en **Apps** en el menú
3. Click en **Create app**
4. Selecciona **Create app manually**
5. Dale un nombre: "Eva Chatbot"
6. Guarda la **API Key** y **API Secret**

### 4. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# De Shopify Partners
SHOPIFY_API_KEY=tu_api_key_aqui
SHOPIFY_API_SECRET=tu_api_secret_aqui

# De OpenAI Platform
OPENAI_API_KEY=sk-proj-TU_KEY_AQUI
OPENAI_ASSISTANT_ID=asst_TJPRY2nXzvcemLVRdw1NQ7AR

# De Google Cloud Console
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----"
GOOGLE_SPREADSHEET_ID=1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o

# Database (Railway o local)
DATABASE_URL=postgresql://user:password@host:5432/database
```

### 5. Configurar Google Sheets

#### a) Crear Service Account

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**:
   - Menu > APIs & Services > Library
   - Busca "Google Sheets API"
   - Click **Enable**
4. Crea credenciales:
   - Menu > APIs & Services > Credentials
   - Click **Create Credentials** > **Service Account**
   - Dale un nombre: "Eva Chatbot"
   - Click **Create and Continue**
   - Click **Done**
5. Genera la key:
   - Click en el service account creado
   - Tab **Keys** > **Add Key** > **Create new key**
   - Selecciona **JSON**
   - Se descargará un archivo JSON

#### b) Configurar Permisos

1. Abre el archivo JSON descargado
2. Copia el valor de `client_email`
3. Abre tu Google Sheet (ID: `1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o`)
4. Click en **Share**
5. Pega el email del service account
6. Dale permisos de **Editor**
7. Click **Send**

#### c) Extraer Credenciales para .env

Del archivo JSON descargado:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY` (mantén los `\n`)

### 6. Configurar Base de Datos

#### Opción A: Local (PostgreSQL)

```bash
# Si no tienes PostgreSQL instalado:
# macOS
brew install postgresql@14
brew services start postgresql@14

# Crear base de datos
createdb eva_chatbot

# Actualizar .env
DATABASE_URL=postgresql://localhost:5432/eva_chatbot
```

#### Opción B: Railway (Recomendado)

1. Ve a [railway.app](https://railway.app/)
2. Click **Start a New Project**
3. Selecciona **Provision PostgreSQL**
4. Click en el servicio PostgreSQL
5. Tab **Connect** > Copia la **Connection String**
6. Pégala en `.env` como `DATABASE_URL`

### 7. Inicializar Base de Datos

```bash
# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate
```

### 8. Construir el Widget

```bash
cd extensions/eva-chat-widget
npm run build
cd ../..
```

Deberías ver un archivo creado en `extensions/eva-chat-widget/dist/`.

### 9. Vincular con Shopify

```bash
npm run config:link
```

Esto te preguntará:
- Organización de Partners: Selecciona la tuya
- App: Selecciona "Eva Chatbot"

Se actualizará `shopify.app.toml` automáticamente.

### 10. Ejecutar en Desarrollo

```bash
npm run dev
```

Esto:
1. Inicia el servidor Remix
2. Crea un túnel con ngrok/cloudflare
3. Abre el navegador con tu tienda de desarrollo

### 11. Instalar en tu Tienda de Desarrollo

1. Cuando se abra el navegador, verás una pantalla de instalación
2. Click **Install app**
3. Autoriza los permisos
4. ¡La app está instalada! 🎉

### 12. Activar el Widget en el Tema

1. En el admin de Shopify, ve a **Online Store** > **Themes**
2. Click **Customize** en tu tema
3. En el panel izquierdo, busca **App embeds** (parte inferior)
4. Encuentra **Eva Chat Widget**
5. Activa el toggle ✅
6. Click **Save**

### 13. ¡Probar!

1. Ve a tu tienda (botón **View online store** en Shopify)
2. Deberías ver el botón flotante de Eva en la esquina inferior derecha
3. Click en el botón
4. Escribe un mensaje: "Hola, ¿qué tratamientos ofrecen?"
5. Eva debería responder! 🎉

## 🧪 Verificar que Todo Funciona

### Test 1: Chat Responde
- Abre el chat
- Envía: "Hola"
- Deberías recibir una respuesta de Eva

### Test 2: Google Sheets Guarda
- Abre tu Google Sheet
- Deberías ver una nueva fila con la conversación

### Test 3: Productos de Shopify
- Asegúrate de tener productos en tu tienda
- Pregunta: "¿Qué productos tienen?"
- Eva debería mencionar productos de tu catálogo

## 🐛 Problemas Comunes

### "Error al crear thread"
- Verifica que `OPENAI_API_KEY` sea correcta
- Comprueba que tengas créditos en OpenAI

### "Error al guardar en Google Sheets"
- Verifica que el service account tenga permisos en la hoja
- Comprueba que `GOOGLE_SPREADSHEET_ID` sea correcto
- Asegúrate de que la private key esté bien formateada

### "Database error"
- Verifica que PostgreSQL esté corriendo
- Comprueba que `DATABASE_URL` sea correcta
- Intenta: `npx prisma migrate reset`

### El widget no aparece
- Ve a Theme Editor > App embeds
- Asegúrate de que Eva Chat Widget esté activado
- Verifica que el widget esté construido (`cd extensions/eva-chat-widget && npm run build`)

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. **Personaliza el asistente** en [OpenAI Platform](https://platform.openai.com/assistants)
2. **Ajusta los colores** desde el Theme Editor
3. **Añade más productos** a tu tienda para mejorar las recomendaciones
4. **Revisa las conversaciones** en Google Sheets
5. **Prepara para producción** (ver README.md)

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:

1. **Revisa los logs** en la terminal donde corre `npm run dev`
2. **Inspecciona la consola** del navegador (F12)
3. **Verifica el archivo `.env`** - todas las variables deben estar configuradas
4. **Reinicia el servidor** - Ctrl+C y luego `npm run dev` de nuevo

## ✅ Checklist Final

- [ ] App instalada en Shopify
- [ ] Widget aparece en la tienda
- [ ] Chat responde mensajes
- [ ] Conversaciones se guardan en Google Sheets
- [ ] El asistente menciona productos de la tienda

Si todo está ✅, ¡felicitaciones! Eva está funcionando correctamente.

---

**¿Listo para producción?** Lee el archivo `README.md` para instrucciones de deployment.
