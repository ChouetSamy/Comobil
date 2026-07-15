# Dockerisation Comobil

## Objectif

Mettre en place un environnement proche de la production avec Docker Compose :

* Symfony API
* React + Vite
* PostgreSQL
* Apache + PHP

Objectifs :

* installation simple
* reproductibilité
* déploiement possible sur VPS ou serveur interne
* séparation claire des services

---

# Architecture

```
Comobil/
├── backend/              # Symfony API
├── frontend/             # React + Vite + Tailwind
├── docker/
│   ├── apache/            # Dockerfile PHP + Apache
│   ├── frontend/          # Dockerfile Node/Vite
│   └── postgres/          # configuration PostgreSQL éventuelle
├── compose.yml
└── documentation/
```

---

# Pourquoi plusieurs conteneurs ?

## app (PHP + Apache)

Contient :

* PHP 8.4
* Apache
* Composer
* extensions PHP nécessaires à Symfony

Apache est utilisé car il est connu dans le projet et permet de servir directement Symfony.

Symfony utilise le dossier :

```
backend/public
```

comme racine web.

---

## frontend

Contient :

* Node.js
* npm
* Vite

Le frontend reste séparé du backend.

Avantages :

* déploiement indépendant
* séparation API / interface
* architecture classique React + API

---

## db

Contient :

* PostgreSQL 16

La base est isolée dans son propre conteneur.

Les données sont conservées grâce au volume Docker :

```
db_data
```

---

# Commandes Docker utiles

## Démarrer les services

```bash
docker compose up -d
```

---

## Reconstruire les images

Après modification d'un Dockerfile :

```bash
docker compose up --build -d
```

---

## Arrêter les services

```bash
docker compose down
```

---

## Voir les conteneurs actifs

```bash
docker compose ps
```

---

## Voir les logs

Tous les services :

```bash
docker compose logs
```

Un service :

```bash
docker compose logs app
```

---

# Commandes Symfony dans Docker

Entrer dans Symfony :

```bash
docker compose exec app bash
```

Ou exécuter directement :

```bash
docker compose exec app php bin/console
```

---

## Migration Doctrine

Créer une migration :

```bash
docker compose exec app php bin/console make:migration
```

Exécuter les migrations :

```bash
docker compose exec app php bin/console doctrine:migrations:migrate
```

---

## Vérifier Doctrine

```bash
docker compose exec app php bin/console doctrine:schema:validate
```

---

## Vider le cache Symfony

```bash
docker compose exec app php bin/console cache:clear
```

---

# Base de données

Créer la base :

```bash
docker compose exec app php bin/console doctrine:database:create
```

Supprimer le schéma :

```bash
docker compose exec app php bin/console doctrine:schema:drop --force
```

---

# Vérification API

Voir les routes :

```bash
docker compose exec app php bin/console debug:router
```

Tester l'API :

```bash
curl http://localhost:8080/api
```

Documentation API Platform :

```
http://localhost:8080/api/docs
```

---

# Frontend

Installation locale :

```bash
cd frontend
npm install
```

Avec Docker :

```bash
docker compose exec frontend npm install
```

Lancer Vite :

```bash
docker compose exec frontend npm run dev
```

Accès :

```
http://localhost:5173
```

---

# PostgreSQL

Connexion au conteneur :

```bash
docker compose exec db psql -U comobil -d comobil
```

Lister les bases :

```sql
\l
```

Lister les tables :

```sql
\dt
```

Quitter :

```sql
\q
```


---

# Variables importantes

Le backend utilise :

```
.env
```

Exemple :

```
DATABASE_URL="postgresql://comobil:comobil@db:5432/comobil"
```

Important :

Dans Docker, le serveur PostgreSQL est appelé :

```
db
```

et non :

```
localhost
```
---
# Configuration CORS avec NelmioCorsBundle

## Pourquoi Nelmio ?

Le frontend React et l'API Symfony tournent sur deux serveurs différents en développement :

* Symfony : `http://localhost:8080`
* React/Vite : `http://localhost:5173`

Les navigateurs bloquent par défaut les requêtes entre deux origines différentes.

NelmioCorsBundle permet d'autoriser explicitement le frontend à communiquer avec l'API.

---

# Installation

Depuis le conteneur Symfony :

```bash
docker compose exec app composer require nelmio/cors-bundle
```

Vérification :

```bash
docker compose exec app composer show nelmio/cors-bundle
```

---

# Configuration

Fichier :

```text
backend/config/packages/nelmio_cors.yaml
```

Contenu :

```yaml
nelmio_cors:
    defaults:
        allow_origin:
            - '%env(CORS_ALLOW_ORIGIN)%'

        allow_methods:
            - GET
            - POST
            - PUT
            - PATCH
            - DELETE
            - OPTIONS

        allow_headers:
            - Content-Type
            - Authorization

        max_age: 3600

    paths:
        '^/':
            allow_origin:
                - 'http://localhost:5173'
```

---

# Variables d'environnement

```env
CORS_ALLOW_ORIGIN=http://localhost:5173
```


Avantage :

* changement d'environnement sans modifier le code
* production plus simple à configurer

---

# Test

Vider le cache Symfony :

```bash
docker compose exec app php bin/console cache:clear
```

Redémarrer :

```bash
docker compose restart app
```

Tester les headers :

```bash
curl -I http://localhost:8080/api
```

---

# Autres dépendances Symfony

Même principe :

Installation :

```bash
docker compose exec app composer require NOM_DU_PACKAGE
```

Vérification :

```bash
docker compose exec app composer show NOM_DU_PACKAGE
```

Après ajout d'un bundle :

```bash
docker compose exec app php bin/console cache:clear
```

---

# Nettoyage Docker

Voir les images :

```bash
docker images
```

Supprimer une image :

```bash
docker image rm IMAGE
```

Supprimer les conteneurs arrêtés :

```bash
docker container prune
```

Nettoyer les ressources inutilisées :

```bash
docker system prune
```

---

# Git après modification architecture

Créer une branche :

```bash
git checkout -b nom-de-la-feature
```

Ajouter :

```bash
git add .
```

Commit :

```bash
git commit -m "message"
```

Push :

```bash
git push origin nom-de-la-feature
```

Fusion :

```bash
git checkout dev
git merge nom-de-la-feature
git push origin dev
```

---

# Choix d'architecture

Cette architecture privilégie :

* simplicité
* compréhension
* maintenance
* déploiement facile

Elle correspond à une architecture réaliste pour une application Symfony/React déployable avec Docker Compose.
