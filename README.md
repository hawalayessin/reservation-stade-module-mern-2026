🏟️ Stadium Reservation System (MERN Stack)
📌 Description du projet

Ce projet est une application web de réservation de stades sportifs développée en MERN Stack (MongoDB, Express, React, Node.js).
Elle permet aux utilisateurs de consulter les stades, réserver des créneaux horaires disponibles, laisser des avis, et bénéficier d’une analyse intelligente des avis via IA (Gemini).

Une interface Admin est également disponible pour gérer les stades et les créneaux (availability).

Ce projet a été réalisé en respectant les TP du module MERN / Web avancé.

🎯 Objectifs pédagogiques (alignés avec les TP)

Architecture Client / Serveur

API REST sécurisée avec JWT

Gestion de l’authentification et des rôles

Manipulation des hooks React

Utilisation de useReducer et useContext

CRUD complet (Stadium, Availability, Reservation, Review)

Intégration d’une API d’IA (Gemini)

Bonnes pratiques frontend / backend

🧱 Architecture générale
Frontend (React + Vite)
│
│── Pages (Login, Register, Stadiums, StadiumDetails, Reservations, AdminDashboard)
│── Components (Navbar, ProtectedRoute, AdminRoute)
│── Context (AuthContext, authReducer)
│── API (Axios instance)
│
Backend (Node.js + Express)
│
│── Routes (auth, stadiums, availabilities, reservations, reviews, ai)
│── Controllers
│── Models (User, Stadium, Availability, Reservation, Review)
│── Middleware (authMiddleware)
│── MongoDB
│
IA
│── Google Gemini API (analyse des avis)

🔐 Authentification & Sécurité

Authentification via JWT

Middleware protect pour sécuriser les routes

Rôles utilisateurs :

User : réservation, avis

Admin : gestion stades & créneaux

Routes protégées côté frontend (ProtectedRoute, AdminRoute)

Gestion globale de l’auth via useReducer + Context

🧑‍💻 Fonctionnalités
👤 Utilisateur

Inscription / Connexion

Consultation des stades

Réservation d’un créneau disponible

Annulation de réservation

Ajout / modification / suppression d’avis

Analyse intelligente des avis via IA

🛠️ Administrateur

Création / modification / suppression de stades

Gestion des créneaux (Availability)

Visualisation du statut :

🟢 Disponible

🔴 Réservé

Gestion complète même des créneaux déjà réservés

🤖 Intelligence Artificielle (Gemini)

Analyse automatique des avis d’un stade

Résumé clair et structuré :

Tendance générale

Note moyenne

Points positifs / négatifs

Intégration via une API backend dédiée (/api/ai/analyze-reviews/:stadiumId)

⚙️ Technologies utilisées
Frontend

React (Vite)

React Router DOM

Axios

React Toastify

CSS pur (sans framework)

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT

Bcrypt.js

IA

Google Generative AI (Gemini)

📂 Structure du projet
backend/
│── controllers/
│── models/
│── routes/
│── middleware/
│── config/
│── server.js

frontend/
│── src/
│   │── pages/
│   │── components/
│   │── context/
│   │── api/
│   │── App.jsx
│   │── main.jsx

🔁 Hooks React utilisés

useState

useEffect

useContext

useReducer

useNavigate

useParams

useLocation

🌐 Utilisation d’Axios

Instance Axios centralisée

Intercepteur pour ajouter automatiquement le token JWT

Appels API clairs et sécurisés

🚀 Lancement du projet
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

🧪 Tests

Tests API via Postman

Création d’admin via /auth/register

Tests CRUD sur Stadium / Availability / Reservation / Review



✅ Architecture MERN
✅ Authentification JWT
✅ CRUD complet
✅ Hooks React
✅ useReducer / Context
✅ Séparation Front / Back
✅ Bonus IA (au-delà du TP)

