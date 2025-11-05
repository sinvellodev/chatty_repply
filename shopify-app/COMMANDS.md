# 🔧 Comandos Útiles - Eva Chatbot

Referencia rápida de comandos para desarrollo y mantenimiento.

---

## 📦 Instalación Inicial

```bash
# Instalar dependencias del backend
cd shopify-app
npm install

# Instalar dependencias del widget
cd extensions/eva-chat-widget
npm install
cd ../..

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Inicializar base de datos
npx prisma migrate dev
npx prisma generate
```

---

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo (hace todo automáticamente)
npm run dev

# Construir el widget manualmente
cd extensions/eva-chat-widget
npm run build
cd ../..

# Ver la base de datos en interfaz visual
npx prisma studio
```

---

## 🏗️ Build y Deploy

```bash
# Build de producción
npm run build

# Deploy a Shopify
npm run deploy

# Actualizar configuración de la app
npm run config:push

# Vincular con app de Shopify Partners
npm run config:link

# Ver información de la app
npm run info
```

---

## 🗄️ Base de Datos (Prisma)

```bash
# Crear una nueva migración
npx prisma migrate dev --name nombre_de_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset

# Regenerar el cliente Prisma (después de cambios en schema)
npx prisma generate

# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Ver estado de migraciones
npx prisma migrate status

# Formatear schema.prisma
npx prisma format
```

---

## 🔍 Debugging y Logs

```bash
# Ver logs en Railway
railway logs

# Ver logs en Heroku
heroku logs --tail

# Ver logs específicos de Shopify
npm run dev # y buscar en la terminal

# Limpiar caché de Node
rm -rf node_modules
npm install

# Limpiar build del widget
cd extensions/eva-chat-widget
rm -rf dist
npm run build
cd ../..
```

---

## 🧪 Testing

```bash
# Probar conexión a OpenAI (crear archivo test.js)
node -e "const OpenAI = require('openai'); const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY}); client.models.list().then(r => console.log('✅ OpenAI OK')).catch(e => console.error('❌', e));"

# Probar conexión a Google Sheets (crear archivo test-sheets.js)
node test-sheets.js

# Verificar variables de entorno
npm run dev # Verifica que todas las vars estén configuradas
```

---

## 🔧 Mantenimiento

```bash
# Actualizar dependencias (cuidado con breaking changes)
npm update

# Ver dependencias desactualizadas
npm outdated

# Actualizar Shopify CLI
npm install -g @shopify/cli@latest

# Limpiar todo y reinstalar
rm -rf node_modules package-lock.json
rm -rf extensions/eva-chat-widget/node_modules
rm -rf extensions/eva-chat-widget/package-lock.json
npm install
cd extensions/eva-chat-widget && npm install
cd ../..
```

---

## 🎨 Desarrollo del Widget

```bash
# Entrar al directorio del widget
cd extensions/eva-chat-widget

# Modo desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Ver el bundle generado
ls -lh dist/

# Limpiar y reconstruir
rm -rf dist node_modules
npm install
npm run build

# Volver al directorio raíz
cd ../..
```

---

## 🌐 Shopify CLI

```bash
# Login en Shopify
shopify auth login

# Logout
shopify auth logout

# Ver versión
shopify version

# Crear nueva extensión
shopify app generate extension

# Ver información de la app
shopify app info

# Listar todas las apps
shopify app list

# Abrir app en el navegador
shopify app open
```

---

## 📊 Google Sheets

```bash
# Ver IDs de spreadsheets (necesitas crear script)
# Abre https://script.google.com y ejecuta:
# function listSpreadsheets() {
#   var files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
#   while (files.hasNext()) {
#     var file = files.next();
#     Logger.log('%s (ID: %s)', file.getName(), file.getId());
#   }
# }
```

---

## 🔐 Seguridad y Credenciales

```bash
# Rotar API Key de OpenAI
# 1. Genera nueva key en platform.openai.com
# 2. Actualiza .env localmente
# 3. Actualiza en Railway/Heroku:
railway variables set OPENAI_API_KEY=nueva_key
# o
heroku config:set OPENAI_API_KEY=nueva_key

# Ver todas las variables de entorno (Railway)
railway variables

# Ver todas las variables de entorno (Heroku)
heroku config

# Editar variable específica (Railway)
railway variables set VARIABLE_NAME=value

# Editar variable específica (Heroku)
heroku config:set VARIABLE_NAME=value
```

---

## 🚨 Comandos de Emergencia

```bash
# Si el servidor no responde
# Ctrl+C para detener
# Luego:
rm -rf .cache
npm run dev

# Si Prisma no encuentra el cliente
npx prisma generate

# Si hay errores de tipos en TypeScript
rm -rf node_modules
npm install
npx prisma generate

# Si el widget no carga
cd extensions/eva-chat-widget
rm -rf dist node_modules
npm install
npm run build
cd ../..

# Si hay conflictos de git
git reset --hard HEAD
git pull origin main

# Restaurar base de datos desde backup (Railway)
# Desde dashboard: Database > Backups > Restore

# Ver estado del servidor (Railway)
railway status

# Reiniciar servidor (Railway)
railway restart

# Ver estado del servidor (Heroku)
heroku ps

