# Spécifications Fonctionnelles - Application Comobil

## Contexte général du projet
**Comobil** est une application de covoiturage centrée sur le partage de trajets. 
L'originalité du projet réside dans le fait qu'un utilisateur n'a pas nécessairement besoin de posséder un véhicule (ou un permis) pour **créer un trajet** et chercher un conducteur, ou pour louer un véhicule à une institution (Mairie, Entreprise).
À long terme, l'objectif est de fournir un **Dashboard Institutionnel** permettant aux mairies et entreprises de consulter les trajets des utilisateurs, d'optimiser les déplacements et de gérer intelligemment leurs flottes de véhicules.

---

## Fonctionnalité 1 : Recherche de trajet

### Contenu de la fonctionnalité
L'utilisateur peut rechercher un trajet existant parmi ceux proposés par la communauté.

*   **Barre de recherche :**
    *   Lieu de départ / Lieu d'arrivée
    *   Date de départ
    *   Heure de départ
    *   Date d'arrivée estimée
    *   Heure d'arrivée estimée
    *   Nombre de passagers
*   **Résultat de recherche :**
    *   Liste des trajets correspondants.
    *   Prix estimé par passager pour chaque trajet.
*   **Page d'un trajet :**
    *   Détails complets du trajet (conducteur, horaires, règles).
    *   Action pour **réserver** une place.

---

## Fonctionnalité 2 : Espace membre (Gestion de profil)

### Contenu de la fonctionnalité
Permet à l'utilisateur de gérer ses informations personnelles, ses préférences et ses trajets passés/futurs.

*   **Personnaliser son Profil :**
    *   Préférences de covoiturage (non-fumeur, animaux interdits, femme seulement, sans musique, silence).
    *   Description libre de ses préférences.
    *   Gestion du mot de passe (réinitialisation).
*   **Historique des trajets :**
    *   Consultation des trajets à venir.
    *   Consultation des trajets passés.
*   **Ajouter son véhicule (pour les propriétaires) :**
    *   Consommation (L/100km), Climatisation, Nombre de sièges, Espace bagage.
    *   État du véhicule (Neuf, Très bon, Bon, Mauvais, En maintenance).
    *   Description de l'état du véhicule.

---

## Fonctionnalité 3 : Création de trajet

