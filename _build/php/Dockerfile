# syntax=docker/dockerfile:1
FROM php:8.1.2-apache

WORKDIR /app

RUN apt-get update
RUN apt-get install -y libpq-dev
RUN CFLAGS="$CFLAGS -D_GNU_SOURCE" docker-php-ext-install pdo pdo_pgsql sockets
# RUN a2enmod headers
# RUN sed -ri -e 's/^([ \t]*)(<\/VirtualHost>)/\1\tHeader set Access-Control-Allow-Origin "*"\n\1\2/g' /etc/apache2/sites-available/*.conf
# COPY httpd.conf /usr/local/apache2/conf/httpd.conf
