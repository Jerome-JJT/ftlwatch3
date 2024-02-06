# syntax=docker/dockerfile:1
FROM composer AS composer_stage

WORKDIR /app

FROM php:8.1.2-apache

WORKDIR /app

COPY --from=composer_stage /usr/bin/composer /usr/bin/composer

RUN apt-get update
RUN apt-get install -y libpq-dev git
RUN CFLAGS="$CFLAGS -D_GNU_SOURCE" docker-php-ext-install pdo pdo_pgsql sockets

# RUN a2enmod headers
# RUN sed -ri -e 's/^([ \t]*)(<\/VirtualHost>)/\1\tHeader set Access-Control-Allow-Origin "*"\n\1\2/g' /etc/apache2/sites-available/*.conf
# COPY httpd.conf /usr/local/apache2/conf/httpd.conf

