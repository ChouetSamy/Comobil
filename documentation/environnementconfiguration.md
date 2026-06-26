--------------installation de symfony----------------

étape 1: installation de symfony dans le projet, on prend la version la plus récente pour facilité les mise à jour plus tard

composer create-project symfony/skeleton:"8.1.*" backend

étape 2: 
couper coller le dossier public à la racine, le dossier public est le point d'entrée des applications symfony, c'est pourquoi il dois se trouver à la racine
vous pouvez aussi utilisez la commande suivante:

mv backend/public .

étape 3: s'assurer que symfony pointe bien vers le dossier public à la racine pour qu'ils puissent communiquer
dans le dossier backend/composer.json, chercher la section extra, modifé la ligne public-dir pour qu'elle pointe vers ../public

la ligne dois ressembler à ça :

"extra": {
    "symfony": {
        "allow-contracts": "with",
        "require": "8.1.*",
        "public-dir": "../public"
    }
},

étape 4: pour garantir l'intégrité des log et des cache symfony, on force symfony à bien les créer dans le dossier backend (si jamais le projet est déplacé)
SYMFONY_VAR_DIR=../backend/var

étape 5: pour lancer le server (assurez)

symfony server:start

ou

php -S localhost:8000 -t ../public

--------------installer react------------

étape 1: on utilise le framework vite, car ce dernier se charge de configurer très rapidement react pour nous

npm create vite@latest frontend 

étape 2: on choisit react comme template (le framework vous propose une liste)

étape 3: choisissez un language entre javascript et typescrypt (typescrypt recommandé)
dans cette app j'ai choisi typescrypt

étape 4: choisissez un linter (un compilateur qui relis votre code pour vérifier la syntaxe) en ESlint et 0xlint (0xlint est plus moderne, mais moins documenté)
j'ai choisi 0xlint

étape 5: choisissez oui pour l'installtion de npm pour pouvoir vous en servir dans le terminal du dossier contenant le frontend

étape 6: lancez vite (assurez vous de bien être dans /Comobil)

cd frontend #se déplacer dans le dossier frontend depuis le terminal dans le dossier comobil
npm run dev #lancer le server vite

ou plus simplement

cd frontend && npm run dev

-------------------tailwind----------------

doc utile
https://tailwindcss.com/docs/installation/using-vite

étape 1: installez tailwind et ses dépendances dans vite, postcss compile le css, autoprefixer

cd frontend
npm install tailwindcss @tailwindcss/vite

étape 2: configuration de vite, dans le fichier vite.config.ts votre fonction define config doit ressembler à ça

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(
{
  plugins: [
    tailwindcss(),
  ],
})

étape 3: importez tailwind dans vos fichier css

@import "tailwindcss";