# Authentification et gestion du profil

## 1. Objectif

L'API utilise une authentification sans session basée sur des **JSON Web Tokens (JWT)**.

Le flux est le suivant :

```text
POST /register
      │
      ▼
Utilisateur créé
      │
      ▼
POST /login
      │
      ▼
JWT généré
      │
      ▼
Authorization: Bearer <token>
      │
      ▼
Routes protégées
```

L'authentification est stateless : le serveur ne conserve pas de session utilisateur.

---

# 2. LexikJWTAuthenticationBundle

Le bundle utilisé pour générer et vérifier les JWT est :

```text
lexik/jwt-authentication-bundle
```

Il permet notamment :

* de générer un JWT après une authentification réussie ;
* de vérifier la signature d'un JWT ;
* de vérifier sa date d'expiration ;
* de fournir l'utilisateur authentifié à Symfony via `$this->getUser()`.

## Génération des clés

Les clés RSA sont utilisées pour signer les tokens.

La clé privée sert à signer le JWT :

```text
config/jwt/private.pem
```

La clé publique sert à vérifier sa signature :

```text
config/jwt/public.pem
```

La clé privée ne doit jamais être exposée.

---

# 3. Configuration de Symfony Security

Le provider charge les utilisateurs depuis Doctrine grâce à leur adresse email :

```yaml
providers:
    app_user_provider:
        entity:
            class: App\Entity\User
            property: email
```

Le firewall `login` gère la connexion :

```yaml
login:
    pattern: ^/login
    stateless: true
    json_login:
        check_path: /login
        username_path: email
        password_path: password
        success_handler: lexik_jwt_authentication.handler.authentication_success
        failure_handler: lexik_jwt_authentication.handler.authentication_failure
```

Une requête de connexion ressemble donc à :

```http
POST /login
Content-Type: application/json
```

Avec :

```json
{
    "email": "test@test.com",
    "password": "password123"
}
```

Si les identifiants sont corrects, LexikJWTAuthenticationBundle renvoie :

```json
{
    "token": "eyJ..."
}
```

---

# 4. Firewall JWT

Les routes protégées sont prises en charge par le firewall JWT :

```yaml
api:
    pattern: ^/(api|profile)
    stateless: true
    jwt: ~
```

Cela signifie que les routes `/api/...` et `/profile` nécessitent un JWT valide.

L'accès est également protégé par :

```yaml
access_control:
    - { path: ^/login, roles: PUBLIC_ACCESS }
    - { path: ^/register, roles: PUBLIC_ACCESS }
    - { path: ^/(api|profile), roles: IS_AUTHENTICATED_FULLY }
```

Les routes suivantes sont donc publiques :

```text
POST /login
POST /register
```

Les routes suivantes nécessitent une authentification :

```text
GET /profile
PATCH /profile
DELETE /profile
```

---

# 5. Utilisation du JWT côté client

Le JWT doit être envoyé dans l'en-tête HTTP :

```http
Authorization: Bearer <JWT>
```

Exemple avec curl :

```bash
curl \
-H "Authorization: Bearer $TOKEN" \
http://localhost:8080/profile
```

Le préfixe `Bearer` est obligatoire.

Sans lui, Symfony ne reconnaît pas le token comme un JWT :

```text
JWT Token not found
```

---

# 6. Utilisation de jq

`jq` est utilisé pour extraire facilement des données JSON dans le terminal.

Installation :

```bash
sudo apt install jq
```

Pour se connecter et stocker automatiquement le JWT :

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@test.com",
    "password": "password123"
}' | jq -r '.token')
```

La variable `$TOKEN` contient maintenant le JWT.

On peut vérifier son contenu avec :

```bash
echo "$TOKEN" | cut -d '.' -f2 | base64 -d 2>/dev/null | jq
```

Un JWT est composé de trois parties :

```text
HEADER.PAYLOAD.SIGNATURE
```

La partie centrale contient les informations du token.

Exemple :

```json
{
    "iat": 1784217903,
    "exp": 1784261103,
    "roles": [
        "ROLE_USER"
    ],
    "username": "test@test.com",
    "token_version": 0
}
```

---

# 7. Gestion de la version du token

Une colonne `token_version` a été ajoutée à l'entité `User`.

```php
#[ORM\Column]
private int $tokenVersion = 0;
```

Cette valeur est incluse dans le JWT lors de sa création.

Le subscriber :

```php
class JwtCreatedSubscriber implements EventSubscriberInterface
```

ajoute la version actuelle de l'utilisateur au payload du JWT :

```php
$payload = $event->getData();

$payload['token_version'] = $user->getTokenVersion();

