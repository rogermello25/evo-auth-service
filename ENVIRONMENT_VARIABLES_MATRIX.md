# Environment Variables Matrix — EvoCRM Monorepo

Fonte de verdade: `.env.example` raiz. Cada serviço referencia `# Shared: see root .env.example` para vars compartilhadas.

## Formato
```
VAR | Serviços que leem | Default dev | Obrigatória? | Observação
```

---

## Database & Infra

| VAR | Serviços que leem | Default dev | Obrigatória? | Observação |
|-----|-------------------|-------------|--------------|-----------|
| `POSTGRES_HOST` | auth, crm, core, processor | `postgres` | sim | Docker hostname |
| `POSTGRES_PORT` | auth, crm, core, processor | `5432` | sim | |
| `POSTGRES_USERNAME` | auth, crm, core, processor | `postgres` | sim | |
| `POSTGRES_PASSWORD` | auth, crm, core, processor | `evoai_dev_password` | sim | |
| `POSTGRES_DATABASE` | auth, crm, core, processor | `evo_community` | sim | |
| `REDIS_URL` | auth, bot-runtime | `redis://:evoai_redis_pass@redis:6379` | sim | Formato completo URL |
| `REDIS_PASSWORD` | auth, crm, core, processor | `evoai_redis_pass` | sim | |
| `REDIS_HOST` | processor | `redis` | sim | Docker hostname |
| `REDIS_PORT` | processor | `6379` | sim | |
| `REDIS_DB` | processor | `0` | não | |
| `REDIS_SSL` | processor | `false` | não | |
| `REDIS_KEY_PREFIX` | processor | `a2a:` | não | |
| `REDIS_TTL` | processor | `3600` | não | Segundos |

---

## Secrets Compartilhados

| VAR | Serviços que leem | Default dev | Obrigatória? | Observação |
|-----|-------------------|-------------|--------------|-----------|
| `SECRET_KEY_BASE` | auth, crm | (gerado) | sim | Deve ser igual em todos |
| `JWT_SECRET_KEY` | auth, crm, core | (gerado) | sim | Deve ser igual em todos |
| `DOORKEEPER_JWT_SECRET_KEY` | auth | (gerado) | sim | Igual a JWT_SECRET_KEY |
| `ENCRYPTION_KEY` | core, processor, auth | (gerado) | sim | Fernet base64 32 bytes |
| `EVOAI_CRM_API_TOKEN` | auth, crm, processor | `6e10e689-...` | sim | Service-to-service auth |
| `BOT_RUNTIME_SECRET` | bot-runtime, crm | `evo-bot-runtime-dev-secret` | sim | |

---

## Auth Service (evo-auth-service-community)

| VAR | Default dev | Obrigatória? | Observação |
|-----|-------------|--------------|-----------|
| `RAILS_ENV` | `development` | sim | |
| `RAILS_MAX_THREADS` | `5` | não | |
| `FRONTEND_URL` | `http://localhost:5173` | sim | |
| `DOORKEEPER_JWT_ALGORITHM` | `hs256` | sim | |
| `DOORKEEPER_JWT_ISS` | `evo-auth-service` | sim | |
| `DOORKEEPER_JWT_AUD` | `[]` | sim | JSON array |
| `MFA_ISSUER` | `EvoAI` | não | |
| `MAILER_SENDER_EMAIL` | `noreply@evoai-community.local` | sim | |
| `SMTP_ADDRESS` | `mailhog` | sim | Dev: mailhog |
| `SMTP_PORT` | `1025` | sim | Dev: mailhog |
| `SMTP_DOMAIN` | `evoai-community.local` | não | |
| `SMTP_AUTHENTICATION` | `plain` | não | |
| `SMTP_ENABLE_STARTTLS_AUTO` | `false` | não | |
| `ACTIVE_STORAGE_SERVICE` | `local` | sim | |
| `SIDEKIQ_CONCURRENCY` | `10` | não | |
| `ADMIN_EMAIL` | `admin@evocrm.local` | não | Seed admin |
| `ADMIN_PASSWORD` | (random) | não | Seed admin |

