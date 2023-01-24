# Utiliser l'image de base Node.js
FROM node:14-alpine

# Définir un répertoire de travail pour l'application
WORKDIR /usr/src/app

# Copier les fichiers de l'application
COPY . .

# Installer les dépendances de l'application
RUN npm install

# Installer les paquet cors, mysql2, express et angular
RUN npm install cors mysql2 express

# Exposer le port 3000 pour l'application
EXPOSE 3000

# Définir le point d'entrée de l'application
CMD ["npm", "start"]

