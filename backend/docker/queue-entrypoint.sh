#!/bin/bash
set -e

echo "[queue] Waiting for PostgreSQL..."
until php -r "
    try {
        new PDO('pgsql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD');
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
" 2>/dev/null; do
    sleep 2
done

echo "[queue] Waiting for vendor/autoload.php (app container may still be initializing)..."
until [ -f "vendor/autoload.php" ]; do
    sleep 2
done

echo "[queue] Starting queue worker..."
exec "$@"
