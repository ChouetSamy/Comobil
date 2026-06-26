# Épics et Critères d'Acceptation (CA) - Projet Comobil

## Structure du document
Ce document découpe le périmètre de Comobil, en grandes briques techniques (Épics), subdivisées en User Stories.
Chaque User Story est accompagnée de ses **Critères d'Acceptation (CA)** détaillés sous forme de scénarios utilisateur pour valider le développement.
chaque Epic est contenu dans une priorité, grâce à la methode MOSCOW, pour se concentrer sur les partie fonctionnelles prioritaire de l'app

## Glossaire
- **Visiteur** : Utilisateur non connecté, qui s'est inscrit ou pas encore. (généralement première visite du site)
- **Utilisateur** : Personne s'étant inscrite, puis connectée.
- **MVP** : Priorité Must Have.

---
# PRIORITÉ MVP

## Epic 0 : Visiteur (Landing Page)

### US 0.1 : Visite du site puis accès à l'inscription
**En tant que** visiteur, 
**Je veux** voir une page d'accueil présentant le concept (recherche de trajet, création),
**Afin de** comprendre l'utilité de l'application avant de m'engager.

- **CA (Scénario de succès) :**
    - *Étant donné* que je suis sur la page d'accueil,
    - *Alors* je vois une description du site et des appels à l'action pour ses fonctionnalités principales : recherche et création de trajet.
    - *Quand* j'interagis avec un appel à l'action, ou quand je clique sur l'icône "profil",
    - *Alors* je suis renvoyé vers la page de connexion, sur laquelle je vois un lien hypertexte "Pas encore de compte ? Inscrivez-vous".
    - *Quand* je clique sur le lien hypertexte "Pas encore de compte ? Inscrivez-vous",
    - *Alors* je suis renvoyé vers la page d'inscription.

---

## Epic 1 MVP : Inscription, Authentification et Sécurité

### US 1.1 : Inscription d'un nouvel utilisateur
**En tant que** visiteur non inscrit,
**Je veux** créer un compte avec mon email et un mot de passe,
**Afin de** pouvoir utiliser les fonctionnalités de la plateforme.

- **CA (Scénario de succès) :**
    - *Étant donné* que je suis sur la page d'inscription,
    - *Quand* je remplis tous les champs obligatoires (Nom, Prénom, Email, Genre, Mot de passe, Téléphone) valides,
    - *Alors* mon compte est créé, et je suis automatiquement redirigé vers mon Espace membre.
