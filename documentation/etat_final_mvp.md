Oui : j’ai bien mis plusieurs **voyageurs sur des trajets créés par d’autres utilisateurs**. Par exemple Einstein conduit avec Bohr + Feynman, Curie avec Johnson + Lamarr, Johnson avec Curie, Lamarr avec Wu, Feynman avec Tesla, etc. Donc `TripDetails`, les passagers et l’historique auront de vraies données à afficher.

On peut passer à la doc. Je ferais d’abord **un document central de clôture/reprise**, plutôt que dix petits fichiers.

Crée :

```bash
touch documentation/etat_final_mvp.md
```

Puis mets ceci :

````md
# Comobil — État final du MVP

## 1. Présentation

Comobil est une application web de covoiturage permettant à des utilisateurs de créer, rechercher et rejoindre des trajets.

Le projet a été réalisé dans le cadre d'une formation en développement web.

Le développement du MVP est considéré comme terminé en août 2026.

Le projet n'est actuellement plus destiné à être poursuivi activement après la soutenance, mais cette documentation permet de reprendre son développement ultérieurement.

---

# 2. Stack technique

## Backend

- PHP 8.4
- Symfony 8.1
- API Platform
- Doctrine ORM
- PostgreSQL 16
- JWT pour l'authentification
- Apache

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Infrastructure

- Docker
- Docker Compose

Architecture générale :

