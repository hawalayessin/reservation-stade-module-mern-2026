# Démonstration recruteur — réservation de terrains

Projet académique MERN : React/Vite, Express, MongoDB et authentification JWT.
Les terrains, tarifs, comptes et avis de ce scénario sont entièrement fictifs.

## Démarrer en local

Prérequis : Node.js 22+ et MongoDB lancé sur votre ordinateur. Depuis la racine :

```sh
cd backend
npm ci
npm run demo:seed
npm run demo
```

Dans un deuxième terminal, depuis la racine :

```sh
cd frontend
npm ci
npm run dev -- --host localhost --port 5173 --strictPort
```

Ouvrir http://localhost:5173. Les identifiants sont dans `.demo/credentials.json`
à la racine : compte visiteur, compte administrateur et mot de passe aléatoire.
Ce fichier est local et ignoré par Git. Ne pas publier ce fichier.

Le lancement démo impose une base locale `stadium_recruiter_demo`, un secret JWT
éphémère et désactive les appels Gemini. Le `.env` habituel n'est pas modifié.
Se reconnecter après chaque redémarrage du serveur (le secret JWT change).
Les ports 5000 et 5173 doivent être disponibles.

Le remplissage exige une base sans collections et refuse de supprimer des données.
Il produit trois terrains, trois avis et 63 créneaux pour les sept jours suivants.
Pour une nouvelle session après expiration des dates, choisir une nouvelle base
locale terminant par `_demo` avec `DEMO_MONGODB_URI` et archiver le fichier local
`.demo/credentials.json` avant de relancer le remplissage. Aucune réinitialisation
automatique de base n'est effectuée. En cas de remplissage interrompu, utiliser
également une nouvelle base vide.

PowerShell, exemple de nouvelle base :

```powershell
$env:DEMO_MONGODB_URI = 'mongodb://127.0.0.1:27017/stadium_session2_demo'
npm run demo:seed
```

## Visite de trois minutes

Vérification technique facultative, serveur démo lancé : depuis `backend/`,
exécuter `npm run demo:check`. Le script teste les parcours sur MongoDB réel et
retire les réservations et avis qu'il a lui-même créés.

1. **Contexte (20 s)** : « Cette application permet de consulter des terrains,
   réserver un créneau et gérer ses réservations. Deux rôles séparent les usages
   visiteur et administrateur. »
2. **Visiteur (60 s)** : se connecter avec le compte visiteur, ouvrir le terrain
   de Monastir, choisir un créneau futur, réserver, puis ouvrir Mes réservations.
   Annuler la réservation et vérifier que le créneau redevient disponible.
3. **Avis (30 s)** : afficher l'avis fictif, puis ajouter ou modifier son avis.
   L'analyse IA est optionnelle et désactivée pour cette session sans clé API.
4. **Administration (40 s)** : se déconnecter, utiliser le compte administrateur,
   ouvrir Administration et créer un créneau. Revenir au visiteur pour le voir.
5. **Discussion technique (30 s)** : expliquer le contrôle du rôle côté API,
   le contrôle du propriétaire et la prise atomique d'un créneau MongoDB.

## Points à expliquer honnêtement

- Les tests HTTP isolés et la compilation frontend sont automatisés.
- La prise du créneau et l'insertion de réservation sont deux écritures : une
  transaction MongoDB ou une réconciliation reste nécessaire en cas de crash.
- Cette configuration est une démonstration locale. Un hébergement public,
  HTTPS, la limitation des requêtes et la supervision restent à préparer.
- Présenter précisément sa contribution personnelle et distinguer les corrections
  récentes réalisées avec assistance IA. Ne pas annoncer de vrais clients,
  paiements ou résultats de performance non mesurés.

## Captures utiles pour une candidature

Capturer le catalogue, les créneaux, une réservation confirmée et l'administration.
Utiliser exclusivement les comptes fictifs ; masquer les jetons et mots de passe.
Ajouter une URL de démo publique au CV uniquement après déploiement et vérification.