$event->setData($payload);
```

Un token contient donc par exemple :

```json
{
    "username": "test@test.com",
    "token_version": 0
}
```

---

# 8. Invalidation des JWT

Les JWT sont normalement valides jusqu'à leur expiration.

Pour pouvoir invalider immédiatement les tokens existants, la version du token est comparée à celle enregistrée en base.

Lorsqu'une action nécessite l'invalidation des tokens :

```php
$user->incrementTokenVersion();
```

La base de données passe par exemple de :

```text
token_version = 0
```

à :

```text
token_version = 1
```

Les anciens tokens contiennent encore :

```json
"token_version": 0
```

La comparaison échoue :

```text
JWT token version != database token version
```

Le token est alors refusé.

---

# 9. Suppression du profil

La suppression du profil est actuellement une suppression logique.

L'utilisateur n'est pas immédiatement supprimé de la base de données.

Le champ suivant est utilisé :

```php
deleted_at
```

Lors de la suppression :

```text
deleted_at = date actuelle
token_version++
```

Exemple :

```text
id | email          | deleted_at           | token_version
1  | test@test.com  | 2026-07-16 16:08:55  | 1
```

Cette approche permet de conserver temporairement les données avant une suppression définitive éventuelle.

---

# 10. Blocage de la connexion après suppression

Le JWT est contrôlé lors de sa création.

Le `JwtCreatedSubscriber` vérifie :

```php
if ($user->getDeletedAt() !== null) {
    throw new UnauthorizedHttpException(
        'Bearer',
        'Invalid credentials'
    );
}
```

Un utilisateur supprimé ne peut donc plus obtenir de nouveau JWT.

Le résultat est :

```text
HTTP 401 Unauthorized
```

avec :

```text
Invalid credentials
```

---

# 11. Blocage des anciens tokens

Lors de la suppression du compte :

```text
token_version++
```

Les anciens JWT contiennent l'ancienne version.

Exemple :

```text
JWT :
token_version = 0

Base de données :
token_version = 1
```

Le token est donc invalide.

Cela permet une déconnexion immédiate de tous les tokens actifs.

---

# 12. Routes du profil

## GET /profile

Récupère le profil de l'utilisateur authentifié.

```bash
curl \
-H "Authorization: Bearer $TOKEN" \
http://localhost:8080/profile
```

Réponse :

```json
{
    "uuid": "...",
    "email": "test2@test.com",
    "first_name": "Sam",
    "last_name": "Updated",
    "phone": "0612345680",
    "gender": "MALE",
    "roles": [
        "ROLE_USER"
    ],
    "created_at": "2026-07-16 16:24:38"
}
```

---

## PATCH /profile

Met à jour les informations du profil.

```bash
curl -X PATCH http://localhost:8080/profile \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "first_name": "SamUpdated",
    "last_name": "Updated",
    "phone": "0612345680",
    "gender": "MALE"
}'
```

Les données sont validées avec Symfony Validator.

Exemple :

```json
{
    "phone": ""
}
```

Retour :

```http
400 Bad Request
```

avec :

```text
This value should not be blank.
```

---

## DELETE /profile

Supprime logiquement le profil.

```bash
curl -i -X DELETE http://localhost:8080/profile \
-H "Authorization: Bearer $TOKEN"
```

Le système :

```text
1. Récupère l'utilisateur authentifié
2. Définit deleted_at
3. Incrémente token_version
4. Enregistre les changements
5. Rend les anciens JWT invalides
```

Réponse :

```json
{
    "message": "Profile deleted"
}
```

Après cette opération :

```text
Ancien JWT → refusé
Nouveau login → refusé
```

---

# 13. Tests réalisés

## Connexion

```bash
POST /login
```

Résultat :

```text
200 OK
```

avec un JWT.

---

## Accès au profil

```bash
GET /profile
```

Avec un JWT valide :

```text
200 OK
```

Sans JWT :

```text
401 Unauthorized
```

---

## Mise à jour valide

```text
PATCH /profile
```

Résultat :

```text
200 OK
```

---

## Mise à jour invalide

Exemple :

```json
{
    "phone": ""
}
```

Résultat :

```text
400 Bad Request
```

avec les erreurs Symfony Validator.

---

## Suppression

Après :

```text
DELETE /profile
```

La base contient :

```text
deleted_at != NULL
token_version++
```

L'ancien JWT est ensuite refusé.

Une nouvelle tentative de connexion est également refusée.

---

# 14. Commandes utiles

Vider le cache Symfony :

```bash
docker compose exec app php bin/console cache:clear
```

Vérifier un service :

```bash
docker compose exec app php bin/console debug:container \
App\\EventSubscriber\\JwtCreatedSubscriber
```

Vérifier les événements :

```bash
docker compose exec app php bin/console debug:event-dispatcher \
lexik_jwt_authentication.on_jwt_created
```

```bash
docker compose exec app php bin/console debug:event-dispatcher \
lexik_jwt_authentication.on_jwt_decoded
```

Vérifier les données utilisateur :

```bash
docker compose exec app php bin/console dbal:run-sql \
'SELECT id, email, deleted_at, token_version FROM "user";'
```

Lancer les migrations :

```bash
docker compose exec app php bin/console doctrine:migrations:migrate
```

---

# Résumé de l'architecture

```text
                    ┌──────────────┐
                    │  POST /login │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ UserProvider │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Lexik JWT   │
                    └──────┬───────┘
                           │
                           ▼
                       JWT créé
                           │
                           ▼
                  token_version ajouté
                           │
                           ▼
             Authorization: Bearer <JWT>
                           │
                           ▼
                    JWT décodé
                           │
                           ▼
              token_version vérifié
                           │
                           ▼
                   User authentifié
                           │
                           ▼
                GET/PATCH/DELETE /profile
```
