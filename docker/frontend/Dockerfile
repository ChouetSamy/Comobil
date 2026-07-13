# Image officielle Node.js LTS
# Utilisée pour exécuter Vite en développement.
FROM node:22

# Définit le dossier de travail dans le conteneur.
WORKDIR /app

# Copie uniquement les fichiers de dépendances.
# Cette étape permet de profiter du cache Docker.
COPY package*.json ./

# Installe les dépendances du projet.
RUN npm install

# Le reste du code sera monté par un volume Docker Compose.
# Aucune copie supplémentaire n'est nécessaire en développement.

# Vite écoute par défaut sur le port 5173.
EXPOSE 5173

# Lance le serveur de développement Vite.
CMD ["npm", "run", "dev", "--", "--host"]