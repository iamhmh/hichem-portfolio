# Hichem Gouia — Portfolio

Site personnel. Cloné à l'identique depuis
[kwokchunghim/tony-kwok-portfolio](https://github.com/kwokchunghim/tony-kwok-portfolio),
avec le contenu remplacé par des placeholders et la cible de déploiement
retargetée de Cloudflare Workers vers Railway.

## Stack

- TanStack Start (React 19 + Vite 7)
- Tailwind CSS v4
- TypeScript
- shadcn/ui (primitives dans `src/components/ui/`)
- Déployé sur Railway (Nitro, preset `node-server`)

## Démarrer

Node 22+ requis (`.nvmrc` fourni).

```bash
nvm use          # ou nvm install
npm install
npm run dev      # http://localhost:8080
```

Autres scripts : `npm run build`, `npm start` (sert le build de `.output/`),
`npm run lint`, `npm run format`.

## Structure

- `src/routes/` — routes en file-based routing (TanStack Router)
- `src/components/portfolio/` — sections du portfolio (Nav, Section, NeuralBackground)
- `src/components/ui/` — primitives shadcn/ui
- `src/styles.css` — design tokens et setup Tailwind
- `src/lib/writing.ts` — les articles
- `src/server.ts` / `src/start.ts` — wrappers SSR de gestion d'erreurs

## Où remplir vos informations

Tout le contenu est actuellement en placeholder. Les endroits à éditer :

| Quoi | Où |
|---|---|
| Titre, description, image de partage de la page d'accueil | `src/routes/index.tsx` → bloc `head` de `Route` |
| Accroche, sous-titre, ville | `src/routes/index.tsx` → section `HERO` |
| Texte « À propos » | `src/routes/index.tsx` → section `ABOUT` |
| Expériences professionnelles | `src/routes/index.tsx` → constante `EXPERIENCE` |
| Centres d'intérêt | `src/routes/index.tsx` → constante `INTERESTS` |
| Email, LinkedIn, GitHub | `src/routes/index.tsx` → section `CONTACT` |
| Nom dans le footer | `src/routes/index.tsx` → `FOOTER` |
| Initiales « HG » et libellés du menu | `src/components/portfolio/Nav.tsx` |
| Métadonnées globales, langue, token Google Search Console | `src/routes/__root.tsx` |
| Articles (internes et liens externes) | `src/lib/writing.ts` |
| Images des articles | `src/assets/` + map `IMAGES` dans `src/routes/writing.$slug.tsx` |
| Domaine du sitemap | `src/routes/sitemap[.]xml.ts` → `BASE_URL` |
| Domaine du robots.txt | `public/robots.txt` |
| Image de partage (Open Graph, 1200×630) | `public/social-preview.png` |

Les couleurs et le rayon des coins se règlent dans `src/styles.css`
(blocs `:root` et `.dark`, en oklch).

### Images placeholder à remplacer

- `public/social-preview.png` — aperçu de partage (1200×630)
- `src/assets/illustration.svg` — image d'exemple dans le premier article

## Déploiement sur Railway

Le build produit un serveur Node dans `.output/` via le preset Nitro
`node-server` (configuré dans `vite.config.ts`). Il écoute sur `$PORT`,
que Railway injecte automatiquement.

1. Pousser le dépôt sur GitHub.
2. Sur Railway : **New Project → Deploy from GitHub repo**, choisir ce dépôt.
3. Railway lit `railway.json` : build Nixpacks, démarrage via `npm run start`.
   Aucune variable d'environnement n'est nécessaire.
4. Vérifier que le déploiement répond sur l'URL `*.up.railway.app` fournie.

### Brancher le domaine `hichemgouia.com`

1. Railway → votre service → **Settings → Networking → Custom Domain**.
2. Ajouter `hichemgouia.com` (et `www.hichemgouia.com` si souhaité).
   Railway affiche la cible DNS à configurer.
3. Chez le registrar, créer les enregistrements indiqués. Pour le domaine
   apex (`hichemgouia.com` sans `www`), un `CNAME` à la racine n'est pas
   accepté par tous les registrars : soit votre DNS gère l'aplatissement de
   CNAME (ALIAS / ANAME / CNAME flattening, ex. Cloudflare), soit il faut
   pointer `www` vers Railway et rediriger l'apex vers `www`.
4. Attendre la propagation DNS. Railway provisionne le certificat TLS
   automatiquement.
5. Une fois le domaine actif, vérifier que les URL absolues correspondent :
   `BASE_URL` dans `src/routes/sitemap[.]xml.ts`, le `Sitemap:` de
   `public/robots.txt`, et les `og:image` / `twitter:image` dans
   `src/routes/index.tsx` et `src/routes/writing.$slug.tsx`.

## Écarts connus avec le dépôt d'origine

- Cible de déploiement : `vite.config.ts` pin le preset Nitro sur
  `node-server` au lieu du défaut Cloudflare du wrapper Lovable.
  `wrangler.jsonc` et `@cloudflare/vite-plugin` ont été retirés,
  `railway.json` ajouté.
- Contenu : textes, liens, nom de domaine et token Google Search Console
  remplacés par des placeholders.
- Assets : les 3 images d'articles de l'original étaient des références
  `*.asset.json` vers le CDN de Lovable (fichiers absents du dépôt) ;
  remplacées par une illustration locale. Les 3 photos personnelles
  présentes dans l'original n'étaient référencées nulle part dans le code
  et n'ont pas été reprises.
- Le dossier `.lovable/` (métadonnées de la plateforme Lovable) n'a pas
  été repris.
