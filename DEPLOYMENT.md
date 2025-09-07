# Guide de déploiement - BarberLi

Ce guide vous accompagne dans le déploiement de BarberLi sur Vercel avec une base de données Neon.

## 🚀 Déploiement rapide

### 1. Préparation de la base de données (Neon)

1. **Créer un compte Neon**
   - Allez sur [neon.tech](https://neon.tech)
   - Créez un compte gratuit
   - Créez un nouveau projet

2. **Obtenir l'URL de connexion**
   - Copiez l'URL de connexion PostgreSQL
   - Elle ressemble à : `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb`

### 2. Configuration Google Cloud Platform

1. **Créer un projet**
   - Allez sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créez un nouveau projet

2. **Activer les APIs nécessaires**
   - Maps JavaScript API
   - Places API
   - Geocoding API

3. **Créer une clé API**
   - Allez dans "Identifiants" > "Créer des identifiants" > "Clé API"
   - Configurez les restrictions (domaines autorisés)

4. **Configurer OAuth 2.0**
   - Allez dans "Identifiants" > "Créer des identifiants" > "ID client OAuth 2.0"
   - Ajoutez les domaines autorisés (votre domaine Vercel)

### 3. Configuration Resend (Email)

1. **Créer un compte**
   - Allez sur [resend.com](https://resend.com)
   - Créez un compte gratuit

2. **Vérifier votre domaine**
   - Ajoutez votre domaine
   - Configurez les enregistrements DNS

3. **Obtenir la clé API**
   - Allez dans "API Keys"
   - Créez une nouvelle clé

### 4. Déploiement sur Vercel

1. **Connecter le projet**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configurer les variables d'environnement**
   
   Dans le dashboard Vercel, ajoutez ces variables :
   
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb
   
   # NextAuth
   AUTH_SECRET=your-random-secret-here
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   
   # Google Maps
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   
   # Email
   RESEND_API_KEY=your-resend-api-key
   
   # Environment
   NODE_ENV=production
   ```

3. **Déployer**
   ```bash
   vercel --prod
   ```

### 5. Configuration post-déploiement

1. **Initialiser la base de données**
   ```bash
   vercel env pull .env.local
   npm run db:push
   npm run db:seed
   ```

2. **Vérifier le déploiement**
   - Testez l'authentification Google
   - Vérifiez les cartes Google Maps
   - Testez l'envoi d'emails

## 🔧 Configuration avancée

### Variables d'environnement détaillées

```env
# Base de données
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
AUTH_SECRET="minimum-32-characters-long-random-string"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Google Maps (côté serveur)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Google Maps (côté client)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Email
RESEND_API_KEY="re_xxxxxxxxxx"

# Stripe (optionnel)
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxx"

# Environment
NODE_ENV="production"
```

### Configuration des domaines autorisés

Dans Google Cloud Console, ajoutez :
- `https://your-domain.vercel.app`
- `https://your-domain.com` (si vous avez un domaine personnalisé)

### Configuration DNS (domaine personnalisé)

Si vous utilisez un domaine personnalisé :

1. **Dans Vercel**
   - Allez dans "Domains"
   - Ajoutez votre domaine
   - Suivez les instructions DNS

2. **Dans votre registrar**
   - Ajoutez les enregistrements CNAME/A
   - Attendez la propagation DNS (24-48h)

## 🐛 Dépannage

### Erreurs courantes

1. **"Invalid API key" (Google Maps)**
   - Vérifiez que la clé API est correcte
   - Vérifiez les restrictions de domaine
   - Vérifiez que les APIs sont activées

2. **"Database connection failed"**
   - Vérifiez l'URL de connexion Neon
   - Vérifiez que la base de données est accessible
   - Vérifiez les variables d'environnement

3. **"OAuth error"**
   - Vérifiez les identifiants Google OAuth
   - Vérifiez les domaines autorisés
   - Vérifiez les URLs de redirection

4. **"Email sending failed"**
   - Vérifiez la clé API Resend
   - Vérifiez que le domaine est vérifié
   - Vérifiez les logs Resend

### Logs et monitoring

1. **Vercel Logs**
   ```bash
   vercel logs
   ```

2. **Neon Dashboard**
   - Surveillez les connexions
   - Vérifiez les requêtes

3. **Google Cloud Console**
   - Surveillez l'utilisation des APIs
   - Vérifiez les quotas

## 📊 Monitoring et analytics

### Recommandations

1. **Google Analytics**
   - Ajoutez Google Analytics 4
   - Configurez les événements de conversion

2. **Vercel Analytics**
   - Activez Vercel Analytics
   - Surveillez les performances

3. **Uptime monitoring**
   - Utilisez UptimeRobot ou similaire
   - Surveillez la disponibilité

## 🔒 Sécurité

### Bonnes pratiques

1. **Variables d'environnement**
   - Ne jamais commiter les clés API
   - Utiliser des secrets différents par environnement
   - Rotation régulière des clés

2. **Headers de sécurité**
   - Configurés dans `vercel.json`
   - Protection CSRF, XSS, etc.

3. **Base de données**
   - Utiliser des connexions SSL
   - Limiter les permissions
   - Sauvegardes régulières

## 📈 Optimisation

### Performance

1. **Images**
   - Utiliser Next.js Image Optimization
   - Formats WebP/AVIF
   - Lazy loading

2. **Code splitting**
   - Imports dynamiques
   - Lazy loading des composants

3. **Caching**
   - Vercel Edge Network
   - Cache des API routes
   - ISR pour les pages statiques

### SEO

1. **Sitemap**
   - Généré automatiquement
   - Soumis à Google Search Console

2. **Données structurées**
   - JSON-LD pour les barbershops
   - Rich snippets

3. **Meta tags**
   - Optimisés pour chaque page
   - Open Graph et Twitter Cards

---

Pour toute question, consultez la documentation officielle ou ouvrez une issue sur GitHub.
