# syntax=docker/dockerfile:1
FROM php:8.1.2-apache

WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql
# COPY httpd.conf /usr/local/apache2/conf/httpd.conf
