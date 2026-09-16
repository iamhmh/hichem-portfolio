# Hichem Gouia — Portfolio

Site personnel.

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
- `src/lib/activity.ts` — types de la section Projets (isomorphe)
- `src/lib/github.server.ts` — appel GraphQL GitHub, validation, cache (serveur only)
- `src/lib/gitlab.server.ts` — calendrier GitLab, validation, cache (serveur only)
- `src/lib/portfolio.server.ts` — fusion des deux sources
- `src/lib/portfolio-fn.ts` — server function consommée par le loader de `/`
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
| Compte GitHub affiché | variable `GITHUB_LOGIN` (défaut `iamhmh`) |
| Compte GitLab affiché | variable `GITLAB_LOGIN` (vide = GitLab désactivé) |
| Projets mis en avant | à épingler sur votre profil GitHub — aucun code à modifier |
| Domaine du sitemap | `src/routes/sitemap[.]xml.ts` → `BASE_URL` |
| Domaine du robots.txt | `public/robots.txt` |
| Image de partage (Open Graph, 1200×630) | `public/social-preview.png` |

Les couleurs et le rayon des coins se règlent dans `src/styles.css`
(blocs `:root` et `.dark`, en oklch).

### Image placeholder à remplacer

- `public/social-preview.png` — aperçu de partage (1200×630)

## Section Projets (GitHub + GitLab)

La section affiche votre **calendrier de contributions** des 12 derniers mois
glissants, puis vos **dépôts épinglés**. Le contenu se pilote depuis GitHub :
épingler ou désépingler un dépôt suffit, aucun code à toucher.

Le calendrier fusionne deux sources dans une seule grille. Chaque case est
coupée en diagonale : **triangle haut-gauche vert pour GitHub, triangle
bas-droit orange pour GitLab**. Les niveaux d'intensité sont calculés
séparément par source, sinon une journée à 3 contributions GitLab paraîtrait
aussi dense qu'une journée à 30 sur GitHub.

### Pourquoi un token est indispensable

Ces deux données ne sont exposées que par l'API **GraphQL** de GitHub, qui
exige une authentification même pour des données publiques. Il n'existe aucun
endpoint REST équivalent (`/users/<login>/pinned` renvoie 404). Sans token, la
section est masquée et le reste du site fonctionne normalement.

### Créer le token

Sur https://github.com/settings/tokens, créez un token **classic** avec le seul
scope **`read:user`**. Il ne donne aucun droit d'écriture et aucun accès aux
dépôts privés. Notez sa date d'expiration : à son échéance, la section
disparaîtra silencieusement jusqu'au renouvellement.

Vérifiez-le avant de déployer :

```bash
curl -s -H "Authorization: Bearer VOTRE_TOKEN" -X POST https://api.github.com/graphql \
  -d '{"query":"{viewer{login} user(login:\"iamhmh\"){pinnedItems(first:6,types:REPOSITORY){totalCount} contributionsCollection{contributionCalendar{totalContributions}}}}"}'
```

Une réponse contenant `totalCount` et `totalContributions` confirme que tout
fonctionne. Si `totalContributions` vaut 0 ou manque, le scope est insuffisant.

### En local

Copiez `.env.example` vers `.env` et renseignez `GITHUB_TOKEN`. Le fichier est
chargé automatiquement par `npm run dev`, et il est ignoré par git.

### Sur Railway

Service → **Variables** → ajoutez `GITHUB_TOKEN`, et `GITLAB_LOGIN` si vous
voulez la seconde source (`GITHUB_LOGIN` seulement si votre compte n'est pas
`iamhmh`). Railway redéploie automatiquement à l'ajout.

### GitLab (optionnel, sans token)

Renseignez `GITLAB_LOGIN`. Le calendrier est lu sur
`/users/<login>/calendar.json`, la source qu'utilise la page de profil GitLab
elle-même — aucune authentification, un seul appel.

