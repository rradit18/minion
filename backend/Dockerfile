FROM php:8.3-fpm-alpine

WORKDIR /var/www/html

# System dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    autoconf \
    make \
    g++ \
    libpng-dev \
    libxml2-dev \
    postgresql-dev \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    freetype-dev \
    libjpeg-turbo-dev

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        intl \
        zip \
        opcache

# Redis extension
RUN pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /tmp/pear

# PHP config overrides
COPY docker/php/local.ini /usr/local/etc/php/conf.d/local.ini

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy entrypoints
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/queue-entrypoint.sh /usr/local/bin/queue-entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/queue-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
