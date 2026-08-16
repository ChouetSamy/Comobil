# Comobil — Commandes utiles

## Docker

Démarrer :

docker compose up -d

Arrêter :

docker compose down

Voir les conteneurs :

docker compose ps

Logs :

docker compose logs

Logs backend :

docker compose logs app

---

# Symfony

Informations :

docker compose exec app php bin/console about

Routes :

docker compose exec app php bin/console debug:router

Routes Trip :

docker compose exec app php bin/console debug:router | grep trip

Vider le cache :

docker compose exec app php bin/console cache:clear

---

# Composer

Installer les dépendances :

docker compose exec app composer install

Voir une dépendance :

docker compose exec app composer show NOM_DU_PACKAGE

Exemple :

docker compose exec app composer show symfony/mime

---

# Doctrine

Valider le mapping :

docker compose exec app php bin/console doctrine:schema:validate

Voir les différences SQL :

docker compose exec app php bin/console doctrine:schema:update --dump-sql

Créer une migration :

docker compose exec app php bin/console make:migration

Exécuter les migrations :

docker compose exec app php bin/console doctrine:migrations:migrate

État des migrations :

docker compose exec app php bin/console doctrine:migrations:status

---

# Fixtures

Charger les fixtures :

docker compose exec app php bin/console doctrine:fixtures:load

ATTENTION :

Cette commande purge les données existantes.

---

# PostgreSQL

Ouvrir psql :

docker compose exec db psql -U comobil -d comobil

Lister les utilisateurs :

docker compose exec db psql -U comobil -d comobil -c \
'SELECT id, first_name, last_name, gender FROM "user" ORDER BY id;'

Lister les trajets :

docker compose exec db psql -U comobil -d comobil -c \
'SELECT id, departure_datetime, trip_status FROM trip ORDER BY departure_datetime;'

---

# Frontend

Se placer dans :

cd frontend

Installer :

npm install

Développement :

npm run dev

Build :

npm run build

---

# Git

État :

git status

Branches :

git branch

Ajouter :

git add .

Commit :

git commit -m "message"

Push :

git push

Premier push d'une branche :

git push -u origin NOM_BRANCHE

---

# Vérification finale avant jury

docker compose ps

docker compose exec app php bin/console about

docker compose exec app php bin/console doctrine:schema:validate

cd frontend
npm run build

Puis tester manuellement :

- login homme ;
- login femme ;
- profil ;
- recherche ;
- women_only ;
- TripDetails ;
- rejoindre ;
- création trajet ;
- historique ;
- messagerie.