Pour que vos contributions sur projets **privés** y figurent, activez dans
GitLab **Préférences → Profil → « Inclure les contributions privées sur mon
profil »**. Seuls les compteurs deviennent publics : ni les noms de projets, ni
les commits. GitLab met ce calendrier en cache, comptez quelques heures avant
qu'il se remplisse.

Vérifiez à tout moment ce que GitLab expose :

```bash
curl -s https://gitlab.com/users/VOTRE_LOGIN/calendar.json | head -c 300
```

Une réponse `{}` signifie que GitLab ne publie rien : le calendrier s'affiche
alors en vert seul, sans demi-cases orange ni légende GitLab. Laissez
`GITLAB_LOGIN` vide pour désactiver complètement l'intégration.

### Comportement

Le token n'atteint jamais le navigateur : les appels ont lieu dans le loader de
la route, côté serveur. Chaque source est gardée en cache une heure ; passé ce
délai elle est toujours servie immédiatement et rafraîchie en tâche de fond.

Les deux sources ne sont pas traitées symétriquement, parce qu'elles n'ont pas
le même rôle :

- **GitHub est structurant** — c'est lui qui fournit la grille de 12 mois. En
  cas de panne, de token expiré ou de quota dépassé, la dernière donnée connue
  continue d'être affichée ; si aucune n'a jamais été récupérée, la section et
  son entrée de menu disparaissent — le visiteur ne voit jamais d'erreur.
- **GitLab est un complément** — il dispose d'un budget de 2,5 s dans le rendu
  (`GITLAB_RENDER_BUDGET_MS` dans `portfolio.server.ts`). Au-delà, la page est
  rendue en vert seul sans attendre ; la requête se poursuit en arrière-plan et
  la visite suivante affichera les deux sources. Une panne GitLab n'a donc
  jamais d'effet visible au-delà de l'absence des demi-cases orange.

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
   `src/routes/index.tsx`.

## Écarts connus avec le dépôt d'origine

- Cible de déploiement : `vite.config.ts` pin le preset Nitro sur
  `node-server` au lieu du défaut Cloudflare du wrapper Lovable.
  `wrangler.jsonc` et `@cloudflare/vite-plugin` ont été retirés,
  `railway.json` ajouté.
- Contenu : textes, liens, nom de domaine et token Google Search Console
  remplacés par des placeholders.
- Assets : les 3 images d'articles de l'original étaient des références
  `*.asset.json` vers le CDN de Lovable (fichiers absents du dépôt). Les
  3 photos personnelles présentes dans l'original n'étaient référencées
  nulle part dans le code. Aucune n'a été reprise.
- Section « Écrits » supprimée : la rubrique articles de l'original a été
  retirée (section de la page d'accueil, entrée de menu, route
  `/writing/$slug`, `src/lib/writing.ts` et les entrées correspondantes du
  sitemap). Pour la réintroduire plus tard, le dépôt d'origine reste la
  référence — ou `git show` sur l'historique de ce dépôt.
- Section « Projets » ajoutée : elle n'existe pas dans le dépôt d'origine.
  Voir la section dédiée plus haut.
- Le dossier `.lovable/` (métadonnées de la plateforme Lovable) n'a pas
  été repris.
- La dépendance `@hookform/resolvers` a été retirée. Elle n'était importée
  nulle part dans le code, et son peer optionnel `ajv@^8` entrait en
  conflit avec le `ajv@^6` d'eslint : `npm install` et `npm ci` calculaient
  alors deux arbres différents, ce qui faisait échouer le build Railway
  (`npm ci` refuse un lockfile désynchronisé). Le dépôt d'origine utilise
  bun, dont la résolution diffère, et ne rencontrait donc pas ce cas.
  Si vous ajoutez un jour une validation de formulaire (zod + react-hook-form),
  réinstallez-la avec `npm i @hookform/resolvers ajv@^8` pour garder
  l'arbre cohérent.
