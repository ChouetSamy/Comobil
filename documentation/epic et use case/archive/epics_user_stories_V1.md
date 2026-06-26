# Epic

<!-- ## Epic 1 MVP : fonctionnalité Utilisateurs initiaux -->

<!-- ### User Story 1.1 : En tant que visiteur, je veut voir les trajets commun existants avant d'en choisir un.

- CA 1 : les visiteurs du site peuvent voir les voyageurs sur le même trajet en fonction de la ville de départ et de destination
- CA 2 : pour rejoindre ou créer un trajet, le visiteur dois être inscrit ET connecté ! -->

### User Story 1.1 : En tant que visiteur, je veut m'inscrire afin de pouvoir se connecter
- CA  1 : le voyageur se connecte, si il est n'est pas inscrit, il s'incrit en premier
- CA 2 : l'utilisateur remplis les champs "email", "mot de passe", "nom", "prénom", "téléphone", "genre", tous sont obligatoire
- CA 3 : en cas d'un champs manquant, l'utilisateur reçois un message "veuillez remplir le champs suivant:  (nom du champs)", et échoue à s'inscrire.
- CA 4 : l'utilisateur remplis tous les champs, il s'enregistre et est connecté.


### User Story 1.2 : En tant que voyageur, je veut me connecter afin de pouvoir participer à un trajet

- CA  1 : le voyageur se connecte, si non inscrit, il s'incrit en premier
- CA  2 : le voyageur choisi une ville de départ et de destination, si la ville n'existe pas il l'ajoute.
- CA  3 : le voyageur enregistre son trajet, ce dernier s'affiche sur le site.
 
### User Story 1.3 : En tant que voyageur, je veut rejoindre un trajet commun avec un autre voyageur pour arriver a destination a moindre coût.

- CA  1 : le voyageur se connecte, si non inscrit, il s'incrit en premier
- CA  2 : le voyageur choisi un des trajets commun, et le rejoint
- CA  3 : le voyageur est affiché dans le trajet

<!-- ## Epic 2 MVP: Trajet -->

### User Story 2.1 : En tant qu'utilisateur, je veut pouvoir créer un trajet pour que les autres utilisateurs puisse me rejoindre

- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur remplis les champs suivant (ville de départ, ville d'arrivée, point d'intérêt, heure de départ/d'arrivée, nombre de place dans le véhicule, date, régularité (optionnel)), puis clique
- CA 3 : en cas d'un champs non optionel manquant, l'utilisateur reçois un message "veuillez remplir le champs suivant:  (nom du champs)", et échoue à créer un trajet
- CA 3 : le trajet est enregistré puis affiché au autre utilisateurs.

### User Story 2.2 : En tant qu'utilisateur, je veut pouvoir rejoindre un trajet existant pour me déplacer

- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur clique sur le bouton "rejoindre", si les places sont complètes, l'utilisateur reçois un message, et ne rejoint pas le trajet.
- CA 3 : l'utilisateur est enregistré dans le trajet.

### User Story 2.3 : En tant qu'utilisateur, je veut savoir qui a rejoins un trajet pour m'informé du nombre de covoiturants

- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur clique sur profil membre, ou sur le trajet qu'il a créer dans la liste des trajets
- CA 3 : l'utilisateur peut voir qui a rejoins le trajet et si il est complet

### User Story 2.4 : En tant qu'utilisateur, je veut annuler un trajet que j'ai créer car je ne peut/souhaite plus le faire

- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur clique sur son profil membre, ou sur le trajet qu'il a créer dans la liste des trajets
- CA 3 : l'utilisateur clique sur supprimer le trajet, ce dernier est supprimé.

### User Story 2.5 : En tant qu'utilisateur, je veut quitter un trajet que j'ai rejoint car je ne peut/souhaite plus le faire

- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur clique sur son profil membre, ou sur le trajet qu'il a rejoins dans la liste des trajets
- CA 3 : l'utilisateur clique sur supprimer le trajet, l'utilisateur est supprimé de la liste d'utilisateurs présent dans le trajet

### User Story 2.6 : En tant qu'utilisateur, je souhaite me connecter pour rejoindre ou créer un trajet et me déplacer pour moins cher.
- CA 1 : l'utilisateur clique sur "Se connecter"
- CA 2 : si il est déjà inscrit, l'utilisateur est connecté et peut alors faire tous les cas d'usage précédent
- CA 3 : si se trompe d'identifiants, il reçois un message "mauvais identifiant", et échoue à se connecter.

### User Story 2.7 : En tant qu'utilisateur, je souhaite m'inscrire pour accéder aux trajets et me déplacer pour moins cher.
- CA 1 : l'utilisateur clique sur "S'inscrire"
- CA 2 : l'utilisateur remplis les champs "email", "mot de passe", "nom", "prénom", "téléphone", "genre", tous sont obligatoire
- CA 3 : en cas d'un champs manquant, l'utilisateur reçois un message "veuillez remplir le champs suivant:  (nom du champs)", et échoue à s'inscrire.
- CA 4 : l'utilisateur remplis tous les champs, il s'enregistre et est connecté.

### User Story 2.8 : En tant qu'utilisateur, je veut voir les trajets commun existants avant d'en choisir un.

- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur clique sur le bouton "Trajets"
- CA 3 : l'utilisateur rentre sa ville de départ, et sa ville destination
- CA 4 : la liste des trajets s'affichent



## Epic 3 MVP : Espace Membre

### User Story 3.1 : En tant qu'utilisateur, je souhaite voir les détails de mes informations pour vérifier qu'elles soient correcte
- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur clique sur "Profil"
- CA 3 : l'utilisateur apperçois ses informations.

### User Story 3.2 : En tant qu'utilisateur, je veut pouvoir modifié mes informations afin de les mettre à jour

- CA 1 : l'utilisateur se connecte, si non inscrit, il s'incrit en premier
- CA 2 : l'utilisateur clique sur "Profil"
- CA 3 : l'utilisateur clique sur "Modifié"
- CA 4 : l'utilisateur remplis les champs qu'il souhaite modifié
- CA 5 : l'utilisateur clique sur  "Enregistrer"
- CA 6 : les modifications sont enregistré
 
### User Story 3.3 : En tant qu'utilisateur, je souhaite supprimer mon profil car je ne me sert plus de cette application
- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur clique sur "Profil"
- CA 3 : l'utilisateur clique sur "Supprimer mon profil"
- CA 4 : l'utilisateur reçois un message "êtes vous sûr?"
- CA 5 : l'utilisateur clique sur  "Non", la suppression est annulée
- CA 6 : l'utilisateur clique sur  "Oui", l'utilisateur est définitivement supprimé, et déconnecté immédiatement

## Epic 4 Should Have : Modération et note

### User Story 4.1 :  En tant que voyageur, je souhaite mettre un autre voyageur en liste noire pour ne plus jamais avoir à voyager avec cette personne
- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur consulte la liste des voyageurs d'un trajet ou l'historique de ses trajets
- CA 3 : l'utilisateur clique sur "bloquer" à côté de l'utilisateur qu'il souhaite bloquer
- CA 4 : si l'utilisateur est dans le même trajet que l'utilisateur bloqué, l'utilisateur est éjecté.
- CA 5 : l'utilisateur ne vois plus les trajets dans lesquels se trouvent les utilisateurs dans sa liste noire
- CA 6 : l'utilisateur bloqué ne vois plus les trajets dans lesquels se trouvent l'utilisateur qui l'a mis dans sa liste noire

### User Story 4.2 : En tant que voyageur, je souhaite noter un autre voyageur pour faire connaître son comportement à tous
- CA 1 : l'utilisateur se connecte, si non inscrit, il s'incrit en premier
- CA 2 : l'utilisateur consulte la liste des voyageurs d'un trajet ou l'historique de ses trajets
- CA 3 : l'utilisateur clique sur sur le nombre d'étoile à côté de l'utilisateur qu'il souhaite noter
- CA 4 : le nombre d'étoile assigné est enregistré.
- CA 5 : le nombre d'étoile affiché est pondéré par la moyenne des étoiles déjà reçue

### User Story 4.3 : En tant qu'utilisateur, je souhaite signaler le comportement d'un utilisateur afin de le faire remonter aux admins
- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur consulte la liste des voyageurs d'un trajet ou l'historique de ses trajets
- CA 3 : l'utilisateur clique sur sur signalé à côté de l'utilisateur qu'il souhaite signalé
- CA 4 : le signlament termine dans  la liste de ticket d'un admin

### User Story 4.4 : En tant qu'admin, je me connecte pour gérer les signalements afin de les validé ou les refusé
- CA 1 : l'admin se connecte, sinon s'inscrit
- CA 2 : l'admin ouvre son dashboard puis clique sur "signalement"
- CA 3 : l'admin apperçois la liste des signalements et peut cliquer dessus pour avoir le détails

### User Story 4.5 : En tant qu'admin, je banni un utilisateur à partir d'un signalement que j'ai reçu, afin que ce dernier n'accède plus au site
- CA 1 : l'admin se connecte, sinon s'inscrit
- CA 2 : l'admin ouvre son dashboard puis clique sur signalement
- CA 3 : l'admin apperçois la liste des signalements et peut cliquer dessus pour avoir le détails
- CA 4 : l'admin clique sur bannir l'utilisateur, il détails les raisons du bannissement dans son message de bannissement
- CA 5 : l'utilisateur banni est supprimé de la base de donnée, son ip et son mail son garder pendant au moins 6mois pour interdire la réinscription

## Epic 5 Could Have trajet réservé aux femmes
### User Story 5.1 :  En tant que voyageuse, je souhaite limité mes trajets seulement aux autres femmes afin de ne pas être dérangé par les hommes

- CA 1 : la voyageuse se connecte, sinon s'inscrit
- CA 2 : la voyageuse créer un trajet et coche la case "femmes seulement"
- CA 3 : seul les voyageuses peuvent cocher ces cases
- CA 4 : lorsque la case est cochée seule les femmes peuvent voir et rejoindre ce trajet
- CA 5 : le trajet est enregistré

### User Story 5.2 :  En tant que voyageuse, je souhaite rejoindre les trajets seulement accessible aux autres femmes afin de ne pas être dérangé par les hommes

- CA 1 : la voyageuse se connecte, sinon s'inscrit
- CA 2 : la voyageuse vois la liste des trajets et coche une case "femmes seulement"
- CA 3 : seul les voyageuses peuvent cocher ces cases
- CA 4 : lorsque la case est cochée seule les femmes peuvent voir et rejoindre ce trajet
- CA 5 : le trajet est enregistré

## Epic 6 won't have Escale

### User Story 6.1 :  En tant que voyageur, je souhaite ajouter des escales pour me reposer ou déposer ou prendre d'autres voyageurs


## Epic 7 won't Have location de véhicule

### User Story 7.1 :  En tant que voyageur, je souhaite emprunter un véhicule pour pouvoir faire le trajet car je n'en ai pas

### User Story 7.2 :  En tant qu'entité morale, je souhaite prêter un véhicule aux utilisateurs


## Epic 8 won't Have historique des trajets

### User Story 8.1 :  En tant que voyageur, je souhaite consulter l'historique de mes trajets afin de voir les utilisateurs avec lesquels j'ai déjà voyager

## Epic 9 won't Have groupe de covoiturage

### User Story 9.1 :  En tant que voyageur, je souhaite louer un véhicule pour pouvoir faire le trajet car je n'en ai pas

##  Epic 10 could have amélioration de l'organisation des trajets (ajout des rôles "Conducteur.ice"/"Passager.e")

### User Story 10.1 :  En tant que voyageur, je souhaite être conducteur pour conduire lors d'un trajet que j'ai créer
- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur créer un trajet
- CA 3 : l'utilisateur est automatiquement assigné en tant que conducteur
- CA 4 : l'utilisateur valide la création du trajet.

### User Story 10.2 :  En tant que voyageur, je souhaite être passager pour être conduis lors d'un trajet que j'ai créer
- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur créer un trajet
- CA 3 : l'utilisateur est automatiquement assigné en tant que conducteur
- CA 4 : l'utilisateur change son rôle de "Conducteur.ice" à "Passager.e"
- CA 5 : l'utilisateur valide la création du trajet.

### User Story 10.3 :  En tant que voyageur, je souhaite être conducteur pour conduire lors d'un trajet que j'ai rejoint
- CA 1 : l'utilisateur se connecte, sinon s'inscrit
- CA 2 : l'utilisateur clique sur la liste des trajets et coche la case "cherche un(e) conducteur.ice"
- CA 3 : l'utilisateur vois les trajets sans conducteur
- CA 4 : l'utilisateur rejoins un trajets sans conducteur
- CA 5 : si aucun autre utilisateur n'est conducteur, l'utilisateur peut changer son rôle à conducteur.ice

# glossaire de l'epic:

Point d'intérêt: c'est le lieu de la prise en charge à la montée ou à la descente d'un usager de l'appli, exemple: je prends la voiture à Toulouse, le lieu d'intérêt est le Métro Capitole (défini par l'usager) je descend à Paris, le point d'intérêt est les champs élysée (défini par l'usager), pour faire court, le point d'intéret est l'adresse exacte défini par l'usager pour le départ et/ou l'arrivée, ou une escale