```text
Comobil/
├── backend/
│   ├── src/
│   ├── config/
│   ├── migrations/
│   ├── public/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── component/
│   │   ├── page/
│   │   ├── assets/
│   │   └── ...
│   └── ...
│
├── docker/
├── documentation/
└── compose.yml
````

---

# 3. Lancement du projet

Depuis la racine du projet :

```bash
docker compose up -d
```

Vérifier les conteneurs :

```bash
docker compose ps
```

Le backend est disponible sur :

```text
http://localhost:8080
```

Le frontend Vite est disponible sur le port configuré par le projet, généralement :

```text
http://localhost:5174
```

---

# 4. Installation des dépendances

## Backend

```bash
docker compose exec app composer install
```

Vérification Symfony :

```bash
docker compose exec app php bin/console about
```

## Frontend

Depuis :

```bash
cd frontend
```

Installer les dépendances :

```bash
npm install
```

Puis lancer Vite :

```bash
npm run dev
```

---

# 5. Base de données

Vérifier le mapping Doctrine :

```bash
docker compose exec app php bin/console doctrine:schema:validate
```

Vérifier les migrations :

```bash
docker compose exec app php bin/console doctrine:migrations:status
```

Exécuter les migrations éventuelles :

```bash
docker compose exec app php bin/console doctrine:migrations:migrate
```

---

# 6. Fixtures de démonstration

Le projet possède un jeu de données destiné à la soutenance.

Charger les fixtures :

```bash
docker compose exec app php bin/console doctrine:fixtures:load
```

Attention : cette commande purge les données existantes.

Les fixtures créent :

* 10 utilisateurs ;
* 5 hommes ;
* 5 femmes ;
* 10 trajets ;
* plusieurs voyageurs ;
* plusieurs avis ;
* des véhicules ;
* des profils ;
* des préférences utilisateur ;
* des préférences de trajet.

Tous les trajets de démonstration ont une date postérieure au 10 septembre 2026.

Plusieurs trajets sont réservés aux femmes.

---

# 7. Utilisateurs de démonstration

Mot de passe commun :

```text
Demo1234!
```

## Hommes

```text
albert@comobil.local
kurt@comobil.local
niels@comobil.local
richard@comobil.local
nikola@comobil.local
```

Utilisateurs :

* Albert Einstein
* Kurt Gödel
* Niels Bohr
* Richard Feynman
* Nikola Tesla

## Femmes

```text
marie@comobil.local
katherine@comobil.local
hedy@comobil.local
lise@comobil.local
wu@comobil.local
```

Utilisatrices :

* Marie Curie
* Katherine Johnson
* Hedy Lamarr
* Lise Meitner
* Chien-Shiung Wu

---

# 8. Fonctionnalités principales terminées

## Authentification

* création de compte ;
* connexion ;
* authentification JWT ;
* routes protégées.

## Profil utilisateur

* consultation de son profil ;
* consultation du profil public d'un autre utilisateur ;
* modification du profil ;
* biographie ;
* photo de profil ;
* préférences ;
* véhicule ;
* note moyenne ;
* avis.

La même page React `Profile` est utilisée pour :

```text
/profile
```

et :

```text
/profile/{userId}
```

Sans `userId`, elle affiche le profil de l'utilisateur connecté.

Avec `userId`, elle affiche le profil public correspondant.

---

# 9. Véhicules

Un utilisateur peut avoir un véhicule associé à sa flotte.

Les principales informations utilisées par le MVP sont :

* nombre de sièges ;
* climatisation ;
* consommation ;
* état ;
* description ;
* image.

Un composant React `VehicleCard` centralise l'affichage du véhicule.

---

# 10. Création de trajet

Un utilisateur peut créer un trajet avec :

* ville et adresse de départ ;
* ville et adresse d'arrivée ;
* date de départ ;
* heure de départ ;
* arrivée estimée ;
* nombre de places ;
* prix ;
* rôle conducteur/passager ;
* véhicule ;
* préférences.

Les villes utilisent un comportement de type :

```text
find or create
```

afin d'éviter la création de doublons inutiles.

---

# 11. Recherche de trajets

Route principale :

```text
GET /api/trips/search
```

Critères disponibles :

* ville de départ ;
* ville d'arrivée ;
* date ;
* heure ;
* préférences.

Date et heure sont facultatives.

Les recherches :

* n'affichent pas les trajets passés ;
* n'affichent pas les trajets annulés ;
* n'affichent pas les trajets sans place disponible ;
* sont limitées à 50 résultats ;
* sont triées par date de départ croissante.

Le composant React `TripCard` est utilisé dans plusieurs pages pour éviter la duplication de l'affichage d'un trajet.

---

# 12. Trajets réservés aux femmes

Une préférence :

```text
women_only
```

permet de réserver un trajet aux utilisatrices.

La sécurité est appliquée à plusieurs niveaux.

## Recherche

Un utilisateur masculin ne voit pas les trajets `women_only`.

## Consultation directe

Même en connaissant l'identifiant du trajet, un homme ne peut pas consulter un trajet réservé aux femmes.

La protection est notamment assurée par :

```text
TripVoter
```

## Rejoindre le trajet

Le `TravelerProcessor` empêche également un homme de rejoindre un trajet réservé aux femmes.

La protection ne dépend donc pas uniquement du frontend.

---

# 13. Rejoindre un trajet

La participation à un trajet utilise l'entité :

```text
Traveler
```

Lorsqu'un utilisateur rejoint un trajet :

* le trajet est envoyé par le frontend ;
* l'utilisateur n'est pas choisi par le frontend ;
* l'utilisateur est récupéré depuis le JWT côté backend ;
* le `TravelerProcessor` associe automatiquement l'utilisateur authentifié.

Cette approche empêche un client de tenter d'inscrire arbitrairement un autre utilisateur.

---

# 14. Exclusion d'un voyageur

Le créateur d'un trajet peut exclure un participant.

Le système utilise notamment :

```text
TravelerExclusionProcessor
```

Un utilisateur exclu ne peut pas rejoindre à nouveau normalement le trajet.

---

# 15. Messagerie

Le projet possède deux usages distincts de la messagerie.

## TripMessage

Messagerie liée à un trajet.

Depuis `TripDetails`, le bouton principal de message renvoie vers la messagerie du trajet.

Elle peut être considérée comme une messagerie liée au groupe de covoiturage.

## PrivateMessage

Conversation privée entre deux utilisateurs.

Depuis le profil public ou les options secondaires d'une `UserCard`, un utilisateur peut accéder à la conversation privée avec un autre utilisateur.

L'entité `Message` peut être associée à un trajet ainsi qu'à un expéditeur et un destinataire.

---

# 16. UserCard

Le composant :

```text
frontend/src/component/user/UserCard.tsx
```

centralise l'affichage d'un utilisateur.

Il gère notamment :

* avatar ;
* nom ;
* note ;
* accès au profil ;
* messagerie ;
* signalement ;
* blacklist ;
* menu secondaire ;
* téléphone.

Images par défaut :

```text
passager.png
conducteur.png
```

En contexte de trajet, un conducteur peut recevoir l'image par défaut `conducteur.png`.

Dans les autres cas, `passager.png` est utilisée.

Un fallback est également prévu lorsqu'une ancienne URL d'image existe en base mais que le fichier n'existe plus.

---

# 17. TripCard

Le composant :

```text
frontend/src/component/TripCard.tsx
```

centralise l'affichage synthétique d'un trajet.

Il est notamment utilisé dans :

* historique ;
* résultats de recherche ;
* détails du trajet.

Il affiche :

* départ ;
* arrivée ;
* horaires ;
* nombre de places ;
* prix ;
* rôle ;
* certaines préférences.

---

# 18. Notifications

Une entité `Notification` est présente.

Elle peut être associée :

* à un utilisateur destinataire ;
* éventuellement à un trajet.

Certaines opérations backend génèrent des notifications.

Le système reste volontairement simple dans le MVP.

---

# 19. Avis

L'entité :

```text
Review
```

permet d'associer :

* un auteur ;
* un utilisateur évalué ;
* éventuellement un trajet ;
* un commentaire.

Les profils publics affichent les avis disponibles.

---

# 20. Sécurité métier

Plusieurs règles ne sont volontairement pas confiées uniquement au frontend.

Des voters et processors sont utilisés côté Symfony.

Exemples :

```text
TripVoter
VehicleVoter
TravelerVoter
```

et :

```text
TravelerProcessor
TravelerExclusionProcessor
TripUpdateProcessor
TripDeleteProcessor
MessageProcessor
```

Cela permet de vérifier les droits même lorsqu'un utilisateur appelle directement l'API.

---

# 21. Choix techniques

## Apache

Apache a été choisi plutôt que Nginx principalement car il était déjà utilisé et étudié durant la formation.

Il permet également dans ce projet de servir directement l'application Symfony avec PHP dans le même conteneur applicatif.

## PostgreSQL

PostgreSQL a été choisi comme base relationnelle pour gérer les relations importantes entre :

* utilisateurs ;
* trajets ;
* voyageurs ;
* messages ;
* véhicules ;
* préférences ;
* avis.

## Docker

Docker permet de rendre l'environnement reproductible et d'éviter d'imposer directement toutes les versions de PHP/PostgreSQL sur la machine hôte.

---

# 22. État du code

Le MVP est fonctionnel mais le code frontend nécessiterait un refactoring avant une éventuelle reprise sérieuse.

Plusieurs éléments ont été développés rapidement afin de terminer le MVP dans les délais.

Exemples de dette technique :

* `API_URL` est encore redéfinie dans plusieurs composants ;
* certains boutons génériques pourraient devenir des composants réutilisables ;
* certaines interfaces TypeScript sont dupliquées ;
* certaines fonctions d'hydratation des IRI API Platform sont répétées ;
* plusieurs appels `fetch` pourraient être centralisés ;
* certains composants/pages restent volumineux.

Une reprise sérieuse devrait commencer par une couche commune :

```text
frontend/src/api/
frontend/src/types/
frontend/src/component/ui/
```

Exemple :

```text
api/client.ts
api/trips.ts
api/users.ts
api/messages.ts

