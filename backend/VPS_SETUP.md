# VPS Setup Guide — app.minionbarbershop.com

## Prasyarat VPS
- Ubuntu 22.04 LTS
- Min. 2GB RAM, 20GB disk
- Domain `app.minionbarbershop.com` sudah diarahkan ke IP VPS (A record)

---

## 1. Install dependensi

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Install Nginx + Certbot (untuk SSL di host)
sudo apt install -y nginx certbot python3-certbot-nginx git
```

---

## 2. Clone repo & setup .env

```bash
# Clone repo
git clone https://github.com/USERNAME/minion.git /var/www/minion
cd /var/www/minion/backend

# Buat .env dari template
cp .env.production.example .env
nano .env   # isi APP_KEY, DB_PASSWORD, REDIS_PASSWORD
```

Generate APP_KEY:
```bash
docker run --rm php:8.3-cli php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

---

## 3. Konfigurasi Nginx host (SSL proxy)

```bash
sudo nano /etc/nginx/sites-available/minionbarbershop
```

Isi:
```nginx
server {
    listen 80;
    server_name app.minionbarbershop.com;

    location / {
        proxy_pass         http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        client_max_body_size 40M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/minionbarbershop /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 4. SSL dengan Certbot

```bash
sudo certbot --nginx -d app.minionbarbershop.com
# Certbot otomatis tambah SSL ke config Nginx di atas
```

---

## 5. Jalankan pertama kali

```bash
cd /var/www/minion/backend
chmod +x deploy.sh
./deploy.sh
```

---

## 6. Deploy selanjutnya

Cukup jalankan dari direktori backend:
```bash
./deploy.sh
```

---

## Perintah berguna

```bash
# Lihat log semua container
docker compose -f docker-compose.prod.yml logs -f

# Masuk ke shell app
docker exec -it minion_app bash

# Restart tanpa rebuild
docker compose -f docker-compose.prod.yml restart

# Cek status container
docker compose -f docker-compose.prod.yml ps
```
