FROM php:8.1-fpm-alpine3.18
MAINTAINER bishaltimilsina@gmail.com

RUN apk add --no-cache --virtual .build-deps \
    freetype-dev \
    libjpeg-turbo-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev \
    libxml2-dev \
    libwebp-dev \
    zlib-dev \
    oniguruma-dev \
    $PHPIZE_DEPS \
    && docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j "$(nproc)" \
      gd \
      mbstring \
      pdo_mysql \
      zip \
      opcache \
      bcmath \
      soap \
    && pecl install redis-5.3.7 \
    && docker-php-ext-enable redis zip \
    && apk add --no-cache \
      libpng \
      libjpeg \
      libpq \
      libxml2 \
      git \
      freetype \
      libwebp \
      libzip \
      # for drush command
      mysql-client \
    && apk del .build-deps

RUN curl -sS https://getcomposer.org/installer \
    | php -- --install-dir=/usr/bin --filename=composer

WORKDIR /var/www

ENTRYPOINT /var/www/docker/docker-entrypoint.prod.sh