# Reiniciar servidor (Heroku)
heroku restart
```

---

## 📦 Scripts Personalizados

Añade estos scripts a `package.json` para comandos frecuentes:

```json
{
  "scripts": {
    "dev": "shopify app dev",
    "build": "shopify app build",
    "deploy": "shopify app deploy",
    "db:migrate": "npx prisma migrate dev",
    "db:push": "npx prisma db push",
    "db:studio": "npx prisma studio",
    "db:reset": "npx prisma migrate reset",
    "widget:build": "cd extensions/eva-chat-widget && npm run build",
    "widget:dev": "cd extensions/eva-chat-widget && npm run dev",
    "clean": "rm -rf node_modules .cache dist",
    "clean:all": "rm -rf node_modules .cache dist extensions/*/node_modules extensions/*/dist",
    "fresh": "npm run clean:all && npm install",
    "logs": "railway logs",
    "vars": "railway variables"
  }
}
```

Después de añadir, puedes usar:

```bash
npm run widget:build   # Construir widget
npm run db:studio      # Abrir Prisma Studio
npm run fresh          # Limpiar todo y reinstalar
npm run logs           # Ver logs (si usas Railway)
```

---

## 🔄 Git y Deployment Automático

```bash
# Inicializar repositorio (solo primera vez)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/eva-chatbot.git
git push -u origin main

# Flujo de trabajo normal
git add .
git commit -m "Descripción de cambios"
git push

# Crear rama para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad
# ... hacer cambios ...
git add .
git commit -m "Añadir nueva funcionalidad"
git push -u origin feature/nueva-funcionalidad

# Volver a main y mergear
git checkout main
git merge feature/nueva-funcionalidad
git push

# Ver diferencias antes de commit
git diff

# Ver historial de commits
git log --oneline
```

---

## 📊 Monitoreo y Analytics

```bash
# Ver uso de OpenAI
# Ve a: https://platform.openai.com/usage

# Ver conversaciones en Google Sheets
# Abre: https://docs.google.com/spreadsheets/d/TU_SPREADSHEET_ID

# Monitorear base de datos (Railway)
railway connect postgres
# Luego ejecutar queries SQL

# Estadísticas de la app (si tienes analytics configurado)
# Ve al dashboard de tu servicio de analytics
```

---

## 🆘 Troubleshooting Rápido

```bash
# Error: "Module not found"
npm install

# Error: "Prisma Client not initialized"
npx prisma generate

# Error: "Cannot connect to database"
# Verifica DATABASE_URL en .env
echo $DATABASE_URL

# Error: "OpenAI API error"
# Verifica la key
node -e "console.log(process.env.OPENAI_API_KEY)"

# Error: "Shopify authentication failed"
shopify auth logout
shopify auth login

# El widget no aparece
# 1. Reconstruir
cd extensions/eva-chat-widget && npm run build && cd ../..
# 2. Verificar en Theme Editor que esté activado

# Servidor muy lento
# Verificar plan de hosting y considerar upgrade

# Muchos errores en logs
# Añadir más logging y revisar variables de entorno
```

---

## 📱 Testing en Móvil

```bash
# Obtener URL del servidor de desarrollo
npm run dev
# Copia la URL que aparece (ej: https://xxx.cloudflare.io)

# Abrir en dispositivo móvil
# 1. Navega a tu tienda: tutienda.myshopify.com
# 2. El widget debería aparecer
# 3. Abre las DevTools del móvil para debug

# Para testing local en la misma red:
# 1. Encuentra tu IP local
ifconfig | grep "inet " | grep -v 127.0.0.1

# 2. Usa ngrok o el túnel de Shopify CLI que se crea automáticamente
```

---

## 💾 Backups

```bash
# Backup de la base de datos (PostgreSQL local)
pg_dump eva_chatbot > backup-$(date +%Y%m%d).sql

# Restaurar backup
psql eva_chatbot < backup-20250115.sql

# Backup de Google Sheets (exportar a CSV)
# Sheets > File > Download > CSV

# Backup del código
git push origin main  # El código está en GitHub

# Backup de variables de entorno
# Copia tu .env a un lugar seguro (¡NUNCA lo commitees!)
cp .env .env.backup
```

---

## 🎯 Comandos por Situación

### Primer día de desarrollo
```bash
cp .env.example .env          # Configurar
npm install                    # Instalar
cd extensions/eva-chat-widget && npm install && cd ../..
npx prisma generate           # Setup DB
npm run dev                   # Correr
```

### Deploy a producción
```bash
npm run build                 # Build
npm run deploy               # Deploy
railway variables set ...    # Configurar vars
railway deploy               # Deploy manual si es necesario
```

### Después de cambiar schema.prisma
```bash
npx prisma generate
npx prisma migrate dev --name cambio_descripcion
```

### Después de cambiar el widget
```bash
cd extensions/eva-chat-widget
npm run build
cd ../..
git add . && git commit -m "Update widget" && git push
```

### Debugging de problemas
```bash
npm run dev                   # Ver errores en consola
railway logs                  # Ver logs en producción
npx prisma studio            # Ver datos en DB
```

---

**💡 Tip**: Guarda este archivo en favoritos para acceso rápido a comandos comunes.
