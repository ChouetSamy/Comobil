--------------installation de symfony----------------
https://symfony.com/doc/current/setup.html #les recommandations symfony sont ici

étape 1: installation de symfony dans le projet, on prend la version la plus récente pour facilité les mise à jour plus tard

composer create-project symfony/skeleton:"8.1.*" backend

étape 2: installer les dépendances de symfony

cd backend #on se déplace dans le dossier backend
################################# dependance pour le backend
composer require symfony/orm-pack #orm obligatoire pour générer les entité relation et les connecté au BDD
#choisir non ou x à la configuration de docker par symfony
composer require doctrine/doctrine-migrations-bundle #obligatoire pour le versionning des BDD
composer require api-platform/core #obligatoire permet d'échanger le JSON entre backend et frontend, et facilite la transformation de symfony en api rest
#api platform installe en plus automatiquement les modules symfony/validator pour les entrée venant du frontend
#et symfonyserializer (pour communiquer en json entre le back et le front)
composer require symfony/security-bundle #permet de faire le crud de l'user et l'authentification rapidement
composer require symfony/maker-bundle --dev #pour pouvoir faire make:entity, le flag --dev pour ne l'utilisé qu'en dev
composer require symfony/asset #pour pouvoir gérer les upload d'image
composer require symfony/http-client #pour communiquer avec des api externe, nécessaire en cas de géolocalisation.
composer require --dev doctrine/doctrine-fixtures-bundle #pour pouvoir entrer des données lors du lancement du site
################################# dependance pour le frontend
composer require nelmio/cors-bundle #sécurisé et communiquer avec react
#################################Debug
composer require --dev symfony/profiler-pack #équivalent avancé de l'inspecteur en navigation
composer require --dev symfony/debug-bundle #permet d'utilisé dump and die dd() qui permet de débbuger plus précisement ce qu'il se passe

composer show --installed #pour vérifié que tout est correctement installé

ou

composer show --installed | grep nomdubundle

exemple:
composer show --installed | grep symfony/security-bundle #s'affiche avec sa version si installé

étape x: pour lancer le server (assurez vous d'être dans backend)

symfony server:start

ou

php -S localhost:8000 -t ../public

--------------installer react------------

étape 1: on utilise le framework vite, car ce dernier se charge de configurer très rapidement react pour nous

npm create vite@latest frontend 

étape 2: on choisit react comme template (le framework vous propose une liste)

étape 3: choisissez un language entre javascript et typescrypt (typescrypt recommandé)
dans cette app j'ai choisi typescrypt

étape 4: choisissez un linter (un compilateur qui relis votre code pour vérifier la syntaxe) en ESlint et 0xlint (0xlint est plus moderne, mais moins documenté)
j'ai choisi 0xlint

étape 5: choisissez oui pour l'installtion de npm pour pouvoir vous en servir dans le terminal du dossier contenant le frontend

étape 6: lancez vite (assurez vous de bien être dans /Comobil)

cd frontend #se déplacer dans le dossier frontend depuis le terminal dans le dossier comobil
npm run dev #lancer le server vite

ou plus simplement

cd frontend && npm run dev

-------------------tailwind----------------

doc utile
https://tailwindcss.com/docs/installation/using-vite

étape 1: installez tailwind et ses dépendances dans vite, postcss compile le css, autoprefixer

cd frontend
npm install tailwindcss @tailwindcss/vite

étape 2: configuration de vite, dans le fichier vite.config.ts votre fonction define config doit ressembler à ça

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(
{
  plugins: [
    tailwindcss(),
  ],
})

étape 3: importez tailwind dans vos fichier css

@import "tailwindcss";

-------------------------dockerisation-----------------
on créer un dossier docker à la racine

comobil/
compose.yml
/docker
 /

on contenairise le serveur web, objectif, facilités les installations in situ, garantir la stabilité de l'app
pour cellà on va contenairisé apache, php, aussi pour pouvoir déployer le frontend, nous le contenairisons aussi et enfin postgreSQL pour garantir la persistance des donnée

on commence par le compose.yml https://docs.docker.com/compose/

apache et php sont dans la même image
https://hub.docker.com/_/php #apache est contenu nativement dans php

votre compose.yml dois ressembler à ça

services:
  app:
    build:
      context: ./docker/apache   # Dossier contenant le Dockerfile pour construire l'image Apache+PHP
    container_name: comobil_app   # Nom du conteneur
    volumes:
      - ./backend:/var/www/html  # Monte le code source dans le dossier web d'Apache
    working_dir: /var/www/html   # Répertoire de travail par défaut
    ports:
      - "8080:80"                # Redirige port 8080 hôte → 80 container (Apache)
    depends_on:
      - db                       # Attend que PostgreSQL soit démarré

  db:
    image: postgres:16           # Image officielle PostgreSQL 16
    container_name: comobil_db   # Nom du conteneur
    environment:
      POSTGRES_DB: comobil       # Nom de la base créée
      POSTGRES_USER: comobil     # Utilisateur admin
      POSTGRES_PASSWORD: comobil # Mot de passe
    ports:
      - "5432:5432"              # Expose PostgreSQL sur le port standard
    volumes:
      - db_data:/var/lib/postgresql/data  # Persistance des données

volumes:
  db_data:                       # Déclaration du volume nommé pour la base
