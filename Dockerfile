FROM php:7.2-fpm-alpine3.8
MAINTAINER bishaltimilsina@gmail.com

RUN apk add --no-cache --virtual .build-deps \
    libpng-dev \
    libjpeg-turbo-dev \
    libxml2-dev \
    $PHPIZE_DEPS \
    && docker-php-ext-configure gd \
      --with-png-dir=/usr/include/ \
      --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j "$(nproc)" \
      gd \
      mbstring \
      pdo_mysql \
      zip \
      opcache \
      bcmath \
      soap \
    && pecl install redis-3.1.1 \
    && docker-php-ext-enable redis \
    && apk add --no-cache \
      libpng \
      libjpeg \
      libpq \
      libxml2 \
      git \
      # for drush command
      mysql-client \
    && apk del .build-deps

RUN curl -sS https://getcomposer.org/installer \
    | php -- --install-dir=/usr/bin --filename=composer

WORKDIR /var/www

ENTRYPOINT /var/www/docker/docker-entrypoint.prod.sh