---

## CRM Service (evo-ai-crm-community)

| VAR | Default dev | Obrigatória? | Observação |
|-----|-------------|--------------|-----------|
| `BACKEND_URL` | `http://localhost:3000` | sim | |
| `EVO_AI_CORE_SERVICE_URL` | `http://evo-core:5555` | sim | Docker hostname |
| `EVO_AUTH_SERVICE_URL` | `http://evo-auth:3001` | sim | Docker hostname |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | sim | |
| `DISABLE_TELEMETRY` | `true` | não | |
| `RAILS_LOG_TO_STDOUT` | `true` | sim | |
| `LOG_LEVEL` | `info` | não | |
| `LOG_SIZE` | `500` | não | Mb |
| `ENABLE_ACCOUNT_SIGNUP` | `true` | não | |
| `ENABLE_PUSH_RELAY_SERVER` | `true` | não | |
| `ENABLE_INBOX_EVENTS` | `true` | não | |
| `FB_VERIFY_TOKEN` | `evolution` | não | |
| `FACEBOOK_API_VERSION` | `v23.0` | não | |
| `BOT_RUNTIME_URL` | `http://evo-bot-runtime:8080` | não | Docker hostname |
| `BOT_RUNTIME_POSTBACK_BASE_URL` | `http://evo-crm:3000` | sim | |
| `ATTACHMENT_REPLY_DELAY_SECONDS` | `2` | não | Delay para jobs |

---

## Core Service (evo-ai-core-service-community)

| VAR | Default dev | Obrigatória? | Observação |
|-----|-------------|--------------|-----------|
| `DB_HOST` | `postgres` | sim | Docker hostname |
| `DB_PORT` | `5432` | sim | |
| `DB_USER` | `postgres` | sim | |
| `DB_PASSWORD` | `evoai_dev_password` | sim | |
| `DB_NAME` | `evo_community` | sim | |
| `DB_SSLMODE` | `disable` | sim | |
| `DB_MAX_IDLE_CONNS` | `10` | não | |
| `DB_MAX_OPEN_CONNS` | `100` | não | |
| `DB_CONN_MAX_LIFETIME` | `1h` | não | |
| `DB_CONN_MAX_IDLE_TIME` | `30m` | não | |
| `JWT_ALGORITHM` | `HS256` | sim | |
| `EVOLUTION_BASE_URL` | `http://evo-crm:3000` | sim | Docker hostname |
| `EVO_AUTH_BASE_URL` | `http://evo-auth:3001` | sim | Docker hostname |
| `AI_PROCESSOR_URL` | `http://evo-processor:8000` | sim | Docker hostname |
| `AI_PROCESSOR_VERSION` | `v1` | sim | |
| `PORT` | `5555` | sim | |

---

## Processor Service (evo-ai-processor-community)

| VAR | Default dev | Obrigatória? | Observação |
|-----|-------------|--------------|-----------|
| `API_TITLE` | `Agent Processor Community` | não | |
| `API_DESCRIPTION` | `Agent Processor Community for Evo AI` | não | |
| `API_VERSION` | `1.0.0` | não | |
| `API_URL` | `http://localhost:8000` | não | |
| `ORGANIZATION_NAME` | `Evo AI` | não | |
| `ORGANIZATION_URL` | `https://evoai.evoapicloud.com` | não | |
| `POSTGRES_CONNECTION_STRING` | `postgresql://...@postgres:5432/evo_community` | sim | Full connection string |
| `TOOLS_CACHE_ENABLED` | `true` | não | |
| `TOOLS_CACHE_TTL` | `3600` | não | |
| `EVO_AI_CRM_URL` | `http://evo-crm:3000` | sim | Docker hostname |
| `HOST` | `0.0.0.0` | sim | |
| `PORT` | `8000` | sim | |
| `DEBUG` | `false` | não | |
| `CORE_SERVICE_URL` | `http://evo-core:5555/api/v1` | sim | Docker hostname |
| `APP_URL` | `http://localhost:8000` | não | |

