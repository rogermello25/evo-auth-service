#!/usr/bin/env bash
# =============================================================================
# Evo AI Community — Environment Variable Validator
# =============================================================================
# Validates that all required environment variables are present and non-placeholder.
# Usage: ./scripts/validate-env.sh
# Exits 0 on success, 1 with error listing on failure.
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

# --- Check .env exists ---
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: .env file not found at '$ENV_FILE'"
  echo "  Copy .env.example to .env and configure it first."
  exit 1
fi

# --- Load .env safely ---
set +u
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  export "$key"="$value"
done < "$ENV_FILE"
set -u

# --- Placeholder patterns ---
PLACEHOLDER_PATTERNS=(
  "CHANGE_ME"
  "change-me"
  "TODO"
  "your_*"
  "generate_with_rails_secret_command"
)

# --- Required variables ---
REQUIRED_VARS=(
  # PostgreSQL
  "POSTGRES_HOST"
  "POSTGRES_PORT"
  "POSTGRES_USERNAME"
  "POSTGRES_PASSWORD"
  "POSTGRES_DATABASE"

  # Redis
  "REDIS_PASSWORD"

  # Secrets
  "SECRET_KEY_BASE"
  "JWT_SECRET_KEY"
  "DOORKEEPER_JWT_SECRET_KEY"
  "ENCRYPTION_KEY"
  "EVOAI_CRM_API_TOKEN"
  "BOT_RUNTIME_SECRET"

  # Rails / CRM
  "RAILS_ENV"
  "FRONTEND_URL"
  "ADMIN_EMAIL"
  "ADMIN_PASSWORD"
  "RAILS_LOG_TO_STDOUT"

  # Core Service (Go)
  "DB_HOST"
  "DB_PORT"
  "DB_USER"
  "DB_PASSWORD"
  "DB_NAME"
  "DB_SSLMODE"
  "EVOLUTION_BASE_URL"
  "EVO_AUTH_BASE_URL"
  "AI_PROCESSOR_URL"

  # Processor (Python/FastAPI)
  "POSTGRES_CONNECTION_STRING"

  # Redis (individual vars)
  "REDIS_HOST"
  "REDIS_PORT"

  # Processor (Go)
  "HOST"
  "PORT"

  # Bot Runtime (Go)
  "LISTEN_ADDR"

  # Frontend (React/Vite)
  "VITE_APP_ENV"
  "VITE_API_URL"
  "VITE_AUTH_API_URL"
  "VITE_EVOAI_API_URL"
  "VITE_AGENT_PROCESSOR_URL"
)

# --- Helper: is placeholder? ---
is_placeholder() {
  local value="$1"
  local lower_value
  lower_value=$(echo "$value" | tr '[:upper:]' '[:lower:]')

  # Empty
  if [[ -z "$value" ]]; then
    return 0
  fi

  # Check each pattern
  for pattern in "${PLACEHOLDER_PATTERNS[@]}"; do
    # Glob-style: match "your_*" as prefix
    if [[ "$pattern" == *"*"* ]]; then
      local prefix="${pattern%\**}"
      if [[ "$lower_value" == "$prefix"* ]]; then
        return 0
      fi
    else
      if [[ "$lower_value" == *"${pattern,,}"* ]]; then
        return 0
      fi
    fi
  done

  return 1
}

# --- Validate ---
FAILED=0
MISSING_VARS=()
INVALID_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  # Check if set and non-empty
  if [[ -z "${!var:-}" ]]; then
    MISSING_VARS+=("$var")
    FAILED=1
  else
    value="${!var}"
    if is_placeholder "$value"; then
      INVALID_VARS+=("$var=$value")
      FAILED=1
    fi
  fi
done

# --- Report ---
if [[ $FAILED -ne 0 ]]; then
  echo "ERROR: Environment validation failed."
  echo ""
  if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
    echo "MISSING or EMPTY variables:"
    for var in "${MISSING_VARS[@]}"; do
      echo "  - $var"
    done
    echo ""
  fi
  if [[ ${#INVALID_VARS[@]} -gt 0 ]]; then
    echo "INVALID (placeholder) variables:"
    for entry in "${INVALID_VARS[@]}"; do
      echo "  - $entry"
    done
    echo ""
  fi
  echo "Please update your .env file with real values."
  echo "Reference: .env.example or scripts/env-schema.json"
  exit 1
fi

echo "OK: All required environment variables are present and valid."
exit 0