### Contenu de la fonctionnalité
Un utilisateur (qu'il possède ou non un véhicule) publie une demande ou une offre de trajet.

*   **Paramètres de base :**
    *   Définir le nombre de passagers.
    *   Définir le point de départ et la destination.
    *   Définir la date et l'heure de départ.
    *   Définir la durée estimée.
    *   Définir le prix / mettre un tarif.
*   **Paramètres avancés :**
    *   Définir les **filtres du trajet** (non-fumeurs, catégorie d'âge, préférences de musique, etc.)

---

## Fonctionnalité 4 : Profil Public (Visibilité par les autres utilisateurs)

### Contenu de la fonctionnalité
Le profil visible par la communauté pour favoriser la confiance et la sécurité.

*   **Informations affichées :**
    *   Photo de profil.
    *   Avis reçus (notes et commentaires).
*   **Interactions sociales et sécurité :**
    *   Ajouter un avis sur un autre conducteur/utilisateur.
    *   Voir les avis des autres utilisateurs ayant participé au trajet.
    *   Système de **mise en liste noire** (blocage d'un utilisateur).
    *   Bouton **Signaler** (un utilisateur ou un avis abusif).
    *   Envoyer un message privé.
*   **Système de notifications :**
    *   Alerte : "Votre trajet part bientôt".
    *   Alerte : "Votre trajet a été annulé".
    *   Alerte : "Votre trajet a été modifié".

---

## Fonctionnalité 5 : Compte rendu du trajet / Détail du trajet

### Contenu de la fonctionnalité
Gestion des interactions post-trajet entre les participants.

*   **Consultation :**
    *   Consulter les profils des conducteurs/passagers participant au trajet.
*   **Feedback et Modération :**
    *   Ajouter un avis sur le trajet effectué.
    *   **Signaler** un abus (utilisateur ou avis).
    *   **Mettre en liste noire** (bloquer) un participant après le trajet.
*   **Informations de suivi :**
    *   Consulter les informations précises du trajet (Départ, Heure, Date).
    *   Noter le trajet (qualité du covoiturage).
    *   Visualiser les préférences respectées durant le trajet (fumeur, musique, etc.).

---

## Fonctionnalité 6 : Dashboard Modérateur (Gestion de la plateforme)

### Contenu de la fonctionnalité
Espace réservé aux administrateurs pour gérer la sécurité et la bonne conduite de la communauté.

*   **Gestion des contenus :**
    *   Visualiser, filtrer et gérer les signalements.
    *   Gérer les avis inappropriés ou frauduleux.
*   **Support utilisateur :**
    *   Gestion des tickets utilisateurs (gestion des litiges entre conducteurs et passagers).

---

## Fonctionnalité 7 : Location d'un véhicule (B2C / B2B)

### Contenu de la fonctionnalité
Un utilisateur sans véhicule peut en louer un via la plateforme, notamment via les flottes mises à disposition par les institutions.

*   **Processus de location :**
    *   Formulaire de demande d'emprunt d'un véhicule.
*   **Gestion de la flotte locative :**
    *   Consultation de l'état des véhicules disponibles à la location.
    *   Signature d'un contrat de location numérique.
*   **Logistique :**
    *   Adresse de récupération (emprunt).
    *   Adresse de dépôt (retour) du véhicule.

---

## Fonctionnalité 8 : Dashboard Institution (Mairie / Entreprise)

### Contenu de la fonctionnalité
Permet aux organismes de gérer leur flotte et d'optimiser les trajets de leurs citoyens/employés.

*   **Gestion des points de location :**
    *   Gestion des points de récupération et de dépôt des véhicules.
*   **Gestion de la flotte (CRUD) :**
    *   Ajouter un véhicule à la flotte de l'institution.
    *   Modifier un véhicule de la flotte.
    *   Supprimer un véhicule de la flotte.
    *   Voir la liste des véhicules (Barre de recherche, catalogue véhicule, catalogue flotte).
*   **Optimisation des trajets :**
    *   Gestion du suivi des véhicules de la flotte.
    *   Possibilité de modification et de mise à jour des trajets ou des assignations de véhicule.
*   **Visualisation de données :**
    *   Tableau de bord analytique (données de trajets des utilisateurs pour optimiser les flottes, coûts, etc.).

---

## Fonctionnalité 9 : Groupe de Covoiturage

### Contenu de la fonctionnalité
Permet de créer des communautés fermées pour faciliter le covoiturage entre collègues, voisins ou amis.

*   **Gestion du groupe :**
    *   Inviter un autre utilisateur dans le groupe.
    *   Proposer un trajet spécifiquement pour les membres d'un groupe.
*   **Communication :**
    *   Messagerie interne de groupe pour s'organiser entre membres.

---

## Fonctionnalité 10 : Partage du prix du trajet (Système de tarification)

### Contenu de la fonctionnalité
Algorithme de calcul pour répartir les coûts de manière équitable.

*   **Calcul dynamique :**
    *   Tarifs fixés en fonction de la distance, de la consommation carburant, des péages, et des frais d'entretien.
*   **Transparence :**
    *   Affichage d'un prix prévisionnel.
    *   Calcul du prix final après le trajet.
*   **Répartition :**
    *   Gestion de la part du conducteur et des passagers.
    *   Tarif dégressif ou fixé en fonction du nombre de passagers total pour rentabiliser le trajet.

---

## Fonctionnalité 11 : Gestion Véhicule (Profil propriétaire)

### Contenu de la fonctionnalité
Gestion technique de la flotte personnelle pour les propriétaires de véhicules sur la plateforme.

*   **Documents officiels :**
    *   Immatriculation du véhicule (Carte Grise).
    *   Validation de l'assurance du véhicule (vérification des dates).
*   **Maintenance et suivi :**
    *   État du véhicule (vidange, entretiens généraux, contrôle technique).
    *   Prévisions d'entretien et de réparation (alerte kilométrage).
*   **Catégorisation :**
    *   Définir la catégorie du véhicule (Citadine, SUV, Utilitaire, etc.).