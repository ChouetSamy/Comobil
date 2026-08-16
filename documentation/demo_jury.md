# Comobil — Démonstration jury

## Objectif

Cette démonstration présente le MVP final de Comobil.

Durée conseillée : 10 à 15 minutes.

---

## 1. Démarrage

Depuis la racine :

docker compose up -d
docker compose ps

Backend :
http://localhost:8080

Frontend :
http://localhost:5174

---

## 2. Comptes de démonstration

Mot de passe commun :

Demo1234!

### Profil homme

albert@comobil.local

Albert Einstein permet notamment de démontrer les restrictions
appliquées aux trajets réservés aux femmes.

### Profil femme

marie@comobil.local

Marie Curie permet de démontrer :

- la création d'un trajet women_only ;
- la recherche d'un trajet women_only ;
- l'accès à ces trajets ;
- la participation à ces trajets.

Autres comptes utiles :

kurt@comobil.local
niels@comobil.local
katherine@comobil.local
hedy@comobil.local

---

# 3. Parcours conseillé

## Étape 1 — Connexion

Se connecter avec Albert Einstein.

Montrer :

- authentification ;
- navigation ;
- profil personnel ;
- modification du profil ;
- véhicule ;
- préférences.

---

## Étape 2 — Profil public

Depuis un trajet, ouvrir la fiche d'un autre utilisateur.

Montrer :

- UserCard ;
- profil public ;
- biographie ;
- véhicule ;
- préférences ;
- avis ;
- actions utilisateur.

Expliquer que `/profile` et `/profile/{id}` réutilisent
le même composant React `Profile`.

---

## Étape 3 — Recherche

Ouvrir la recherche.

Effectuer une recherche par ville.

Montrer :

- départ facultatif ;
- arrivée facultative ;
- date facultative ;
- heure facultative ;
- préférences ;
- résultats sous forme de TripCard.

La recherche backend :

- exclut les trajets passés ;
- exclut les trajets annulés ;
- exclut les trajets complets ;
- limite la réponse à 50 résultats ;
- trie les résultats chronologiquement.

---

## Étape 4 — Sécurité women_only

Toujours connecté avec Albert Einstein :

rechercher une ville contenant également un trajet réservé aux femmes.

Montrer que le trajet women_only n'est pas visible.

Expliquer que cette restriction n'est pas seulement visuelle.

Le backend protège également :

- la recherche ;
- l'accès direct au trajet via TripVoter ;
- la tentative de rejoindre le trajet via TravelerProcessor.

---

## Étape 5 — Connexion avec Marie Curie

Se déconnecter.

Se connecter avec :

marie@comobil.local

Mot de passe :

Demo1234!

Effectuer la même recherche.

Montrer que les trajets women_only deviennent accessibles.

---

## Étape 6 — TripDetails

Ouvrir un trajet.

Montrer :

- créateur ;
- UserCard ;
- départ / arrivée ;
- horaires ;
- prix ;
- places restantes ;
- préférences ;
- voyageurs ;
- véhicule ;
- messagerie.

---

## Étape 7 — Rejoindre un trajet

Choisir un trajet auquel Marie ne participe pas encore.

Cliquer sur :

REJOINDRE LE TRAJET

Expliquer que le frontend n'envoie pas l'identité de l'utilisateur.

Le TravelerProcessor récupère l'utilisateur authentifié depuis le JWT.

Cela évite de permettre au client de choisir arbitrairement
l'utilisateur à inscrire.

---

## Étape 8 — Création de trajet

Ouvrir :

Créer un trajet

Montrer :

- adresse de départ ;
- ville ;
- adresse d'arrivée ;
- dates ;
- heures ;
- places ;
- prix ;
- rôle ;
- véhicule ;
- women_only.

Expliquer le comportement `find or create` utilisé pour les villes.

---

## Étape 9 — Messagerie

Depuis TripDetails :

- la messagerie principale correspond au trajet ;
- l'option message privé concerne deux utilisateurs.

Expliquer la distinction :

TripMessage = contexte du covoiturage
PrivateMessage = conversation entre deux utilisateurs

---

# 4. Composants frontend réutilisés

Mettre en avant :

- UserCard
- TripCard
- VehicleCard
- MessageCard

Ils permettent de réutiliser les mêmes représentations
dans plusieurs pages.

---

# 5. Architecture

Présenter rapidement :

React + TypeScript + Vite
        |
        | HTTP / JWT
        v
Symfony 8.1 + API Platform
        |
        | Doctrine
        v
PostgreSQL

Le tout est exécuté avec Docker Compose.

---

# 6. Sécurité

Points intéressants à présenter :

- JWT ;
- ROLE_USER ;
- Voters ;
- Processors ;
- contrôle women_only côté backend ;
- créateur seul autorisé à modifier ou annuler son trajet ;
- utilisateur extrait du JWT lors de l'inscription à un trajet.

---

# 7. Dette technique

Ne pas présenter le MVP comme un produit prêt pour la production.

Points identifiés :

- appels fetch encore dispersés ;
- API_URL dupliquée dans plusieurs fichiers ;
- interfaces TypeScript parfois dupliquées ;
- hydratation des IRI répétée ;
- composants UI supplémentaires possibles ;
- gestion des fichiers uploadés à améliorer ;
- conflit DQL/API Platform contourné mais non résolu définitivement.

Formulation possible :

"J'ai privilégié la livraison d'un MVP fonctionnel.
Si le projet devait continuer, ma première étape serait un refactoring
du frontend et de la couche d'accès API."

---

# 8. Conclusion

Le MVP couvre le parcours principal :

Créer un compte
    ↓
Créer / modifier son profil
    ↓
Créer un trajet
    ↓
Rechercher un trajet
    ↓
Consulter un trajet
    ↓
Rejoindre un trajet
    ↓
Consulter les participants
    ↓
Communiquer

Le MVP Comobil est considéré terminé.