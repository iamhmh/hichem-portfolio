// ---------------------------------------------------------------------------
// Contenu du site, en français et en anglais.
//
// Tout ce que le visiteur lit vit ici : libellés d'interface ET données
// structurées (parcours, formation, expertise, projets). Les composants ne
// contiennent aucune chaîne en dur, ce qui garantit qu'aucune section ne peut
// rester bloquée dans une seule langue.
//
// `en` est typé `Content` (= la forme de `fr`) : oublier une clé en anglais
// casse la compilation plutôt que d'afficher un trou dans la page.
// ---------------------------------------------------------------------------

export const LANGS = ["fr", "en"] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "fr";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/** Une entrée de timeline, partagée par les sections Expérience et Formation. */
export interface TimelineItem {
  period: string;
  role: string;
  org: string;
  /** Mention courte sous l'organisation : lieu, modalité de travail. */
  note?: string;
  focus: string;
  highlights: string[];
  themes: string[];
  /** Poste signé mais pas encore commencé : affiché avec un badge dédié. */
  upcoming?: boolean;
}

const fr = {
  /** Locale BCP 47 pour les dates et les nombres. */
  locale: "fr-FR",
  /** Libellé du sélecteur de langue et du lien hreflang. */
  langName: "Français",
  langShort: "FR",

  meta: {
    title: "Hichem Gouia — AI Engineer",
    description:
      "AI Engineer à Paris : systèmes d'IA en production, agentic et GenAI, NLP, computer vision, pipelines de données et MLOps.",
    siteName: "Hichem Gouia",
  },

  nav: {
    about: "À propos",
    experience: "Expérience",
    education: "Formation",
    expertise: "Expertise",
    projects: "Projets",
    contact: "Contact",
    cta: "Me contacter",
    switchLabel: "Changer de langue",
  },

  hero: {
    location: "Paris · Île-de-France",
    status: "AI Solution Engineer chez Innovorder à partir du 5 octobre 2026",
    title: "Je construis des systèmes d'IA qui tiennent en production.",
    intro:
      "AI Engineer spécialisé en agentic, GenAI, NLP et computer vision. Je conçois les modèles autant que les pipelines de données et la chaîne de déploiement qui les amènent jusqu'aux utilisateurs.",
    ctaJourney: "Voir mon parcours",
    ctaResume: "Télécharger mon CV",
    ctaContact: "Me contacter",
  },

  about: {
    eyebrow: "À propos",
    title: "Parcours.",
    paragraphs: [
      "Je suis AI Engineer, basé en Île-de-France. Je conçois et je mets en production des systèmes de machine learning et d'IA générative, ainsi que les pipelines de données qui les alimentent.",
      "Depuis janvier 2024, chez EstimerMonCommerce.fr, j'ai livré un pipeline OCR en production, mené la R&D sur les LLMs open-source et construit les chaînes d'ingestion et d'analyse géospatiale qui outillent le produit. Le 5 octobre 2026, je rejoins Innovorder en CDI comme AI Solution Engineer.",
      "Côté formation, un Master en informatique — IA appliquée & Data à Epitech, précédé d'un Bachelor orienté systèmes, réseaux et infrastructure. Cette double base explique ce qui m'intéresse le plus : ce qui se passe entre un modèle qui marche dans un notebook et un service qui tient en production.",
      "En 2025, j'ai été finaliste du MasterDevFrance sur les hackatons IA et algorithmique.",
    ],
    awardLabel: "Distinction",
    award: "Finaliste MasterDevFrance 2025 — hackatons IA & algorithmique",
  },

  experience: {
    eyebrow: "Expérience",
    title: "Là où j'ai travaillé.",
    upcomingBadge: "À venir",
    items: [
      {
        period: "Oct. 2026 →",
        role: "AI Solution Engineer",
        org: "Innovorder",
        focus:
          "Je rejoins Innovorder en CDI pour concevoir et intégrer des solutions d'IA en production : agents autonomes, automatisation de processus et connexion aux outils métier existants.",
        highlights: [],
        themes: ["Agentic AI", "Automatisation", "Intégration métier"],
        upcoming: true,
      },
      {
        period: "Janv. 2024 – Sept. 2026",
        role: "Software Engineer, AI / Data",
        org: "EstimerMonCommerce.fr",
        note: "Full-remote",
        focus:
          "Trois ans à porter l'IA et la donnée d'un produit SaaS d'estimation, du prototype de recherche jusqu'au service en production.",
        highlights: [
          "Mise en production d'un pipeline OCR qui extrait les données comptables et préremplit automatiquement le parcours d'estimation, avec un haut niveau de fiabilité et de disponibilité.",
          "R&D et prototypage de solutions d'IA générative (LLMs, vLLMs) : analyse comparative de modèles open-source (Mistral, Deepseek) pour optimiser le rapport performance/coût, orchestration via LangChain et observabilité instrumentée avec LangFuse.",
          "Conception d'un pipeline de web-scraping automatisé sur les annonces immobilières — ingestion brute, nettoyage, normalisation, stockage scalable — produisant des jeux de données cohérents pour l'analyse et la modélisation.",
          "Création d'un module interactif d'analyse géospatiale du marché (pipeline de données, normalisation, visualisation) pour outiller les études de marché locales et la décision produit.",
          "Contribution au développement full-stack et au déploiement de fonctionnalités SaaS (React côté front, PHP côté back), améliorant la cadence de livraison et la fiabilité du produit.",
        ],
        themes: [
          "OCR",
          "LLMs / vLLMs",
          "LangChain",
          "LangFuse",
          "Data pipelines",
          "Géospatial",
          "React",
          "PHP",
        ],
      },
      {
        period: "Mars – Juin 2023",
        role: "App Developer",
        org: "LTG Services",
        focus:
          "Conception, développement et livraison d'une application mobile iOS/Android de réseautage professionnel, de l'architecture et l'UX jusqu'au déploiement sur les stores.",
        highlights: [
          "Parcours d'onboarding et instrumentation analytics pour mesurer l'engagement des utilisateurs.",
        ],
        themes: ["Cross-platform", "iOS / Android", "UX", "Analytics"],
      },
    ] as TimelineItem[],
  },

  education: {
    eyebrow: "Formation",
    title: "Ce que j'ai étudié.",
    items: [
      {
        period: "Sept. 2024 – Sept. 2026",
        role: "Master in Computer Science — Applied AI & Data",
        org: "Epitech Technology",
        note: "Nancy",
        focus:
          "Cursus centré sur le développement et le déploiement de bout en bout de systèmes d'IA pour des cas d'usage réels.",
        highlights: [
          "Cours suivis : machine learning, deep learning, reinforcement learning (Deep Q-Learning), NLP (NER, Transformers/BERT), traitement de la parole et du son.",
          "Focus pratique : transfer learning, fine-tuning de modèles, prétraitement et augmentation de données, métriques d'évaluation, monitoring de modèles et pipelines de déploiement.",
          "Projets de fin de cycle et de laboratoire orientés production : scalabilité, robustesse, évaluation.",
        ],
        themes: ["Deep Learning", "NLP", "Reinforcement Learning", "Speech & Audio"],
      },
      {
        period: "Sept. 2022 – Août 2024",
        role: "Bachelor IT System",
        org: "Epitech Technology",
        note: "Nancy",
        focus: "Cursus d'ingénierie orienté systèmes, réseaux et infrastructure IT.",
        highlights: [
          "Principaux sujets : administration Linux, réseaux, scripting (Python/Bash), bases de données et fondamentaux du cloud.",
          "Projets pratiques : déploiement automatisé, supervision système et orchestration de services à petite échelle.",
        ],
        themes: ["Linux", "Réseaux", "Python / Bash", "Cloud"],
      },
    ] as TimelineItem[],
  },

  expertise: {
    eyebrow: "Expertise",
    title: "Mes domaines.",
    intro: "Les terrains sur lesquels je suis le plus à l'aise, et ce que j'y fais concrètement.",
    items: [
      {
        title: "Scientific Computing & AI",
        body: "Prototypage et expérimentation : protocoles d'évaluation, analyse comparative de modèles, mesure rigoureuse des résultats.",
      },
      {
        title: "Machine Learning",
        body: "Entraînement, transfer learning et fine-tuning, métriques d'évaluation, traitement du déséquilibre de classes et du surapprentissage.",
      },
      {
        title: "Neural Networks",
        body: "CNN pour la vision, Transformers et modèles BERT pour le langage, architectures profondes appliquées à des données réelles.",
      },
      {
        title: "Data Engineering",
        body: "Pipelines d'ingestion et de scraping, nettoyage et normalisation, stockage scalable et jeux de données prêts pour la modélisation.",
      },
      {
        title: "MLOps",
        body: "Mise en production des modèles : orchestration, observabilité avec LangFuse, monitoring et pipelines de déploiement.",
      },
      {
        title: "Cloud",
        body: "Déploiement et exécution sur plateformes cloud, orchestration serverless, inférence accélérée par GPU.",
      },
      {
        title: "Programming",
        body: "Python pour l'IA et la donnée, full-stack React et PHP, Bash pour l'automatisation.",
      },
      {
        title: "Project Management",
        body: "Cadrage des besoins métier, arbitrages performance/coût, livraison itérative en lien direct avec le produit.",
      },
    ],
  },

  projects: {
    eyebrow: "Projets",
    title: "Ce que je construis.",
    intro:
      "Quelques travaux de recherche appliquée, puis mon activité des douze derniers mois et mes dépôts publics.",
    researchTitle: "Recherche appliquée",
    openSourceTitle: "Activité et dépôts",
    openSourceIntro:
      "Mon activité GitHub et GitLab sur les douze derniers mois, et mes dépôts épinglés.",
    allRepos: "Voir tous mes dépôts",
    items: [
      {
        title: "Classification automatique de lésions cutanées",
        kind: "Computer Vision — Recherche",
        body: "Analyse comparative d'architectures CNN (EfficientNet vs. ResNet) par transfer learning, pour classifier des pathologies cutanées à partir d'imagerie clinique. Pipeline de prétraitement robuste — normalisation de la coloration, augmentation de données avancée — conçu pour corriger le déséquilibre du jeu de données et limiter le surapprentissage.",
        tags: ["EfficientNet", "ResNet", "Transfer learning", "Augmentation"],
      },
      {
        title: "NER & modélisation du langage",
        kind: "NLP — Recherche",
        body: "Exploration et implémentation d'architectures NLP état de l'art, centrées sur les Transformers et les modèles BERT pour la reconnaissance d'entités nommées. Expérimentations de transfer learning et de fine-tuning pour adapter des modèles pré-entraînés à des corpus de domaine, évaluées sur des métriques rigoureuses, avec un travail de fond sur les mécanismes d'attention et l'étiquetage de séquences.",
        tags: ["Transformers", "BERT", "NER", "Fine-tuning"],
      },
      {
        title: "Extraction de stems audio",
        kind: "Traitement du signal — Ingénierie",
        body: "Pipeline d'ingestion automatisé associant analyse spectrale, normalisation audio et prétraitement de la forme d'onde pour optimiser les entrées de l'inférence neuronale. Système d'inférence scalable accéléré par GPU et orchestré en serverless, dimensionné pour traiter des données audio de grande dimension à faible latence.",
        tags: ["Analyse spectrale", "GPU", "Serverless", "Faible latence"],
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Me contacter.",
    paragraphs: [
      "Je suis ouvert aux échanges sur l'IA en production : agents, GenAI appliquée, pipelines de données et MLOps.",
      "Une question, un projet, ou simplement l'envie de discuter d'un sujet technique — écrivez-moi, je réponds.",
    ],
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    resume: "Télécharger mon CV",
  },

  footer: {
    location: "Paris, France",
  },

  /** Chaînes du calendrier de contributions. */
  graph: {
    less: "Moins",
    more: "Plus",
    sourceGithub: "Source : GitHub",
    bothSameDay: "les deux le même jour",
    weekdays: { 1: "Lun", 3: "Mer", 5: "Ven" } as Record<number, string>,
    summary: (total: string) => `${total} contributions sur les 12 derniers mois`,
    split: (github: string, gitlab: string) => `${github} sur GitHub · ${gitlab} sur GitLab`,
    noneOn: (date: string) => `Aucune contribution le ${date}`,
    countOn: (count: number, date: string) =>
      `${count} contribution${count > 1 ? "s" : ""} le ${date}`,
    bothOn: (github: number, gitlab: number, date: string) =>
      `${github} GitHub · ${gitlab} GitLab le ${date}`,
    ariaBoth: (github: number, gitlab: number) =>
      `Calendrier de contributions : ${github} sur GitHub et ${gitlab} sur GitLab au cours des 12 derniers mois`,
    ariaGithub: (github: number) =>
      `Calendrier de contributions GitHub : ${github} contributions sur les 12 derniers mois`,
  },

  repo: {
    stars: "Étoiles : ",
    forks: "Forks : ",
  },

  notFound: {
    title: "Page introuvable",
    body: "Cette page n'existe pas ou a été déplacée.",
    cta: "Retour à l'accueil",
  },

  error: {
    title: "Cette page n'a pas pu se charger",
    body: "Une erreur est survenue de notre côté. Essayez de rafraîchir ou revenez à l'accueil.",
    retry: "Réessayer",
    cta: "Retour à l'accueil",
  },
};

export type Content = typeof fr;

const en: Content = {
  locale: "en-US",
  langName: "English",
  langShort: "EN",

  meta: {
    title: "Hichem Gouia — AI Engineer",
    description:
      "AI Engineer based in Paris: production-grade AI systems, agentic and GenAI, NLP, computer vision, data pipelines and MLOps.",
    siteName: "Hichem Gouia",
  },

  nav: {
    about: "About",
    experience: "Experience",
    education: "Education",
    expertise: "Expertise",
    projects: "Projects",
    contact: "Contact",
    cta: "Get in touch",
    switchLabel: "Change language",
  },

  hero: {
    location: "Paris · Île-de-France",
    status: "AI Solution Engineer at Innovorder from 5 October 2026",
    title: "I build AI systems that hold up in production.",
    intro:
      "AI Engineer specialising in agentic, GenAI, NLP and computer vision. I design the models as much as the data pipelines and the deployment chain that carry them all the way to users.",
    ctaJourney: "See my background",
    ctaResume: "Download my resume",
    ctaContact: "Get in touch",
  },

  about: {
    eyebrow: "About",
    title: "Background.",
    paragraphs: [
      "I'm an AI Engineer based in the Paris region. I design and ship machine learning and generative AI systems, along with the data pipelines that feed them.",
      "Since January 2024, at EstimerMonCommerce.fr, I shipped a production OCR pipeline, led R&D on open-source LLMs, and built the ingestion and geospatial analysis chains the product runs on. On 5 October 2026 I join Innovorder on a permanent contract as AI Solution Engineer.",
      "On the academic side: a Master's in Computer Science — Applied AI & Data at Epitech, preceded by a Bachelor's in systems, networking and IT infrastructure. That double grounding explains what interests me most — everything that happens between a model that works in a notebook and a service that holds up in production.",
      "In 2025 I was a MasterDevFrance finalist in the AI and algorithm hackathons.",
    ],
    awardLabel: "Award",
    award: "MasterDevFrance 2025 finalist — AI & algorithm hackathons",
  },

  experience: {
    eyebrow: "Experience",
    title: "Where I've worked.",
    upcomingBadge: "Upcoming",
    items: [
      {
        period: "Oct. 2026 →",
        role: "AI Solution Engineer",
        org: "Innovorder",
        focus:
          "I'm joining Innovorder on a permanent contract to design and integrate production AI solutions: autonomous agents, process automation, and connection to existing business tools.",
        highlights: [],
        themes: ["Agentic AI", "Automation", "Business integration"],
        upcoming: true,
      },
      {
        period: "Jan. 2024 – Sept. 2026",
        role: "Software Engineer, AI / Data",
        org: "EstimerMonCommerce.fr",
        note: "Full-remote",
        focus:
          "Three years owning the AI and data side of a SaaS valuation product, from research prototype through to production service.",
        highlights: [
          "Shipped a production-grade OCR pipeline that extracts accounting data and auto-fills the valuation workflow, with high reliability and availability.",
          "Led R&D and prototyping of generative AI solutions (LLMs, vLLMs): comparative analysis of open-source models (Mistral, Deepseek) to optimise the performance/cost ratio, orchestration through LangChain, and model observability instrumented with LangFuse.",
          "Designed an automated web-scraping ingestion pipeline for real-estate listings — raw ingestion, cleaning, normalisation, scalable storage — producing consistent datasets for analytics and modelling.",
          "Built an interactive geospatial market-analysis module (data pipeline, normalisation, visualisation) to support local market studies and product decision-making.",
          "Contributed to full-stack development and deployment of SaaS features (React on the front end, PHP on the back end), improving delivery cadence and product reliability.",
        ],
        themes: [
          "OCR",
          "LLMs / vLLMs",
          "LangChain",
          "LangFuse",
          "Data pipelines",
          "Geospatial",
          "React",
          "PHP",
        ],
      },
      {
        period: "Mar. – Jun. 2023",
        role: "App Developer",
        org: "LTG Services",
        focus:
          "Designed, built and shipped a cross-platform iOS/Android professional networking app, owning architecture and UX through to store deployment.",
        highlights: [
          "Implemented onboarding flows and analytics instrumentation to measure user engagement.",
        ],
        themes: ["Cross-platform", "iOS / Android", "UX", "Analytics"],
      },
    ] as TimelineItem[],
  },

  education: {
    eyebrow: "Education",
    title: "What I studied.",
    items: [
      {
        period: "Sept. 2024 – Sept. 2026",
        role: "Master in Computer Science — Applied AI & Data",
        org: "Epitech Technology",
        note: "Nancy",
        focus:
          "A programme centred on end-to-end development and deployment of AI systems for real-world applications.",
        highlights: [
          "Selected coursework: machine learning, deep learning, reinforcement learning (Deep Q-Learning), NLP (NER, Transformers/BERT), speech and audio processing.",
          "Practical focus: transfer learning, model fine-tuning, data preprocessing and augmentation, evaluation metrics, model monitoring and deployment pipelines.",
          "Capstone and lab projects delivering production-oriented models with attention to scalability, robustness and evaluation.",
        ],
        themes: ["Deep Learning", "NLP", "Reinforcement Learning", "Speech & Audio"],
      },
      {
        period: "Sept. 2022 – Aug. 2024",
        role: "Bachelor IT System",
        org: "Epitech Technology",
        note: "Nancy",
        focus:
          "An engineering programme emphasising systems, networking and practical IT infrastructure.",
        highlights: [
          "Core topics: Linux administration, networking, scripting (Python/Bash), databases and cloud fundamentals.",
          "Practical projects: automated deployment, system monitoring and small-scale service orchestration.",
        ],
        themes: ["Linux", "Networking", "Python / Bash", "Cloud"],
      },
    ] as TimelineItem[],
  },

  expertise: {
    eyebrow: "Expertise",
    title: "Areas I work in.",
    intro: "The ground I'm most comfortable on, and what I actually do there.",
    items: [
      {
        title: "Scientific Computing & AI",
        body: "Prototyping and experimentation: evaluation protocols, comparative model analysis, rigorous measurement of results.",
      },
      {
        title: "Machine Learning",
        body: "Training, transfer learning and fine-tuning, evaluation metrics, handling class imbalance and overfitting.",
      },
      {
        title: "Neural Networks",
        body: "CNNs for vision, Transformers and BERT-based models for language, deep architectures applied to real data.",
      },
      {
        title: "Data Engineering",
        body: "Ingestion and scraping pipelines, cleaning and normalisation, scalable storage and modelling-ready datasets.",
      },
      {
        title: "MLOps",
        body: "Getting models to production: orchestration, observability with LangFuse, monitoring and deployment pipelines.",
      },
      {
        title: "Cloud",
        body: "Deployment and execution on cloud platforms, serverless orchestration, GPU-accelerated inference.",
      },
      {
        title: "Programming",
        body: "Python for AI and data, full-stack React and PHP, Bash for automation.",
      },
      {
        title: "Project Management",
        body: "Framing business needs, performance/cost trade-offs, iterative delivery in close contact with the product.",
      },
    ],
  },

  projects: {
    eyebrow: "Projects",
    title: "What I build.",
    intro:
      "A few pieces of applied research, then my activity over the last twelve months and my public repositories.",
    researchTitle: "Applied research",
    openSourceTitle: "Activity and repositories",
    openSourceIntro:
      "My GitHub and GitLab activity over the last twelve months, and my pinned repositories.",
    allRepos: "See all my repositories",
    items: [
      {
        title: "Automated Skin Lesion Classification",
        kind: "Computer Vision — Research",
        body: "A comparative analysis of CNN architectures (EfficientNet vs. ResNet) using transfer learning to classify skin pathologies from clinical imagery. Engineered a robust preprocessing pipeline — stain normalisation, advanced data augmentation — designed to mitigate dataset imbalance and overfitting.",
        tags: ["EfficientNet", "ResNet", "Transfer learning", "Augmentation"],
      },
      {
        title: "Advanced NER & Language Modeling",
        kind: "NLP — Research",
        body: "Explored and implemented state-of-the-art NLP architectures, focusing on Transformers and BERT-based models for Named Entity Recognition. Ran transfer learning and fine-tuning experiments to adapt pre-trained models to domain-specific datasets, evaluated against rigorous NLP metrics, with deep work on attention mechanisms and sequence labeling.",
        tags: ["Transformers", "BERT", "NER", "Fine-tuning"],
      },
      {
        title: "Audio Stem Extraction",
        kind: "Signal Processing — Engineering",
        body: "An automated ingestion pipeline combining spectral analysis, audio normalisation and waveform preprocessing to optimise inputs for neural inference. A scalable, GPU-accelerated inference system orchestrated serverless, sized to handle high-dimensional audio data at low latency.",
        tags: ["Spectral analysis", "GPU", "Serverless", "Low latency"],
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Get in touch.",
    paragraphs: [
      "I'm happy to talk about AI in production: agents, applied GenAI, data pipelines and MLOps.",
      "A question, a project, or simply the urge to dig into a technical topic — write to me, I answer.",
    ],
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    resume: "Download my resume",
  },

  footer: {
    location: "Paris, France",
  },

  graph: {
    less: "Less",
    more: "More",
    sourceGithub: "Source: GitHub",
    bothSameDay: "both on the same day",
    weekdays: { 1: "Mon", 3: "Wed", 5: "Fri" } as Record<number, string>,
    summary: (total: string) => `${total} contributions in the last 12 months`,
    split: (github: string, gitlab: string) => `${github} on GitHub · ${gitlab} on GitLab`,
    noneOn: (date: string) => `No contributions on ${date}`,
    countOn: (count: number, date: string) =>
      `${count} contribution${count > 1 ? "s" : ""} on ${date}`,
    bothOn: (github: number, gitlab: number, date: string) =>
      `${github} GitHub · ${gitlab} GitLab on ${date}`,
    ariaBoth: (github: number, gitlab: number) =>
      `Contribution calendar: ${github} on GitHub and ${gitlab} on GitLab over the last 12 months`,
    ariaGithub: (github: number) =>
      `GitHub contribution calendar: ${github} contributions over the last 12 months`,
  },

  repo: {
    stars: "Stars: ",
    forks: "Forks: ",
  },

  notFound: {
    title: "Page not found",
    body: "This page doesn't exist, or it has moved.",
    cta: "Back home",
  },

  error: {
    title: "This page didn't load",
    body: "Something went wrong on our side. Try refreshing, or head back home.",
    retry: "Try again",
    cta: "Back home",
  },
};

export const CONTENT: Record<Lang, Content> = { fr, en };

// ---------------------------------------------------------------------------
// Constantes non traduites : identiques dans les deux langues.
// ---------------------------------------------------------------------------

export const SITE_URL = "https://hichemgouia.com";

/** URL absolue de la page d'accueil dans une langue — utilisée par hreflang et le sitemap. */
export function urlForLang(lang: Lang): string {
  return lang === DEFAULT_LANG ? `${SITE_URL}/` : `${SITE_URL}/?lang=${lang}`;
}

export const LINKS = {
  email: "contact.hichemgouia@gmail.com",
  linkedin: "https://www.linkedin.com/in/hichem-gouia/",
  github: "https://github.com/iamhmh",
  resume: "/Hichem_Gouia_AI_Engineer.pdf",
};
