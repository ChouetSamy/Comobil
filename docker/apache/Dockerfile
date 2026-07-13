# Image officielle PHP avec Apache intégré
# => PHP + serveur web Apache dans la même image
FROM php:8.4-apache

# Installation des dépendances système nécessaires
#unzip pour décompresser les fichiers
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libicu-dev \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    intl \
    opcache

# Activation du module Apache rewrite
# => indispensable pour Symfony (routes propres /index.php)
RUN a2enmod rewrite

# Installation de Composer directement depuis l'image officielle
# => évite installation manuelle
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copie du code Symfony dans le container
# (sera écrasé en dev par volume docker compose)
WORKDIR /var/www/html

# Configuration Apache pour pointer vers /public (Symfony)
# => root web sécurisé
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Patch config Apache pour changer le document root
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf

# Permissions (évite erreurs cache/log Symfony)
RUN chown -R www-data:www-data /var/www/html