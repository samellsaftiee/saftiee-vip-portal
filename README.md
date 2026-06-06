# 🌸 Saftiee Driver VIP Portal

Portail VIP exclusif pour les conductrices Saftiee — accès par QR code.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · NextAuth · Vercel


---

## ✨ Fonctionnalités

| Module | Description |
|--------|-------------|
| **Page VIP publique** | Hero, avantages, codes promo, actualités, footer |
| **Admin dashboard** | CMS complet — édition de tout le contenu |
| **Auth sécurisée** | NextAuth + bcrypt, session JWT 8h |
| **Upload logo** | Stockage Supabase Storage |
| **ISR** | Revalidation automatique toutes les 60s |
| **Mobile-first** | Optimisé pour smartphone |
| **Design luxury** | Or + rose, Cormorant Garamond, glassmorphism |

---

## 🚀 Installation locale

### 1. Cloner et installer

```bash
git clone https://github.com/votre-repo/saftiee-vip.git
cd saftiee-vip
npm install
```

### 2. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Ouvrez l'éditeur SQL et exécutez le contenu de **`supabase-schema.sql`**
3. Notez vos clés depuis **Settings → API**

### 3. Générer le hash du mot de passe admin

```bash
node scripts/hash-password.js VotreMotDePasse123
# Copiez le hash affiché
```

### 4. Créer le fichier `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXTAUTH_SECRET=votre-secret-aleatoire-min-32-caracteres
NEXTAUTH_URL=http://localhost:3000

ADMIN_EMAIL=admin@saftiee.dz
ADMIN_PASSWORD_HASH=$2b$12$... (hash généré à l'étape 3)
```

### 5. Lancer en développement

```bash
npm run dev
# → http://localhost:3000        (page VIP publique)
# → http://localhost:3000/admin  (dashboard admin)
```

---

## 📦 Déploiement sur Vercel

### Option A — Via GitHub (recommandé)

1. **Pushez votre code sur GitHub**
   ```bash
   git add . && git commit -m "Initial commit"
   git push origin main
   ```

2. **Importez sur Vercel**
   - Allez sur [vercel.com/new](https://vercel.com/new)
   - Sélectionnez votre repo GitHub
   - Vercel détecte automatiquement Next.js

3. **Ajoutez les variables d'environnement** dans Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → **votre domaine Vercel** (ex: `https://saftiee-vip.vercel.app`)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`

4. **Cliquez Deploy** ✅

### Option B — Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🔐 Accès Admin

| URL | Description |
|-----|-------------|
| `/admin/login` | Page de connexion |
| `/admin/dashboard` | Dashboard CMS complet |

**Identifiants par défaut** (à changer) :
- Email : `admin@saftiee.dz`
- Mot de passe : celui que vous avez hashé

> ⚠️ L'URL `/admin/*` est complètement protégée par middleware.  
> Les utilisateurs non authentifiés sont redirigés vers `/admin/login`.

---

## 📱 Accès par QR Code

Pour créer un QR code d'accès au portail VIP :

1. Déployez l'app sur Vercel → obtenez votre URL (ex: `https://saftiee-vip.vercel.app`)
2. Utilisez [qr-code-generator.com](https://www.qr-code-generator.com) pour générer un QR code
3. Intégrez le QR code dans vos communications conductrices

---

## 🗂️ Structure du projet

```
saftiee-vip/
├── app/
│   ├── page.tsx                  # Page VIP publique (SSR + ISR)
│   ├── layout.tsx                # Layout racine (fonts, meta)
│   ├── globals.css               # Tailwind + variables CSS
│   ├── admin/
│   │   ├── login/page.tsx        # Page de connexion admin
│   │   └── dashboard/page.tsx    # Dashboard (auth-gated)
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth endpoints
│       ├── content/route.ts      # GET/POST contenu CMS
│       └── upload/route.ts       # Upload logo → Supabase Storage
├── components/
│   ├── VIPPage.tsx               # Page publique complète
│   ├── AdminDashboard.tsx        # Dashboard CMS complet
│   ├── BenefitIcon.tsx           # Mapping icônes Lucide
│   └── AuthProvider.tsx          # SessionProvider wrapper
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── content.ts                # Lecture/écriture Supabase
│   ├── defaultContent.ts         # Contenu par défaut (fallback)
│   ├── auth.ts                   # Config NextAuth
│   └── supabase.ts               # Clients Supabase
├── middleware.ts                  # Protection routes admin
├── scripts/hash-password.js      # Utilitaire hash mot de passe
├── supabase-schema.sql           # Schéma SQL à exécuter
└── vercel.json                   # Config déploiement Vercel
```

---

## 🎨 Design System

| Token | Valeur |
|-------|--------|
| Or principal | `#C9A84C` |
| Rose blush | `#F4A0BD` |
| Fond crème | `#FDF8F3` |
| Texte encre | `#1a1410` |
| Font display | Cormorant Garamond (serif) |
| Font body | DM Sans (sans-serif) |
| Font mono | DM Mono (codes promo) |

---

## 🛠️ Commandes utiles

```bash
npm run dev      # Développement local
npm run build    # Build production
npm run start    # Démarrer la build locale
npm run lint     # Vérifier le code
```

---

## 🔄 Mise à jour du contenu

Tout le contenu est éditable depuis le dashboard admin :
- **Hero** : titre, sous-titre, badge
- **Logo** : upload d'image, nom affiché
- **Avantages** : ajout/suppression/édition des cartes
- **Actualités** : feed d'actualités avec dates et tags
- **Codes VIP** : codes promo activables/désactivables
- **Pied de page** : tagline, contacts, mention légale

Les modifications sont sauvegardées en JSON dans Supabase et reflétées sur le site en moins de 60 secondes (ISR).

---

*Développé pour Saftiee — Oran, Algérie 🇩🇿*