types/trip.ts
types/user.ts
types/vehicle.ts

component/ui/ActionButton.tsx
```

---

# 23. Limitation technique importante connue

Une difficulté importante a été rencontrée autour de certaines requêtes DQL/API Platform.

Un contournement reposant sur la priorité / l'ordre de résolution a été mis en place afin d'éviter un conflit.

Cette partie doit être considérée comme une dette technique importante.

Avant toute mise en production réelle, cette architecture doit être réévaluée et la cause du conflit doit être résolue proprement.

Le MVP est adapté à une démonstration et un projet pédagogique, mais il ne doit pas être considéré tel quel comme un produit prêt pour une production commerciale.

---

# 24. Images uploadées

Les chemins d'images sont actuellement enregistrés en base.

Un cas connu existe :

* une URL peut rester stockée en base ;
* le fichier physique peut avoir été supprimé ;
* une requête HTTP 404 est alors générée.

Le frontend possède un fallback permettant malgré tout d'afficher une image par défaut.

Pour une reprise du projet, il faudrait :

* supprimer l'ancien fichier lors du remplacement ;
* nettoyer la valeur BDD lors de la suppression ;
* éventuellement utiliser un stockage dédié.

---

# 25. Tests

Les fonctionnalités principales du MVP ont été testées via des tests d'intégration manuels depuis le frontend.

Les scénarios vérifiés comprennent notamment :

* connexion ;
* profil ;
* modification du profil ;
* création d'un trajet ;
* recherche d'un trajet ;
* filtres ;
* trajet réservé aux femmes ;
* restriction selon le genre ;
* consultation d'un trajet ;
* rejoindre un trajet ;
* affichage des voyageurs.

Des tests automatisés supplémentaires seraient nécessaires avant une utilisation en production.

---

# 26. Jeu de données de démonstration

Les fixtures ont été conçues pour permettre de montrer rapidement :

* plusieurs profils ;
* utilisateurs hommes/femmes ;
* profils publics ;
* véhicules ;
* trajets classiques ;
* trajets women_only ;
* voyageurs présents dans des trajets créés par d'autres utilisateurs ;
* avis ;
* recherches depuis plusieurs villes.

Exemples :

* Albert Einstein conduit certains trajets avec Niels Bohr et Richard Feynman comme voyageurs ;
* Marie Curie possède un trajet réservé aux femmes avec Katherine Johnson et Hedy Lamarr ;
* d'autres relations permettent de présenter les listes de voyageurs pendant la démonstration.

---

# 27. Reprendre le développement

Ordre conseillé en cas de reprise :

1. récupérer le dépôt ;
2. lancer Docker ;
3. exécuter `composer install` ;
4. exécuter `npm install` ;
5. lancer les migrations ;
6. charger les fixtures ;
7. vérifier Symfony ;
8. vérifier le build React ;
9. lancer les tests d'intégration ;
10. seulement ensuite commencer un refactoring.

Commandes principales :

```bash
docker compose up -d

docker compose exec app composer install

docker compose exec app php bin/console doctrine:migrations:migrate

docker compose exec app php bin/console doctrine:fixtures:load

cd frontend
npm install
npm run dev
```

Vérification frontend :

```bash
npm run build
```

Vérification Symfony :

```bash
docker compose exec app php bin/console about
```

---

# 28. Fin du MVP

À la clôture du projet :

* Epic 1 : terminé pour le MVP ;
* Epic 2 : terminé pour le MVP ;
* Epic 3 : terminé pour le MVP ;
* jeu de données de démonstration : terminé ;
* architecture Docker : fonctionnelle ;
* authentification : fonctionnelle ;
* frontend principal : fonctionnel ;
* backend principal : fonctionnel.

Le projet est donc considéré comme :

```text
MVP TERMINÉ
```



