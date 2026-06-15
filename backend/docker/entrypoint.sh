#!/bin/bash
set -e

# ─── Wait for PostgreSQL ──────────────────────────────────────────────────────
echo "[entrypoint] Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
until php -r "
    try {
        new PDO('pgsql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD');
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
" 2>/dev/null; do
    sleep 1
done
echo "[entrypoint] PostgreSQL is ready."

# ─── Wait for Redis ───────────────────────────────────────────────────────────
echo "[entrypoint] Waiting for Redis at $REDIS_HOST:$REDIS_PORT..."
until php -r "
    \$r = @fsockopen('$REDIS_HOST', $REDIS_PORT, \$errno, \$errstr, 2);
    exit(\$r ? 0 : 1);
" 2>/dev/null; do
    sleep 1
done
echo "[entrypoint] Redis is ready."

# ─── Composer install ────────────────────────────────────────────────────────
echo "[entrypoint] Installing/verifying Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

# ─── Generate APP_KEY if missing ─────────────────────────────────────────────
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "SomeRandomStringOf32CharsMinimum" ]; then
    echo "[entrypoint] Generating APP_KEY..."
    php artisan key:generate --force
fi

# ─── Run migrations ──────────────────────────────────────────────────────────
echo "[entrypoint] Running migrations..."
php artisan migrate --force

# ─── Storage link ────────────────────────────────────────────────────────────
php artisan storage:link 2>/dev/null || true

# ─── Fix storage & cache permissions ─────────────────────────────────────────
echo "[entrypoint] Fixing storage and cache permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "[entrypoint] Setup complete. Starting PHP-FPM..."
exec "$@"