---

## Bot Runtime (evo-bot-runtime)

| VAR | Default dev | Obrigatória? | Observação |
|-----|-------------|--------------|-----------|
| `LISTEN_ADDR` | `:8080` | sim | **Mesma porta em todos ambientes** |
| `REDIS_URL` | `redis://:evoai_redis_pass@redis:6379` | sim | |
| `BOT_RUNTIME_SECRET` | `evo-bot-runtime-dev-secret` | sim | |
| `AI_PROCESSOR_API_KEY` | `evo-processor-dev-api-key` | sim | |
| `AI_CALL_TIMEOUT_SECONDS` | `30` | não | |
| `AI_PROCESSOR_URL` | `http://evo-processor:8000` | sim | Docker hostname |
| `BOT_RUNTIME_URL` | `http://evo-bot-runtime:8080` | sim | Docker hostname |
| `BOT_RUNTIME_POSTBACK_BASE_URL` | `http://evo-crm:3000` | sim | |

---

## Frontend (evo-ai-frontend-community)

| VAR | Default dev | Obrigatória? | Observação |
|-----|-------------|--------------|-----------|
| `VITE_APP_ENV` | `development` | sim | Build-time |
| `VITE_API_URL` | `http://localhost:3000` | sim | Build-time |
| `VITE_AUTH_API_URL` | `http://localhost:3001` | sim | Build-time |
| `VITE_EVOAI_API_URL` | `http://localhost:5555` | sim | Build-time |
| `VITE_AGENT_PROCESSOR_URL` | `http://localhost:8000` | sim | Build-time |
| `VITE_TINYMCE_API_KEY` | `no-api-key` | não | Build-time |

---

## Validação

Placeholders que indicam valor inválido (devem ser substituídos):
- `CHANGE_ME`
- `change-me`
- `TODO`
- `your_*`
- `your-postgres-password-here`
- `generate_with_rails_secret_command`
- `localhost` (em vars de URLintra-serviço dentro do compose — usar nome do container)

---

## Submódulos Git (Fase 1.7 — Opção A Escolhida)

Diretórios atualmente são cópias vendored. Convertidos para submódulos via:
```bash
# Para cada serviço (um commit por serviço):
git rm -r <serviço>
git submodule add <url-do-repo> <serviço>
git submodule add git@github.com:evoai/evo-auth-service-community.git evo-auth-service-community
# etc.
```

**URLs dos repos remotos** (a configurar pelo usuário):
- evo-auth-service-community: `git@github.com:evoai/evo-auth-service-community.git`
- evo-ai-crm-community: `git@github.com:evoai/evo-ai-crm-community.git`
- evo-ai-frontend-community: `git@github.com:evoai/evo-ai-frontend-community.git`
- evo-ai-processor-community: `git@github.com:evoai/evo-ai-processor-community.git`
- evo-ai-core-service-community: `git@github.com:evoai/evo-ai-core-service-community.git`
- evo-bot-runtime: `git@github.com:evoai/evo-bot-runtime.git`

Após `git submodule add`, `setup.sh:121` passa a funcionar corretamente.

---

## Conflitos Conhecidos

| Conflito | Resolução |
|----------|-----------|
| Bot-runtime `LISTEN_ADDR=:8090` vs compose `:8080` | Padronizar `:8080` em todos |
| Service `.env.example` usa `localhost` para Postgres/Redis | Usar `postgres`/`redis` (Docker hostname) |
| Processor `.env.example` tem `POSTGRES_CONNECTION_STRING` com credenciais diferentes | Alinhar com root `.env.example` |
