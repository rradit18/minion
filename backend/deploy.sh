#!/bin/bash
set -e

COMPOSE="docker compose -f docker-compose.prod.yml"
APP_CONTAINER="minion_app"

echo ""
echo "========================================="
echo "  Minion Barbershop — Deploy Script"
echo "========================================="
echo ""

# ─── 1. Pull latest dari main ─────────────────────────────────────────────────
echo "[1/5] Pulling latest from main..."
git pull origin main

# ─── 2. Build ulang image app ─────────────────────────────────────────────────
echo "[2/5] Building Docker images..."
$COMPOSE build app queue-worker

# ─── 3. Restart containers ────────────────────────────────────────────────────
echo "[3/5] Restarting containers..."
$COMPOSE up -d

# ─── 4. Tunggu app siap ───────────────────────────────────────────────────────
echo "[4/5] Waiting for app to be ready..."
sleep 5
until docker exec $APP_CONTAINER php artisan --version > /dev/null 2>&1; do
    echo "  ... still waiting"
    sleep 3
done

# ─── 5. Post-deploy tasks ─────────────────────────────────────────────────────
echo "[5/5] Running post-deploy tasks..."

# Migrations sudah dijalankan oleh entrypoint.sh saat container start.
# Hanya perlu clear + rebuild cache setelah kode baru.
docker exec $APP_CONTAINER php artisan optimize:clear
docker exec $APP_CONTAINER php artisan optimize

# ─── Cleanup image lama ───────────────────────────────────────────────────────
echo "[cleanup] Removing dangling images..."
docker image prune -f

echo ""
echo "========================================="
echo "  Deploy selesai!"
echo "  URL: https://app.minionbarbershop.com"
echo "========================================="
echo ""
