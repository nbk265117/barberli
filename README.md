# BarberLi - Plateforme de réservation de barbershops au Maroc

BarberLi est une application web moderne permettant aux utilisateurs de découvrir, rechercher et réserver des rendez-vous dans les meilleurs barbershops du Maroc.

## 🚀 Fonctionnalités

- **Recherche intelligente** : Trouvez des barbershops par ville, service ou proximité
- **Réservation en ligne** : Système de réservation en temps réel avec créneaux disponibles
- **Authentification Google** : Connexion sécurisée avec Google OAuth
- **Cartes interactives** : Intégration Google Maps avec autocomplétion d'adresses
- **Notifications email** : Confirmations et rappels automatiques
- **Système d'avis** : Notes et commentaires des clients
- **SEO optimisé** : Optimisé pour le référencement local au Maroc
- **Interface responsive** : Design moderne et adaptatif

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 15 (App Router), React 19, TypeScript
- **Styling** : Tailwind CSS
- **Backend** : tRPC, Prisma ORM
- **Base de données** : PostgreSQL (Neon)
- **Authentification** : NextAuth.js avec Google OAuth
- **Cartes** : Google Maps API
- **Email** : Resend
- **Déploiement** : Vercel

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Google Cloud Platform (pour Google Maps API)
- Compte Google OAuth (pour l'authentification)
- Base de données PostgreSQL (Neon recommandé)
- Compte Resend (pour les emails)

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd barberli
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   
   Créez un fichier `.env` basé sur `.env.example` :
   ```bash
   cp .env.example .env
   ```

   Remplissez les variables suivantes :
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/barberli"

   # NextAuth
   AUTH_SECRET="your-auth-secret-here"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"

   # Google Maps
   GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

   # Email (Resend)
   RESEND_API_KEY="your-resend-api-key"

   # Stripe (Optional)
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   ```

4. **Configuration de la base de données**
   ```bash
   # Générer le client Prisma
   npm run db:push
   
   # Ajouter des données de test
   npm run db:seed
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration des services externes

### Google Maps API
1. Créez un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activez les APIs suivantes :
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Créez une clé API et configurez les restrictions

### Google OAuth
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez des identifiants OAuth 2.0
3. Ajoutez les domaines autorisés

### Resend (Email)
1. Créez un compte sur [Resend](https://resend.com/)
2. Vérifiez votre domaine
3. Obtenez votre clé API

## 📦 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Lance l'application en production
- `npm run db:push` - Synchronise le schéma Prisma avec la base de données
- `npm run db:seed` - Ajoute des données de test
- `npm run db:studio` - Ouvre Prisma Studio
- `npm run lint` - Vérifie le code avec ESLint

## 🚀 Déploiement sur Vercel

1. **Connecter le projet à Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configurer les variables d'environnement**
   - Allez dans les paramètres du projet sur Vercel
   - Ajoutez toutes les variables d'environnement nécessaires

3. **Déployer**
   ```bash
   vercel --prod
   ```

## 🗄️ Structure de la base de données

- **Barbershop** : Informations des salons
- **Service** : Services proposés par chaque salon
- **Reservation** : Réservations des clients
- **Review** : Avis et notes des clients
- **WorkingHours** : Horaires d'ouverture
- **User** : Utilisateurs (via NextAuth)

## 📱 Fonctionnalités principales

### Pour les clients
- Recherche de barbershops par ville
- Filtrage par services et prix
- Réservation en ligne avec créneaux disponibles
- Système d'avis et de notation
- Notifications email automatiques

### Pour les barbershops
- Profil détaillé avec photos et informations
- Gestion des services et tarifs
- Affichage des horaires d'ouverture
- Système de réservation intégré

## 🔒 Sécurité

- Authentification sécurisée avec NextAuth.js
- Validation des données avec Zod
- Protection CSRF
- Headers de sécurité configurés
- Validation côté serveur avec tRPC

## 📈 SEO et Performance

- Sitemap XML automatique
- Données structurées JSON-LD
- Optimisation pour le référencement local
- Images optimisées
- Lazy loading des composants

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur GitHub.

---

Développé avec ❤️ pour les barbershops du Maroc 🇲🇦