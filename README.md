# API Super-Héros
Ce projet est une API Node.js qui permet de manipuler une collection de super-héros. Il a été réalisé en deux versions :  
- une version simple basée sur un **fichier JSON**,  
- une version complète avec **base de données SQLite** et **routes RESTful**.

---

## Technologies utilisées

- Node.js  
- Express  
- better-sqlite3  
- csv-stringify  
- curl (pour les tests)

---

## Structure du projet

api_superheros/
├── database.js           # Définition et connexion SQLite
├── import.js             # Import initial JSON → SQLite
├── index.js              # Fichier principal contenant les routes
├── SuperHerosComplet.json# Données brutes au format JSON
├── superheros.db         # Base de données générée automatiquement
├── package.json          # Dépendances du projet
├── package-lock.json
└── README.md             # Présentation du projet

---

# Installation

bash
npm install
node import.js      # remplit la base avec les données JSON
node index.js       # démarre le serveur sur localhost:3000
---

 Routes principales

| Méthode | URL                             | Description              |
| ------- | ------------------------------- | ------------------------ |
| GET     | /heroes                         | Récupère tous les héros  |
| GET     | /heroes/\:id                    | Héros par ID             |
| GET     | /heroes/search?q=nom            | Recherche par nom        |
| GET     | /heroes?publisher=DC            | Filtrage par éditeur     |
| GET     | /heroes/sorted?by=height\_cm    | Tri dynamique            |
| POST    | /heroes                         | Ajout d’un nouveau héros |
| DELETE  | /heroes/\:id                    | Suppression par ID       |
| GET     | /heroes/export?publisher=Marvel | Export CSV               |
| GET     | /heroes/stats                   | Statistiques par éditeur |
---

Auteur

Bouklouze Achraf – 3A ICY – INSA Hauts-de-France
Projet réalisé dans le cadre du TP Technologies Web
