# 🚀 Guía de Deployment a Producción - Eva Chatbot

Esta guía te ayudará a llevar Eva Chatbot de desarrollo a producción.

## 📋 Pre-requisitos de Producción

- [ ] App funcionando correctamente en desarrollo
- [ ] Cuenta en plataforma de hosting (Railway, Heroku, etc.)
- [ ] Dominio personalizado (opcional pero recomendado)
- [ ] OpenAI API con billing configurado
- [ ] Base de datos PostgreSQL en producción

## 🎯 Opciones de Hosting

### Opción 1: Railway (Recomendado - Más Fácil)

Railway es perfecto para apps Remix y tiene integración con GitHub.

#### Paso 1: Preparar el Proyecto

1. Crea un repositorio en GitHub (si no lo has hecho)
2. Asegúrate de que `.env` esté en `.gitignore`
3. Push del código:

```bash
git init
git add .
git commit -m "Initial commit - Eva Chatbot"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/eva-chatbot.git
git push -u origin main
```

#### Paso 2: Deploy en Railway

1. Ve a [railway.app](https://railway.app/)
2. Click **Start a New Project**
3. Selecciona **Deploy from GitHub repo**
4. Autoriza Railway a acceder a tu repo
5. Selecciona el repositorio `eva-chatbot`
6. Railway detectará automáticamente que es un proyecto Node.js

#### Paso 3: Añadir PostgreSQL

1. En tu proyecto de Railway, click **+ New**
2. Selecciona **Database** > **Add PostgreSQL**
3. Railway creará automáticamente la variable `DATABASE_URL`

#### Paso 4: Configurar Variables de Entorno

En Railway:
1. Click en tu servicio principal
2. Tab **Variables**
3. Click **Raw Editor**
4. Pega todas las variables de tu `.env`:

```env
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...
OPENAI_API_KEY=...
OPENAI_ASSISTANT_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_SPREADSHEET_ID=...
NODE_ENV=production
```

#### Paso 5: Configurar el Build

Railway debería detectar automáticamente los scripts de build, pero verifica:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`

Si necesitas configurarlo manualmente:
- Settings > Deploy > Build Command
- Settings > Deploy > Start Command

#### Paso 6: Obtener la URL

1. Una vez que el deploy termine, Railway te dará una URL
2. Cópiala (ej: `eva-chatbot-production.up.railway.app`)

#### Paso 7: Actualizar Shopify App

1. Edita `shopify.app.toml`:

```toml
application_url = "https://eva-chatbot-production.up.railway.app"

[auth]
redirect_urls = [
  "https://eva-chatbot-production.up.railway.app/auth/callback",
  "https://eva-chatbot-production.up.railway.app/auth/shopify/callback",
  "https://eva-chatbot-production.up.railway.app/api/auth/callback"
]
```

2. Push los cambios y Railway re-deployará automáticamente

#### Paso 8: Ejecutar Migraciones

En Railway:
1. Click en tu servicio
2. Tab **Deployments** > Click en el deployment activo
3. Click **View Logs**
4. Si no ves errores de Prisma, las migraciones deberían haberse ejecutado

Si necesitas ejecutar manualmente:
```bash
# En tu terminal local, con la DATABASE_URL de producción
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

### Opción 2: Heroku

#### Paso 1: Instalar Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows/Linux
# Descarga desde https://devcenter.heroku.com/articles/heroku-cli
```

#### Paso 2: Login y Crear App

```bash
heroku login
heroku create eva-chatbot-production
```

#### Paso 3: Añadir PostgreSQL

```bash
heroku addons:create heroku-postgresql:mini
```

#### Paso 4: Configurar Variables de Entorno

```bash
heroku config:set SHOPIFY_API_KEY=tu_key
heroku config:set SHOPIFY_API_SECRET=tu_secret
heroku config:set OPENAI_API_KEY=tu_key
heroku config:set OPENAI_ASSISTANT_ID=tu_id
heroku config:set GOOGLE_SERVICE_ACCOUNT_EMAIL=tu_email
heroku config:set GOOGLE_PRIVATE_KEY="tu_key_con_\n"
heroku config:set GOOGLE_SPREADSHEET_ID=tu_id
heroku config:set NODE_ENV=production
```

#### Paso 5: Añadir Buildpacks

```bash
heroku buildpacks:add heroku/nodejs
```

#### Paso 6: Deploy

```bash
git push heroku main
```

#### Paso 7: Ejecutar Migraciones

```bash
heroku run npx prisma migrate deploy
```

#### Paso 8: Abrir App

```bash
heroku open
```

---

### Opción 3: DigitalOcean App Platform

#### Paso 1: Crear App

1. Ve a [cloud.digitalocean.com](https://cloud.digitalocean.com/)
2. Click **Create** > **Apps**
3. Conecta tu repositorio de GitHub
4. Selecciona el branch `main`

#### Paso 2: Configurar Build

```
Build Command: npm run build
Run Command: npm start
```

#### Paso 3: Añadir PostgreSQL

1. Click **Add Resource** > **Database**
2. Selecciona PostgreSQL
3. Selecciona el plan (Basic $7/mes)

#### Paso 4: Variables de Entorno

En la sección de Environment Variables, añade todas tus variables.

---

## 🔄 Configurar Dominio Personalizado (Opcional)

### En Railway

1. Settings > Networking > Custom Domain
2. Ingresa tu dominio (ej: `eva.tutienda.com`)
3. Configura el registro CNAME en tu proveedor de dominio

### En Heroku

```bash
heroku domains:add eva.tutienda.com
```

Luego configura el CNAME en tu proveedor de dominio.

---

## 🔧 Post-Deployment

### 1. Actualizar Shopify App Config

Una vez que tengas tu URL de producción:

```bash
# Actualizar configuración en Shopify
npm run config:push
```

### 2. Re-instalar la App

Si ya tenías la app instalada en desarrollo:
1. Desinstala la app de tu tienda
2. Re-instálala usando la nueva URL de producción

### 3. Verificar Logs

Railway:
- Deployments > View Logs

Heroku:
```bash
heroku logs --tail
```

### 4. Probar Todo

- [ ] App se instala correctamente
- [ ] Widget aparece en la tienda
- [ ] Chat responde mensajes
- [ ] Google Sheets guarda conversaciones
- [ ] Productos de Shopify se incluyen en respuestas

---

## 🔒 Seguridad en Producción

### 1. Rotar API Keys

Nunca uses las mismas keys de desarrollo en producción:
- Crea nuevas API keys en OpenAI
- Genera nuevas credenciales de Google Service Account
- Usa diferentes spreadsheets para dev/prod

### 2. Monitoreo de Errores

Considera añadir un servicio de monitoreo:
- [Sentry](https://sentry.io/) - Tracking de errores
- [LogRocket](https://logrocket.com/) - Session replay
- [Datadog](https://www.datadoghq.com/) - APM y logs

Instalación de Sentry:

```bash
npm install @sentry/remix
```

```typescript
// En app/entry.server.tsx
import * as Sentry from "@sentry/remix";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 3. Rate Limiting

Considera añadir rate limiting para proteger tu API de OpenAI:

```bash
npm install express-rate-limit
```

### 4. CORS

Si planeas usar el widget desde otros dominios:

```typescript
// En las rutas API
export const headers = () => ({
  "Access-Control-Allow-Origin": "https://tutienda.myshopify.com",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
});
```

---

## 📊 Monitoreo y Métricas

### Google Sheets Analytics

Puedes crear un dashboard en Google Sheets con fórmulas:

```
=COUNTIF(A:A, ">0")  // Total de conversaciones
=COUNTA(E:E)         // Conversaciones con cliente identificado
```

### OpenAI Usage

Monitorea tu uso de OpenAI:
1. Ve a [platform.openai.com/usage](https://platform.openai.com/usage)
2. Configura alertas de presupuesto

---

## 🔄 CI/CD Automático (Opcional)

### GitHub Actions con Railway

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install Railway
        run: npm i -g @railway/cli

      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

Configura `RAILWAY_TOKEN` en GitHub Secrets.

---

## 🐛 Troubleshooting en Producción

### Logs no aparecen

Railway:
```bash
railway logs
```

Heroku:
```bash
heroku logs --tail
```

### Error "Prisma Client not generated"

```bash
# Añade postinstall script en package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Error de CORS

Verifica que las URLs en `shopify.app.toml` coincidan con tu dominio de producción.

### Performance lento

1. Verifica el plan de tu hosting (upgradealo si es necesario)
2. Considera añadir caching con Redis
3. Optimiza las queries de Shopify GraphQL

---

## 📈 Escalar en Producción

### Si tienes mucho tráfico:

1. **Upgrade del hosting**:
   - Railway: Sube al plan Pro
   - Heroku: Dynos adicionales

2. **Base de datos**:
   - Considera un plan más grande de PostgreSQL
   - Añade read replicas si es necesario

3. **Caching**:
   - Añade Redis para cachear respuestas frecuentes
   - Cachea productos de Shopify

4. **CDN**:
   - Sirve el widget desde un CDN (Cloudflare, AWS CloudFront)

---

## ✅ Checklist Final de Producción

Antes de lanzar oficialmente:

- [ ] Todas las variables de entorno configuradas
- [ ] Base de datos de producción funcionando
- [ ] Migraciones de Prisma ejecutadas
- [ ] Widget construido y deployado
- [ ] App instalada y funcionando en tienda
- [ ] Google Sheets guardando conversaciones
- [ ] OpenAI respondiendo correctamente
- [ ] Productos de Shopify accesibles
- [ ] SSL/HTTPS habilitado
- [ ] Dominio personalizado configurado (opcional)
- [ ] Logs siendo monitoreados
- [ ] Backups de base de datos configurados

---

## 🎉 ¡Listo para Producción!

Una vez que todo esté ✅, tu Eva Chatbot estará sirviendo a tus clientes 24/7.

**Recomendación**: Mantén la versión de desarrollo corriendo en paralelo para testear nuevas funcionalidades antes de deployarlas a producción.

---

**Nota**: Para actualizaciones futuras, simplemente haz push a tu repositorio y tu plataforma de hosting re-deployará automáticamente.
