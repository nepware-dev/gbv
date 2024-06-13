FROM php:8.3-fpm-alpine3.20
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
      wget \
      openjdk11 \
    && apk del .build-deps

ENV TIKA_VERSION=2.9.2

RUN wget https://dlcdn.apache.org/tika/$TIKA_VERSION/tika-app-$TIKA_VERSION.jar -P /opt

RUN curl -sS https://getcomposer.org/installer \
    | php -- --install-dir=/usr/bin --filename=composer

WORKDIR /var/www

ENTRYPOINT /var/www/docker/docker-entrypoint.prod.sh