- **CA (Scénario d'échec) :**
    - *Étant donné* que je suis sur la page d'inscription,
    - *Quand* je saisis une adresse email déjà utilisée ou un mot de passe trop court (< 8 caractères),
    - *Alors* le système affiche un message d'erreur explicite et m'empêche de valider le formulaire.

### US 1.2 : Connexion et déconnexion
**En tant que** utilisateur inscrit,
**Je veux** me connecter à mon compte et me déconnecter,
**Afin de** pouvoir accéder aux fonctionnalités du site et sécuriser l'accès à mes données personnelles.

- **CA (Scénario de connexion réussie) :**
    - *Étant donné* que je possède un compte valide,
    - *Quand* je saisis mon identifiant (email) et mon mot de passe corrects,
    - *Alors* je suis authentifié et redirigé vers le tableau de bord principal.

- **CA (Scénario de connexion échouée) :**
    - *Étant donné* que je possède un compte valide,
    - *Quand* je saisis mon identifiant (email) et/ou mon mot de passe incorrects,
    - *Alors* le système affiche un message d'erreur explicite et m'empêche de me connecter.

- **CA (Scénario de déconnexion) :**
    - *Étant donné* que je suis connecté à mon espace,
    - *Quand* je clique sur le bouton "Déconnexion",
    - *Alors* ma session est fermée et je suis redirigé vers la page d'accueil publique.

### US 1.3 : Navigation simplifiée
**En tant que** utilisateur connecté, 
**Je veux** accéder à toutes les sections (Déconnexion, Profil, Création, Historique, À Propos) via un menu burger, 
**Afin de** naviguer facilement sur l'application.

- **CA (Scénario d'ouverture du menu) :**
    - *Étant donné* que je suis connecté,
    - *Quand* je clique sur l'icône "Menu burger",
    - *Alors* un panneau latéral s'ouvre affichant tous les liens de navigation (Profil, Historique, Créer un trajet, À propos, Déconnexion).

---

## Epic 2 MVP : Espace membre (Gestion de profil)

### US 2.1 : Gestion des informations personnelles
**En tant que** utilisateur inscrit,
**Je veux** modifier ma photo de profil, ma biographie et mes préférences de voyage (musique, discussion, animaux, absence tabac),
**Afin de** personnaliser mon profil pour les autres covoitureurs.

- **CA (Scénario de modification) :**
    - *Étant donné* que je suis sur la page "Éditer mon profil",
    - *Quand* je modifie ma photo de profil et que je sélectionne "Musique autorisée" / "Discussion autorisée",
    - *Alors* les modifications sont enregistrées et immédiatement visibles sur mon profil public.
    - *Et* la mention "Non-fumeur / Animaux acceptés" s'affiche sur mes futurs trajets.

### US 2.2 : Ajout d'un véhicule à son profil
**En tant que** conducteur,
**Je veux** enregistrer les caractéristiques de mon véhicule (Consommation, Nb de sièges, État, Description du véhicule, photo du véhicule (optionnel)),
**Afin de** renseigner les passagers sur le moyen de transport proposé.

- **CA (Scénario de création réussie) :**
    - *Étant donné* que je suis dans la section "Mes véhicules",
    - *Quand* je renseigne les champs (Climatisation, Consommation L/100, État : "Très bon", description : "fauteuil confortable, ne fait aucun bruit", photo du véhicule (optionnel)),
    - *Alors* le véhicule est ajouté à mon profil et apparaît dans la liste déroulante lors de la création d'un trajet.

- **CA (Scénario de création échouée) :**
    - *Étant donné* que je suis dans la section "Mes véhicules",
    - *Quand* j'oublie l'un des champs obligatoires (Climatisation, Consommation L/100, État, description),
    - *Alors* je reçois un message d'erreur, et l'enregistrement du véhicule échoue.

### US 2.3 : Consultation de l'historique des trajets
**En tant que** utilisateur,
**Je veux** consulter la liste de mes trajets passés et à venir,
**Afin de** suivre mes déplacements.

- **CA (Scénario d'affichage des trajets à venir) :**
    - *Étant donné* que j'ai déjà participé à un trajet,
    - *Quand* je vais sur la page "Historique" (par défaut sur l'onglet "À venir"),
    - *Alors* je vois une liste de mes trajets futurs.
    - *Et* je peux cliquer sur un trajet pour avoir le détail.

- **CA (Scénario d'affichage des trajets passés) :**
    - *Étant donné* que j'ai déjà participé à un trajet,
    - *Quand* je vais sur la page "Historique" et que je clique sur l'onglet "Passé",
    - *Alors* je vois une liste de mes trajets terminés.
    - *Et* je peux cliquer sur un trajet pour avoir le détail.

---

## Epic 3 MVP : Création et Recherche de trajet (Le matching)

### US 3.1 : Création et publication d'un trajet (Offre et Demande)
**En tant que** utilisateur (ayant ou non un véhicule),
**Je veux** créer et publier un trajet (Départ, Arrivée, Date (départ et arrivée, par défaut date du jour), Heure (départ et arrivée), Prix (par défaut 0), nombre de places (par défaut 3)),
**Afin de** trouver un conducteur ou des passagers pour mon itinéraire.

- **CA (Scénario de création standard réussie) :**
    - *Étant donné* que je suis sur le formulaire de création de trajet,
    - *Quand* je saisis une adresse de départ, une adresse d'arrivée, une date et heure de départ, une date et heure d'arrivée estimée, le nombre de places, mon rôle (conducteur ou passager, par défaut conducteur), et un prix du trajet,
    - *Alors* le système enregistre mon trajet et le rend visible dans les résultats de recherche.

- **CA (Scénario de création standard échouée) :**
    - *Étant donné* que je suis sur le formulaire de création de trajet,
    - *Quand* j'oublie de saisir l'un des champs obligatoires (adresse de départ, adresse d'arrivée, date et heure de départ, date et heure d'arrivée estimée, nombre de places, prix du trajet),
    - *Alors* le système m'affiche une erreur et m'empêche de publier.

### US 3.2 : Ajout de filtres de genre (Trajet réservé aux femmes)
**En tant que** utilisatrice,
**Je veux** activer l'option "Trajet réservé aux femmes" lors de la création du trajet,
**Afin de** m'assurer que seules les femmes puissent rejoindre ce trajet.

- **CA (Scénario de création filtrée) :**
    - *Étant donné* que je suis sur le formulaire de création de trajet,
    - *Quand* je coche la case "Réservé aux femmes" et que je publie le trajet,
    - *Alors* le trajet est créé et porte un badge visible "Réservé aux femmes".
    - *Et* lors de la recherche, ce trajet est invisible pour les utilisateurs masculins (et ils reçoivent une erreur qui les empêche de rejoindre le trajet s'ils tentent de le faire de manière frauduleuse).

### US 3.3 : Annulation et modification d'un trajet
**En tant que** utilisateur et créateur d'un trajet,
**Je veux** annuler ou modifier un trajet déjà publié,
**Afin de** gérer les imprévus.

- **CA (Scénario d'annulation) :**
    - *Étant donné* que j'ai un trajet publié à venir,
    - *Quand* je clique sur "Annuler le trajet",
    - *Alors* le trajet est supprimé des résultats de recherche.
    - *Et* une notification est envoyée aux passagers ayant déjà réservé une place.

### US 3.4 : Recherche et Rejoindre un trajet
**En tant que** utilisateur en recherche d'un trajet,
**Je veux** filtrer et trouver des trajets existants (Départ, Arrivée, Date, Heure), consulter les détails, et réserver une place,
**Afin de** participer à un trajet.

- **CA (Scénario de recherche et Rejoindre) :**
    - *Étant donné* que je suis sur la page de recherche,
    - *Quand* je saisis une ville de départ, une ville d'arrivée, une heure de départ, une date de départ (par défaut celle du jour), et que je clique sur "Rechercher",
    - *Alors* la liste des trajets correspondants s'affiche avec les informations (adresse de départ/arrivée, prix estimé par passager quand le trajet est complet, places restantes).
    - *Quand* je clique sur un trajet avec des places disponibles,
    - *Alors* je suis renvoyé vers la page des détails du trajet.
    - *Et* je vois les détails du trajet (conducteur, passagers, adresse de départ et d'arrivée, date et heure de départ et d'arrivée, prix total, prix actuel par passager, prix si complet).
    - *Quand* je clique sur "Rejoindre",
    - *Alors* je suis enregistré dans le trajet et affiché comme covoitureur.

### US 3.5 : Rejoindre un trajet "Femmes seulement"
**En tant que** utilisatrice,
**Je veux** filtrer mes recherches pour ne voir que les trajets réservés aux femmes,
**Afin de** rejoindre un trajet sécurisé sans être dérangée par des hommes.

- **CA (Scénario de recherche filtrée) :**
    - *Étant donné* que je suis sur la page de recherche de trajets,
    - *Quand* je coche la case "Femmes seulement",
    - *Alors* seuls les trajets marqués "Réservé aux femmes" et ayant des places disponibles s'affichent dans mes résultats.
    - *Et* je peux rejoindre ces trajets normalement.

### US 3.6 : Gestion des Covoitureurs (Exclusion)
**En tant que** utilisateur ayant créé un trajet,
**Je veux** pouvoir exclure les autres utilisateurs de mon trajet,
**Afin de** ne pas avoir à supporter les participants nocifs de mon trajet.

- **CA (Scénario d'exclusion) :**
    - *Étant donné* qu'un utilisateur a rejoint mon trajet,
    - *Quand* je clique sur "Exclure" à côté de son nom depuis mon tableau de bord,
    - *Alors* l'utilisateur est retiré du trajet et reçoit une notification.
    - *Et* le nombre de places disponibles sur mon trajet est augmenté de 1.

### US 3.7 : Messagerie interne
**En tant qu'** utilisateur ayant créé ou rejoint un trajet,
**Je veux** contacter un conducteur ou un passager via une messagerie interne,
**Afin de** m'organiser pour le trajet (point de rendez-vous, retards, etc.).

- **CA (Scénario d'envoi de message) :**
    - *Étant donné* que je fais partie d'un trajet (en tant que créateur ou participant),
    - *Quand* je vais sur la page des détails du trajet et que je clique sur "Envoyer un message" à côté d'un covoitureur,
    - *Alors* une fenêtre de chat s'ouvre.
    - *Et* je peux saisir un texte et l'envoyer.
    - *Et* le destinataire reçoit une notification (dans l'app ou par mail) indiquant qu'il a un nouveau message.

- **CA (Scénario de lecture et réponse) :**
    - *Étant donné* que j'ai reçu une notification de message,
    - *Quand* j'ouvre ma messagerie,
    - *Alors* je vois la liste de mes conversations triées par date (la plus récente en haut).
    - *Quand* je clique sur une conversation,
    - *Alors* je vois l'historique des échanges et je peux répondre.

---

# PRIORITÉ SHOULD HAVE

## Epic 4 Should Have : Modération, Réputation, Signalement, Liste noire et Contact

### US 4.1 : Mettre un autre utilisateur en liste noire
**En tant que** utilisateur,
**Je veux** bloquer un autre utilisateur,
**Afin de** ne plus jamais avoir à interagir avec cette personne.

- **CA (Scénario de blocage) :**
    - *Étant donné* que je consulte la liste des participants d'un trajet ou l'historique de mes trajets,
    - *Quand* je clique sur "Bloquer" à côté d'un utilisateur,
    - *Alors* cet utilisateur est ajouté à ma liste noire.
    - *Et* si l'utilisateur bloqué se trouvait dans un de mes trajets à venir, je quitte immédiatement ce trajet (je reçois un message de confirmation avant dans ce cas).
    - *Et* je ne vois plus les trajets dans lesquels se trouvent les utilisateurs de ma liste noire (et inversement).
    - *Et* il ne peut plus m'envoyer de messages privés.

### US 4.2 : Noter un autre utilisateur (Réputation)
**En tant que** utilisateur,
**Je veux** noter un autre participant après un trajet,
**Afin de** faire connaître son comportement à la communauté.

- **CA (Scénario de notation) :**
    - *Étant donné* qu'un trajet auquel j'ai participé est terminé,
    - *Quand* je clique sur le nombre d'étoiles à côté de l'utilisateur que je souhaite noter,
    - *Alors* ma note (de 1 à 5 étoiles) est enregistrée.
    - *Et* le nombre d'étoiles affiché sur le profil de l'utilisateur est la moyenne pondérée de toutes les étoiles reçues.

### US 4.3 : Signaler un utilisateur (Modération)
**En tant que** utilisateur,
**Je veux** signaler le comportement d'un utilisateur,
**Afin de** le faire remonter aux modérateurs.

- **CA (Scénario de signalement) :**
    - *Étant donné* que je consulte la liste des participants d'un trajet ou l'historique,
    - *Quand* je clique sur "Signaler" à côté d'un utilisateur,
    - *Alors* le signalement est envoyé et s'ajoute à la liste des tickets du modérateur.

### US 4.4 : Gestion des signalements (Modérateur)
**En tant que** modérateur,
**Je veux** consulter et gérer la liste des signalements reçus,
**Afin de** prendre des décisions de modération.

- **CA (Scénario de consultation) :**
    - *Étant donné* que je suis connecté en tant que modérateur,
    - *Quand* j'ouvre mon Dashboard et que je clique sur "Signalements",
    - *Alors* j'aperçois la liste des signalements en attente et je peux cliquer dessus pour avoir les détails (raison, utilisateur concerné, preuves).

### US 4.5 : Bannir un utilisateur (Modérateur)
**En tant que** modérateur,
**Je veux** bannir un utilisateur à partir d'un signalement validé,
**Afin qu'** il n'accède plus au site.

- **CA (Scénario de bannissement) :**
    - *Étant donné* que je consulte le détail d'un signalement valide,
    - *Quand* je clique sur "Bannir l'utilisateur" et que je rédige les raisons du bannissement,
    - *Alors* l'utilisateur banni est supprimé de la base de données.
    - *Et* son adresse IP et son email sont conservés pendant au moins 6 mois pour interdire toute réinscription.

### US 4.6 : Contact par téléphone (Optionnel)
**En tant qu'** utilisateur participant à un trajet,
**Je veux** pouvoir appeler un autre participant via l'application,
**Afin de** gérer une urgence ou un changement de dernière minute plus rapidement que par message.

- **CA (Scénario d'appel autorisé) :**
    - *Étant donné* que l'autre participant a **activé** l'option "Autoriser les appels téléphoniques" dans ses préférences de confidentialité,
    - *Quand* je clique sur l'icône téléphone sur sa fiche dans les détails du trajet,
    - *Alors* mon téléphone ouvre l'application d'appel classique avec son numéro pré-enregistré.

- **CA (Scénario d'appel non autorisé / bloqué) :**
    - *Étant donné* que l'autre participant a **désactivé** l'option "Autoriser les appels téléphoniques" (ou qu'il est dans ma liste noire),
    - *Quand* je clique sur l'icône téléphone sur sa fiche,
    - *Alors* l'icône est grisée ou n'est pas cliquable.
    - *Et* un message m'indique : "Cet utilisateur n'autorise pas les appels. Utilisez la messagerie interne."


## Epic 5 Should Have : Partage des frais et Optimisation de la création

### US 5.1 : Détection et suggestion de trajets existants (Anti-doublon)
**En tant qu'** utilisateur en train de créer un trajet,
**Je veux** que le système détecte si mon trajet correspond (Départ, Arrivée, Date, Heure) à un trajet déjà existant,
**Afin de** me proposer de le rejoindre au lieu d'en créer un nouveau.

- **CA (Scénario de détection et suggestion) :**
    - *Étant donné* que je suis sur le formulaire de création de trajet,
    - *Quand* je saisis une adresse de départ, une adresse d'arrivée, une date et une heure,
    - *Alors* le système vérifie silencieusement s'il existe des trajets similaires (même itinéraire, même jour, dans une plage horaire proche).
    - *Si* un trajet correspond est trouvé avec des places disponibles,
    - *Alors* une fenêtre pop-up ou une bannière m'apparaît : "Un trajet similaire existe ! Souhaitez-vous le rejoindre ? [Voir le trajet] [Continuer la création]".
    - *Quand* je clique sur "Voir le trajet",
    - *Alors* je suis redirigé vers la page de détails du trajet existant.
    - *Quand* je clique sur "Continuer la création",
    - *Alors* ma création de trajet se poursuit normalement.

### US 5.2 : Calcul automatique du prix du trajet (API)
**En tant qu'** utilisateur créant un trajet,
**Je veux** que le système calcule automatiquement un prix de trajet suggéré,
**Afin que** je n'aie pas à estimer moi-même le coût.

- **CA (Scénario de calcul automatique) :**
    - *Étant donné* que je suis sur le formulaire de création de trajet et que j'ai renseigné mes adresses de départ et d'arrivée,
    - *Quand* je clique sur "Estimer le prix" ou que le système le fait automatiquement,
    - *Alors* le système utilise une API de géolocalisation pour calculer la distance (en km) entre les deux points.
    - *Et* le système utilise la consommation moyenne (L/100 km) enregistrée sur mon véhicule pour calculer le coût du carburant.
    - *Et* le système applique un prix de carburant moyen (actualisé).
    - *Et* le système ajoute une estimation des péages si applicable.
    - *Alors* un montant total suggéré s'affiche dans le champ "Prix du trajet".

### US 5.3 : Calcul automatique de la part par passager (Partage équitable)
**En tant qu'** utilisateur créant un trajet,
**Je veux** que le prix total soit automatiquement divisé par le nombre total de places (conducteur inclus),
**Afin de** proposer un tarif juste et transparent à chaque participant.

- **CA (Scénario de partage équitable) :**
    - *Étant donné* que j'ai défini mon prix total de trajet (ex: 100€) et mon nombre de places (ex: 4 places),
    - *Alors* le système calcule automatiquement : 100€ / 4 places = **25€ par passager**.
    - *Et* le système affiche clairement sur la page de détails du trajet : "Prix total du trajet : 100€ (25€ par passager, conducteur inclus)".
    - *Si* je modifie le nombre de places total,
    - *Alors* le prix par passager est recalculé dynamiquement.

---

# PRIORITÉ COULD HAVE 

## Epic 6 Could Have : Filtre de préférence (recherche de trajet)

### US 6.1 : Rejoindre un trajet selon mes préférences
**En tant que** utilisateur,
**Je veux** filtrer mes recherches pour ne voir que les trajets qui correspondent à mes préférences (non fumeur, pas d'animaux, pas de musique, pas de discussion - par défaut celles de mon profil),
**Afin de** rejoindre un trajet qui respecte mes préférences.

- **CA (Scénario de recherche filtrée) :**
    - *Étant donné* que je suis sur la page de recherche de trajets,
    - *Quand* je coche les cases "Non-fumeur" et "Pas d'animaux",
    - *Alors* seuls les trajets ayant ces critères s'affichent dans mes résultats.

---

## Epic 7 Could Have : Organisation avancée des trajets (Rôles Conducteur / Passager)

### US 7.1 : Créer un trajet en tant que Passager (Chercheur de conducteur)
**En tant que** utilisateur sans véhicule,
**Je veux** créer un trajet en me définissant comme "Passager",
**Afin que** des conducteurs puissent me proposer de me prendre.

- **CA (Scénario de création passager) :**
    - *Étant donné* que je suis sur le formulaire de création de trajet,
    - *Quand* je sélectionne "Passager" dans mon rôle assigné et que je valide la création,
    - *Alors* le trajet est enregistré comme une "Demande de covoiturage".
    - *Et* il apparaît dans une catégorie dédiée pour les conducteurs cherchant des passagers.

### US 7.2 : Rejoindre un trajet en tant que Conducteur 
**En tant que** conducteur,
**Je veux** consulter la liste des trajets "Cherche un conducteur" et en rejoindre un,
**Afin de** proposer mes services pour un itinéraire.

- **CA (Scénario de prise en charge) :**
    - *Étant donné* qu'un utilisateur a créé un trajet en tant que "Passager",
    - *Quand* je coche la case "Cherche un(e) conducteur.ice" dans mes filtres de recherche,
    - *Alors* je vois les trajets sans conducteur.
    - *Quand* je rejoins un de ces trajets et que je clique "Devenir conducteur",
    - *Alors* je suis assigné comme conducteur sur ce trajet.

### US 7.3 : Changement de rôle en cours de trajet
**En tant que** utilisateur ayant rejoint un trajet sans conducteur,
**Je veux** pouvoir changer mon rôle de "Passager" à "Conducteur",
**Afin de** sauver un trajet qui allait être annulé.

- **CA (Scénario de prise de rôle) :**
    - *Étant donné* que je suis inscrit dans un trajet où il n'y a actuellement aucun conducteur,
    - *Quand* je clique sur "Devenir conducteur.ice",
    - *Alors* mon rôle est modifié, et le trajet devient actif pour les autres passagers.

---

# PRIORITÉ WON'T HAVE (Évolutions futures)

## Epic 8 Won't Have : Escales (Arrêts intermédiaires)

### US 8.1 : Ajouter des escales à un trajet
**En tant que** voyageur,
**Je veux** ajouter des escales entre mon départ et mon arrivée,
**Afin de** me reposer, ou de déposer/prendre d'autres voyageurs en cours de route.

## Epic 9 Won't Have : Optimisation de trajet à la création (Suggestion pro-active)

### US 9.1 : Proposition automatique de rejoindre un trajet existant à la création
**En tant qu'** utilisateur créant un trajet,
**Je veux** que le système m'alerte proactivement si des trajets existants correspondent exactement à mon itinéraire,
**Afin de** réduire la fragmentation des trajets et optimiser le remplissage des voitures.

- **CA (Scénario de suggestion proactive) :**
    - *Étant donné* que je suis en train de remplir le formulaire de création de trajet,
    - *Quand* je saisis ma ville de départ et d'arrivée,
    - *Alors* le système interroge sa base de données en temps réel.
    - *Si* un trajet identique existe dans une fenêtre de + ou - 30 minutes,
    - *Alors* le système bloque la création et affiche une notification forte : "Un trajet partageant exactement votre itinéraire existe. Ne créez pas de doublon ! Rejoignez-le plutôt." avec un bouton "Voir le trajet".
    - *Quand* je clique sur "Voir le trajet",
    - *Alors* je suis redirigé vers la page de détails du trajet.

## Epic 10 Won't Have : Location de véhicules (B2C/B2B)

### US 10.1 : Emprunter un véhicule
**En tant que** voyageur,
**Je veux** emprunter un véhicule mis à disposition sur la plateforme,
**Afin de** pouvoir faire un trajet alors que je n'ai pas de véhicule personnel.

### US 10.2 : Prêter un véhicule (Entité morale)
**En tant qu'** entité morale (Mairie, Entreprise),
**Je veux** prêter un ou plusieurs véhicules de ma flotte aux utilisateurs,
**Afin de** rentabiliser mon parc automobile.

## Epic 11 Won't Have : Groupes de covoiturage

### US 11.1 : Créer et gérer un groupe
**En tant que** voyageur,
**Je veux** créer un groupe de covoiturage fermé (ex: pour des collègues de travail),
**Afin de** proposer des trajets uniquement aux membres de ce groupe.

## Epic 12 Won't Have : Dashboard Institutionnel (Mairies / Entreprises)

### US 12.1 : Gestion de la flotte B2B
**En tant que** gestionnaire de flotte,
**Je veux** ajouter, consulter, modifier ou supprimer des véhicules de ma flotte,
**Afin de** tenir à jour le parc de véhicules disponibles pour la location.

### US 12.2 : Analytique et optimisation des trajets
**En tant que** gestionnaire de flotte,
**Je veux** visualiser les données de trajets des utilisateurs sur un tableau de bord,
**Afin d'** optimiser l'emplacement de mes points de dépôt/récupération.

### US 12.3 : Gestion des points de location
**En tant que** gestionnaire de flotte,
**Je veux** définir les adresses de récupération et de dépôt des véhicules,
**Afin de** contrôler où les utilisateurs peuvent emprunter et rapporter les véhicules.