# Aura Dashboard

Dashboard para monitorear y controlar el agente Aura (OpenClaw).

## Features
- Monitor en tiempo real del gateway
- Historial de sesiones (Discord, WhatsApp)
- Tablero Kanban de tareas
- Log de actividad persistente
- Explorador del workspace del agente

## Setup
1. `cp .env.local.example .env.local` y llenar valores
2. `pnpm install`
3. `npx prisma migrate dev`
4. `pnpm dev` — desarrollo local en http://localhost:3000
5. `docker compose up -d` — producción

## Requisitos
- OpenClaw gateway corriendo en `127.0.0.1:18789`
- PostgreSQL accesible (reshape-postgres en puerto 5432)
