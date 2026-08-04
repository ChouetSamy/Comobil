# Déploiement de Comobil

## Présentation

Comobil est déployé sur un serveur Linux (VPS) à l'aide de **Docker Compose**.

Cette solution permet de reproduire facilement l'environnement de développement, d'isoler les différents services de l'application et de simplifier les mises à jour.

Les services déployés sont :

- Frontend React
- Backend Symfony
- Base de données PostgreSQL

---

# Prérequis

Le serveur doit disposer des logiciels suivants :

- Git
- Docker
- Docker Compose
- Un accès SSH

Installation sous Debian / Ubuntu :

```bash
sudo apt update
sudo apt install git docker.io docker-compose-v2 -y
```

Activation de Docker :

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

Vérification :

```bash
docker --version
docker compose version
```

---

# Connexion au serveur

Connexion au serveur via SSH :

```bash
ssh utilisateur@adresse_du_serveur
```

Exemple :

```bash
ssh sam@192.168.1.50
```

---

# Première installation

Création du dossier d'hébergement :

```bash
sudo mkdir -p /var/www
cd /var/www
```

Clonage du dépôt Git :

```bash
git clone https://github.com/CompteGit/Comobil.git
```

Entrer dans le projet :

```bash
cd Comobil
```

Construction des images Docker et démarrage des services :

```bash
docker compose up -d --build
```

---

# Déploiement automatique depuis GitHub

Docker Compose permet également de déployer directement depuis un dépôt Git distant sans cloner le projet.

```bash
Docker compose -f https://github.com/gitaccount/gitrepo.git#gitbranch up-d
```

Exemple pour comobil :
```bash
docker compose \
-f https://github.com/ChouetSamy/Comobil.git#main:compose.yml \
up -d
```

Cette commande :

- télécharge le dépôt Git ;
- récupère la branche spécifiée ;
- lit le fichier compose.yml ;
- construit les images Docker ;
- démarre les conteneurs.

Cette méthode est particulièrement adaptée pour des déploiements rapides.

---

# Déploiement avec un dépôt privé

Création d'une clé SSH :

```bash
ssh-keygen -t ed25519
```

Afficher la clé publique :

```bash
cat ~/.ssh/id_ed25519.pub
```

Ajouter cette clé dans GitHub.

Tester la connexion :

```bash
ssh -T git@github.com
```

Clonage du dépôt :

```bash
git clone git@github.com:CompteGit/Comobil.git
```

---

# Mise à jour de l'application

Se placer dans le projet :

```bash
cd /var/www/Comobil
```

Mettre à jour les sources :

```bash
git pull origin main
```

Reconstruire les images et redémarrer les services :

```bash
docker compose up -d --build
```

---

# Migration de la base de données

Après un changement de structure de la base :

```bash
docker compose exec app php bin/console doctrine:migrations:migrate --no-interaction
```

---

# Vérification du déploiement

Afficher les conteneurs :

```bash
docker compose ps
```

Consulter les journaux :

```bash
docker compose logs
```

Ou uniquement ceux du backend :

```bash
docker compose logs app
```

---

# Redémarrage

```bash
docker compose restart
```

---

# Arrêt des services

```bash
docker compose down
```

---

# Nettoyage

Suppression des ressources Docker inutilisées :

```bash
docker system prune -f
```

---

# Architecture de déploiement

```
Développeur
      │
      │ git push
      ▼
GitHub
      │
      ▼
Connexion SSH
      │
      ▼
Serveur Linux (VPS)
      │
      ├── git pull
      ├── docker compose up -d --build
      └── doctrine:migrations:migrate
      │
      ▼
Docker Compose
├── Frontend React
├── Backend Symfony
└── PostgreSQL
      │
      ▼
 Utilisateur
```

---

# Choix technique

Le choix de Docker Compose permet :

- de garantir un environnement identique entre le développement et la production ;
- d'isoler chaque service dans son propre conteneur ;
- de simplifier les mises à jour grâce à Git ;
- de rendre le déploiement reproductible sur n'importe quel serveur Linux compatible Docker.