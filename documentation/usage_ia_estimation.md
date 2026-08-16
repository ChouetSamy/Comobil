# Comobil — Estimation de l'utilisation de l'IA

## Avertissement

Les valeurs de ce document sont des estimations.

ChatGPT ne fournit pas ici un relevé exhaustif du nombre exact
de tokens consommés pendant toute la réalisation de Comobil.

Les chiffres ne doivent donc pas être présentés comme une facture
ou une mesure comptable exacte.

Ils servent à donner un ordre de grandeur de l'utilisation de l'IA
pendant le projet.

---

# 1. Usage de l'IA

L'IA a été utilisée comme assistant de développement pour notamment :

- réflexion sur l'architecture ;
- Docker ;
- Symfony ;
- API Platform ;
- Doctrine ;
- sécurité ;
- JWT ;
- repositories ;
- providers ;
- processors ;
- voters ;
- React ;
- TypeScript ;
- Tailwind ;
- création de composants ;
- analyse d'erreurs ;
- tests d'intégration ;
- génération des fixtures ;
- documentation.

L'IA n'a pas exécuté seule le projet.

Le développement a nécessité de nombreux cycles :

proposition
    ↓
implémentation
    ↓
exécution réelle
    ↓
erreur
    ↓
analyse
    ↓
correction
    ↓
nouveau test

Une partie importante du travail a donc consisté à confronter
le code proposé à l'environnement réel.

---

# 2. Modèles

Plusieurs conversations ont pu utiliser différentes configurations
de ChatGPT au cours du développement.

La phase finale documentée ici utilise notamment GPT-5.6 Sol.

Pour donner un ordre de grandeur financier comparable,
l'estimation ci-dessous utilise le tarif API GPT-5.6 Sol.

---

# 3. Nombre de tokens estimé

Il n'existe pas dans cette conversation de compteur permettant
de reconstruire exactement la totalité des tokens utilisés
depuis le début du projet.

Compte tenu :

- de la longueur des conversations ;
- du nombre important d'itérations ;
- des nombreux fichiers PHP/TypeScript envoyés ;
- des réponses comprenant parfois des fichiers complets ;
- des phases de debug ;
- du contexte Comobil accumulé ;

un ordre de grandeur raisonnable pour le contenu utile échangé
pendant le développement de Comobil est :

Environ 1 à 3 millions de tokens de contenu échangé.

Cette valeur représente une estimation du texte effectivement
échangé et non le nombre de tokens qui auraient nécessairement
été facturés par une API.

---

# 4. Pourquoi le coût API peut être très différent

Dans une conversation longue, une API peut devoir recevoir
une partie importante du contexte précédent à chaque nouvel appel.

Le nombre de tokens d'entrée facturables peut donc être
nettement supérieur au simple volume du texte visible produit
une seule fois.

Inversement, le prompt caching peut fortement réduire
le prix des portions de contexte déjà connues.

Il n'est donc pas possible de transformer honnêtement
"1 à 3 millions de tokens de conversation"
en une facture exacte sans disposer des métriques de chaque appel.

---

# 5. Prix théorique GPT-5.6 Sol

Tarifs API utilisés pour cette estimation :

- entrée non cachée : 5 $ / million de tokens ;
- entrée cachée : 0,50 $ / million de tokens ;
- sortie : 30 $ / million de tokens.

Ces tarifs servent uniquement de référence théorique.

L'utilisation de ChatGPT dans le cadre d'un abonnement
n'est pas facturée à l'utilisateur message par message
selon cette formule.

---

# 6. Estimation financière

Pour donner un ordre de grandeur, supposons par exemple
un total de contenu de 2 millions de tokens répartis ainsi :

- 1,2 million en entrée ;
- 0,8 million en sortie.

Sans cache :

Entrée :
1,2 × 5 $ = 6 $

Sortie :
0,8 × 30 $ = 24 $

Total théorique :
environ 30 $

Avec davantage de sorties longues ou de contexte retransmis,
le coût équivalent API pourrait être sensiblement supérieur.

Une fourchette prudente pour représenter le travail effectué serait :

environ 20 à 100 $ d'équivalent API,

avec une forte incertitude.

Cette fourchette ne correspond pas au coût réel payé via ChatGPT.

---

# 7. Temps de réalisation

Le travail sur Comobil s'est étalé approximativement
de fin juin à mi-août 2026 pour sa phase de réalisation principale.

Temps calendaire :

environ 7 semaines.

Le projet n'a évidemment pas été développé à temps plein
pendant chaque heure de cette période.

En tenant compte :

- de la conception ;
- du backend ;
- du frontend ;
- de Docker ;
- du debug ;
- des tests ;
- des changements d'architecture ;
- des reprises ;
- de la documentation ;

un ordre de grandeur raisonnable pour le travail actif
consacré au MVP est :

environ 80 à 150 heures.

Cette estimation inclut le temps humain de développement
et les itérations avec l'assistant IA.

---

# 8. Interprétation

L'IA a principalement joué le rôle :

- d'assistant de programmation ;
- de générateur de premières implémentations ;
- d'aide au diagnostic ;
- de relecteur ;
- d'aide à la documentation.

Elle a permis d'accélérer certaines tâches répétitives,
mais elle a également produit du code nécessitant parfois :

- des corrections ;
- des tests ;
- du refactoring ;
- une adaptation au modèle métier réel.

Le projet illustre donc aussi une limite importante
du développement assisté par IA :

générer rapidement du code n'élimine pas la nécessité
de comprendre, tester et valider ce code.

---

# 9. Résumé

Durée calendaire du développement principal :
≈ 7 semaines

Temps actif estimé :
≈ 80 à 150 heures

Tokens de contenu échangé estimés :
≈ 1 à 3 millions

Équivalent API très approximatif avec GPT-5.6 Sol :
≈ 20 à 100 $

Ces chiffres sont des ordres de grandeur,
pas des mesures exactes.