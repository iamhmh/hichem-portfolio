export const LANGS = ["fr", "en"] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "fr";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/**
 * Un projet de recherche : la carte affichée sur la page d'accueil ET l'article
 * qui la détaille. Les deux vivent dans le même objet pour qu'un projet ne
 * puisse pas exister en carte sans article, ou l'inverse.
 *
 * `slug` est identique en français et en anglais : l'URL d'un article ne change
 * pas avec la langue, seul le `?lang=` s'ajoute. Une traduction manquante
 * casserait donc le lien, ce que le typage de `en` empêche.
 */
export interface ResearchProject {
  slug: string;
  title: string;
  /** Discipline et nature du travail, affichées en surtitre. */
  kind: string;
  /** Résumé court, sur la carte de la page d'accueil. */
  body: string;
  tags: string[];
  article: {
    /** `<meta name="description">` de la page d'article. */
    metaDescription: string;
    /** Chapô, sous le titre. */
    lede: string;
    sections: Array<{ heading: string; paragraphs: string[] }>;
  };
}

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
    title: "Hichem Gouia - AI Engineer",
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
    location: "Paris",
    status: "AI Solution Engineer",
    title: "Passionné d'IA, d'informatique et de nouvelles technologies.",
    intro:
      "AI Engineer spécialisé en harness, agentic, GenAI, NLP et computer vision. Je conçois les modèles autant que les pipelines de données et la chaîne de déploiement qui les amènent jusqu'aux utilisateurs.",
    ctaJourney: "Voir mon parcours",
    ctaResume: "Télécharger mon CV",
    ctaContact: "Me contacter",
  },

  about: {
    eyebrow: "À propos",
    title: "Parcours.",
    paragraphs: [
      "Je suis AI Solution Engineer, actuellement basé à Paris.",
      "Partant du besoin métier, je conçois et je mets en production des systèmes de ML/DL et d'IA générative, ainsi que les pipelines de données qui les alimentent.",
      "Pragmatique par nature, le besoin/cadrage de chaque projet et la communication sont mes principales qualités avant de coder et/ou déployer un projet.",
    ],
    awardLabel: "Distinction",
    award: "Finaliste MasterDevFrance 2025 - hackatons IA & algorithmique",
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
          "Conception d'un pipeline de web-scraping automatisé sur les annonces immobilières - ingestion brute, nettoyage, normalisation, stockage scalable - produisant des jeux de données cohérents pour l'analyse et la modélisation.",
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
        role: "Master in Computer Science - Applied AI & Data",
        org: "Epitech Technology",
        note: "Nancy",
        focus:
          "Cursus centré sur le développement et le déploiement de end-to-end de systèmes d'IA pour des cas d'usage réels.",
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
      {
        period: "Sept. 2021 – Août 2022",
        role: "Bachelor Web et App",
        org: "CCI des Vosges",
        note: "Épinal",
        focus: "Formation intensive sur le développement et l'architecture web et applicatif.",
        highlights: [
          "Principaux sujets : algorithmie, développement fullstack (front-end, back-end), déploiement, sécurité, design patterns.",
          "Projets pratiques : Déploiément de sites web end-to-end (site e-commerce, site vitrine, application mobile).",
        ],
        themes: ["Front-end", "Back-end", "Javascript", "PHP"],
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
    readArticle: "Lire l'article",
    items: [
      {
        slug: "skin-lesion-classification",
        title: "Classification automatique de lésions cutanées",
        kind: "Computer Vision - Recherche",
        body: "Analyse comparative d'architectures CNN (EfficientNet vs. ResNet) par transfer learning, pour classifier des pathologies cutanées à partir d'imagerie clinique. Pipeline de prétraitement robuste - normalisation de la coloration, augmentation de données avancée - conçu pour corriger le déséquilibre du jeu de données et limiter le surapprentissage.",
        tags: ["EfficientNet", "ResNet", "Transfer learning", "Augmentation"],
        article: {
          metaDescription:
            "Analyse comparative EfficientNet / ResNet par transfer learning pour la classification de lésions cutanées : cadrage du problème, normalisation de la coloration, augmentation de données et traitement du déséquilibre.",
          lede: "Comparer deux familles de réseaux convolutifs sur de l'imagerie clinique, c'est surtout découvrir que l'architecture n'est pas la variable la plus importante. Voici le cheminement, du cadrage du problème au pipeline de prétraitement.",
          sections: [
            {
              heading: "Le problème posé",
              paragraphs: [
                "Classer des pathologies cutanées à partir d'images cliniques revient à demander à un modèle de distinguer des classes qui, à l'œil nu, se ressemblent beaucoup. Deux lésions de nature très différente peuvent partager une forme, une bordure et une teinte proches ; à l'inverse, une même pathologie change d'apparence selon la carnation, l'éclairage et l'appareil qui a pris la photo.",
                "S'ajoute la contrainte qui structure tout le reste : les jeux de données cliniques sont déséquilibrés. Les cas fréquents écrasent numériquement les cas rares, alors que ce sont précisément les cas rares qui comptent. Un modèle qui optimise naïvement l'exactitude globale apprend très vite à ignorer les classes minoritaires - et affiche un score flatteur qui ne dit rien de son utilité réelle.",
              ],
            },
            {
              heading: "Pourquoi partir de modèles pré-entraînés",
              paragraphs: [
                "Entraîner un réseau convolutif profond depuis zéro suppose un volume de données annotées que l'imagerie clinique n'offre pas. Le transfer learning contourne l'obstacle : on reprend un réseau déjà entraîné sur un corpus généraliste, on conserve les premières couches - qui ont appris des motifs bas niveau, contours, textures, gradients, valables bien au-delà de leur domaine d'origine - et on ré-apprend les couches hautes sur les images qui nous intéressent.",
                "Le choix qui reste à faire porte sur la profondeur du dégel : figer tout sauf la tête de classification, ou laisser respirer les derniers blocs convolutifs. Plus on dégèle, plus le modèle s'adapte au domaine, et plus il risque de surapprendre un jeu de données restreint. C'est un curseur à régler, pas une case à cocher.",
              ],
            },
            {
              heading: "EfficientNet face à ResNet",
              paragraphs: [
                "Les deux architectures répondent à la même question - comment gagner en profondeur sans que l'entraînement se dégrade - par deux réponses différentes. ResNet introduit les connexions résiduelles : chaque bloc apprend un écart par rapport à son entrée plutôt qu'une transformation complète, ce qui laisse le gradient remonter intact à travers des dizaines de couches.",
                "EfficientNet part d'un autre constat : profondeur, largeur et résolution d'entrée ne se règlent pas indépendamment. Son compound scaling les fait croître ensemble selon un rapport fixe, ce qui donne, à budget de paramètres comparable, des modèles nettement plus économes.",
                "La comparaison ne se résume donc pas à « lequel obtient le meilleur score ». À protocole identique - mêmes données, mêmes augmentations, même stratégie de dégel - elle porte sur le comportement : vitesse de convergence, sensibilité aux hyperparamètres, coût d'inférence, et surtout tenue sur les classes minoritaires plutôt que sur la moyenne.",
              ],
            },
            {
              heading: "Le prétraitement, là où se joue l'essentiel",
              paragraphs: [
                "La normalisation de la coloration traite une nuisance bien identifiée en imagerie médicale : d'un centre à l'autre, d'un appareil à l'autre, les mêmes tissus ne rendent pas la même chose. Sans correction, le réseau apprend la signature de l'appareil en même temps que la pathologie, et s'effondre dès qu'on lui présente une source qu'il n'a jamais vue.",
                "L'augmentation de données avancée joue sur un autre registre. Rotations, retournements, recadrages, variations de luminosité et de contraste : l'objectif est de fabriquer de la variabilité plausible, celle qu'on rencontrerait vraiment en clinique, sans inventer des images qu'aucun patient ne produirait. Sur les classes rares, l'augmentation fait double emploi - elle régularise et elle rééquilibre.",
                "Le déséquilibre se traite en parallèle, au niveau de l'échantillonnage et de la fonction de coût, pour qu'une erreur sur une classe rare pèse à sa juste mesure plutôt que de se diluer dans la masse.",
              ],
            },
            {
              heading: "Ce que ce travail m'a appris",
              paragraphs: [
                "Le réflexe, sur ce type de problème, est de chercher l'architecture qui gagne. L'expérience mène ailleurs : à jeu de données constant, le pipeline de prétraitement et la manière de traiter le déséquilibre déplacent les résultats davantage que le passage d'une famille de réseaux à l'autre.",
                "L'autre enseignement porte sur les métriques. L'exactitude globale est une mauvaise boussole sur des données déséquilibrées ; il faut regarder les classes une par une, matrice de confusion en main, et accepter qu'un modèle moins bon en moyenne soit le bon choix s'il tient sur ce qui compte.",
              ],
            },
          ],
        },
      },
      {
        slug: "ner-language-modeling",
        title: "NER & modélisation du langage",
        kind: "NLP - Recherche",
        body: "Exploration et implémentation d'architectures NLP état de l'art, centrées sur les Transformers et les modèles BERT pour la reconnaissance d'entités nommées. Expérimentations de transfer learning et de fine-tuning pour adapter des modèles pré-entraînés à des corpus de domaine, évaluées sur des métriques rigoureuses, avec un travail de fond sur les mécanismes d'attention et l'étiquetage de séquences.",
        tags: ["Transformers", "BERT", "NER", "Fine-tuning"],
        article: {
          metaDescription:
            "Reconnaissance d'entités nommées avec des Transformers et des modèles BERT : étiquetage de séquences, mécanismes d'attention, fine-tuning sur corpus de domaine et protocole d'évaluation.",
          lede: "Des Transformers à la reconnaissance d'entités nommées : comment adapter un modèle pré-entraîné généraliste à un vocabulaire de domaine, et pourquoi l'évaluation est la partie la plus délicate.",
          sections: [
            {
              heading: "Reconnaître une entité, c'est étiqueter une séquence",
              paragraphs: [
                "La reconnaissance d'entités nommées consiste à repérer, dans un texte, les fragments qui désignent quelque chose de précis - une personne, une organisation, un lieu, une date - et à leur attribuer un type. Formellement, ce n'est pas une classification de phrases : c'est un étiquetage de séquence, une décision par token, avec une contrainte de cohérence entre tokens voisins.",
                "D'où le schéma d'annotation BIO, qui distingue le début d'une entité de sa suite et du reste du texte. La distinction paraît anodine ; elle est pourtant ce qui permet au modèle de reconnaître deux entités adjacentes comme deux entités, et non comme une seule.",
              ],
            },
            {
              heading: "Ce que l'attention change",
              paragraphs: [
                "Avant les Transformers, l'étiquetage de séquence s'appuyait sur des architectures récurrentes, qui traitent le texte de gauche à droite et transmettent un état d'un mot au suivant. Le contexte lointain s'y dilue à mesure qu'il remonte la chaîne.",
                "Le mécanisme d'attention remplace cette transmission en cascade par une mise en relation directe : chaque token calcule un poids vis-à-vis de tous les autres tokens de la séquence, et construit sa représentation comme une somme pondérée de ce qu'il juge pertinent. Un pronom peut ainsi aller chercher son antécédent quinze mots en arrière en une seule étape, et un mot ambigu se désambiguïser par le contexte qui l'entoure des deux côtés.",
                "Pour la NER, c'est déterminant : le même token peut être un nom de personne, une marque ou un lieu selon ce qui l'entoure, et c'est exactement ce que l'attention sait exploiter.",
              ],
            },
            {
              heading: "Du modèle pré-entraîné au modèle de domaine",
              paragraphs: [
                "BERT arrive pré-entraîné sur un corpus généraliste, avec une connaissance solide de la langue et aucune connaissance du domaine visé. Le fine-tuning consiste à poursuivre l'entraînement sur un corpus spécialisé, une tête de classification par token posée sur le modèle.",
                "Les décisions qui comptent à ce stade sont peu nombreuses mais structurantes : le taux d'apprentissage - trop élevé, il efface ce que le pré-entraînement avait acquis ; le nombre d'époques, qu'un corpus de domaine restreint sature vite ; et le traitement de la segmentation en sous-mots, puisque le tokenizer découpe les termes techniques en morceaux et qu'il faut décider comment réaligner les étiquettes sur les mots d'origine.",
              ],
            },
            {
              heading: "Évaluer sérieusement",
              paragraphs: [
                "Une NER s'évalue en précision, rappel et F1 - mais au niveau de l'entité, pas du token. La nuance n'est pas cosmétique : un modèle qui trouve trois des quatre tokens d'une entité n'a pas trouvé l'entité, il a produit une réponse fausse. Compter au token gonfle artificiellement les scores.",
                "Le rappel des classes rares mérite un suivi séparé, pour la même raison que sur des images déséquilibrées : une moyenne globale masque exactement les cas pour lesquels le système a été construit.",
              ],
            },
            {
              heading: "Ce que j'en retiens",
              paragraphs: [
                "Le fine-tuning d'un modèle pré-entraîné est rapide à mettre en œuvre et trompeusement facile à mal faire. L'essentiel du travail ne porte pas sur le modèle mais sur ce qui l'entoure : la qualité et la cohérence des annotations, l'alignement des étiquettes après tokenisation, et un protocole d'évaluation qui ne s'auto-félicite pas.",
              ],
            },
          ],
        },
      },
      {
        slug: "audio-stem-extraction",
        title: "Extraction de stems audio",
        kind: "Traitement du signal - Ingénierie",
        body: "Pipeline d'ingestion automatisé associant analyse spectrale, normalisation audio et prétraitement de la forme d'onde pour optimiser les entrées de l'inférence neuronale. Système d'inférence scalable accéléré par GPU et orchestré en serverless, dimensionné pour traiter des données audio de grande dimension à faible latence.",
        tags: ["Analyse spectrale", "GPU", "Serverless", "Faible latence"],
        article: {
          metaDescription:
            "Pipeline d'extraction de stems audio : analyse spectrale, normalisation, prétraitement de la forme d'onde, inférence accélérée par GPU et orchestration serverless à faible latence.",
          lede: "Séparer les pistes d'un morceau demande autant de travail sur le signal que sur le modèle - et autant sur l'infrastructure qui le sert. Voici comment j'ai construit le pipeline, de la forme d'onde à l'inférence serverless.",
          sections: [
            {
              heading: "Un problème de signal avant d'être un problème de modèle",
              paragraphs: [
                "Extraire les stems d'un morceau - isoler la voix, la batterie, la basse, le reste - revient à défaire une somme. Le mixage a additionné des sources ; il s'agit de retrouver les termes à partir du seul résultat. Rien ne garantit que la décomposition soit unique, et c'est précisément ce qui rend le problème intéressant.",
                "La matière première ne s'y prête pas naturellement. Une minute d'audio en qualité CD, c'est plus de deux millions et demi d'échantillons par canal : une séquence trop longue et trop peu structurée pour être présentée telle quelle à un réseau.",
              ],
            },
            {
              heading: "Passer par le spectre",
              paragraphs: [
                "L'analyse spectrale règle ce problème de représentation. La transformée de Fourier à court terme découpe le signal en fenêtres qui se chevauchent et donne, pour chacune, la répartition de l'énergie par fréquence. On obtient une image - un spectrogramme - où le temps est en abscisse, la fréquence en ordonnée et l'intensité en valeur.",
                "Ce changement de représentation a une conséquence directe : les sources deviennent visuellement séparables. Une voix, une caisse claire et une ligne de basse n'occupent ni les mêmes bandes ni les mêmes motifs temporels. Le problème de séparation redevient un problème de masquage, sur lequel les architectures convolutives sont à leur aise.",
                "Le réglage de la fenêtre est un arbitrage qu'on ne peut pas esquiver : une fenêtre longue donne une résolution fréquentielle fine mais floute les transitoires ; une fenêtre courte fait l'inverse. Les percussions et les nappes harmoniques ne demandent pas le même compromis.",
              ],
            },
            {
              heading: "Normaliser avant d'inférer",
              paragraphs: [
                "Les fichiers qui entrent dans le pipeline n'ont rien en commun : fréquences d'échantillonnage différentes, mono ou stéréo, niveaux qui vont du master compressé à la maquette enregistrée trop bas. Un modèle entraîné sur des entrées calibrées se dégrade dès que cette calibration n'est plus respectée.",
                "Le prétraitement remet donc tout à plat - rééchantillonnage, gestion des canaux, normalisation du niveau - avant tout découpage. C'est la partie la moins spectaculaire du pipeline, et celle dont dépend la reproductibilité des résultats.",
              ],
            },
            {
              heading: "Servir l'inférence",
              paragraphs: [
                "Un spectrogramme est un tenseur dense et la séparation de sources est un calcul lourd : le GPU n'est pas une optimisation, c'est la condition pour rester sous un temps de réponse acceptable.",
                "L'orchestration serverless répond à un autre problème : la charge est intermittente. Des pics quand des fichiers arrivent, rien entre deux. Un GPU réservé en permanence coûterait cher à ne rien faire ; un dimensionnement à la demande fait porter le coût sur le traitement réel, au prix d'un démarrage à froid qu'il faut contenir.",
                "Le découpage du morceau en segments traités en parallèle, puis recombinés, est ce qui permet de tenir la latence sur des fichiers longs - à condition de prévoir un recouvrement entre segments pour que les raccords ne s'entendent pas.",
              ],
            },
            {
              heading: "Ce que j'en retiens",
              paragraphs: [
                "Sur une chaîne de ce type, le modèle est rarement le goulot d'étranglement. Ce sont les entrées-sorties, la préparation du signal et la façon dont on découpe le travail qui décident du temps de réponse réel.",
                "Et le choix de la représentation reste la décision la plus structurante du projet : tout ce qui vient après - architecture, découpage, post-traitement - en découle.",
              ],
            },
          ],
        },
      },
    ] as ResearchProject[],
  },

  /** Chrome des pages d'article, qui n'ont ni sommaire ni sections ancrées. */
  article: {
    backToProjects: "Retour aux projets",
    home: "Accueil",
    otherProjects: "Autres travaux de recherche",
  },

  contact: {
    eyebrow: "Contact",
    title: "Me contacter.",
    paragraphs: [
      "Je suis ouvert aux échanges sur l'IA en production : agents, GenAI appliquée, pipelines de données et MLOps.",
      "Une question, un projet, ou simplement l'envie de discuter d'un sujet technique - écrivez-moi, je réponds.",
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
    title: "Hichem Gouia - AI Engineer",
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
    location: "Paris",
    status: "AI Solution Engineer",
    title: "Passionate about AI, computer science and new technologies.",
    intro:
      "AI Engineer specialising in harness, agentic, GenAI, NLP and computer vision. I design the models as much as the data pipelines and the deployment chain that carry them all the way to users.",
    ctaJourney: "See my background",
    ctaResume: "Download my resume",
    ctaContact: "Get in touch",
  },

  about: {
    eyebrow: "About",
    title: "Background.",
    paragraphs: [
      "I'm an AI Solution Engineer, currently based in Paris.",
      "Starting from the business need, I design and ship ML/DL and generative AI systems, along with the data pipelines that feed them.",
      "Pragmatic by nature, framing what each project actually needs and communicating around it are my main strengths, before writing or deploying any code.",
    ],
    awardLabel: "Award",
    award: "MasterDevFrance 2025 finalist - AI & algorithm hackathons",
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
          "Designed an automated web-scraping ingestion pipeline for real-estate listings - raw ingestion, cleaning, normalisation, scalable storage - producing consistent datasets for analytics and modelling.",
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
        role: "Master in Computer Science - Applied AI & Data",
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
      {
        period: "Sept. 2021 – Aug. 2022",
        role: "Bachelor Web and App",
        org: "CCI des Vosges",
        note: "Épinal",
        focus: "An intensive programme on web and application development and architecture.",
        highlights: [
          "Core topics: algorithms, full-stack development (front end, back end), deployment, security, design patterns.",
          "Practical projects: end-to-end delivery of websites (e-commerce site, showcase site, mobile app).",
        ],
        themes: ["Front-end", "Back-end", "Javascript", "PHP"],
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
    readArticle: "Read the write-up",
    items: [
      {
        slug: "skin-lesion-classification",
        title: "Automated Skin Lesion Classification",
        kind: "Computer Vision - Research",
        body: "A comparative analysis of CNN architectures (EfficientNet vs. ResNet) using transfer learning to classify skin pathologies from clinical imagery. Engineered a robust preprocessing pipeline - stain normalisation, advanced data augmentation - designed to mitigate dataset imbalance and overfitting.",
        tags: ["EfficientNet", "ResNet", "Transfer learning", "Augmentation"],
        article: {
          metaDescription:
            "A comparative EfficientNet / ResNet analysis using transfer learning for skin lesion classification: framing the problem, stain normalisation, data augmentation and handling class imbalance.",
          lede: "Comparing two families of convolutional networks on clinical imagery mostly teaches you that the architecture is not the variable that matters most. Here is the path I took, from framing the problem to the preprocessing pipeline.",
          sections: [
            {
              heading: "The problem",
              paragraphs: [
                "Classifying skin pathologies from clinical images means asking a model to separate classes that, to the naked eye, look a great deal alike. Two lesions of very different natures can share a shape, a border and a tone; conversely, the same pathology changes appearance with skin tone, lighting and whichever device took the photograph.",
                "On top of that sits the constraint that shapes everything else: clinical datasets are imbalanced. Common cases numerically overwhelm rare ones, and the rare ones are precisely what matters. A model that naively optimises overall accuracy learns very quickly to ignore minority classes - and posts a flattering score that says nothing about how useful it actually is.",
              ],
            },
            {
              heading: "Why start from pre-trained models",
              paragraphs: [
                "Training a deep convolutional network from scratch assumes a volume of annotated data that clinical imagery does not provide. Transfer learning works around that: you take a network already trained on a general-purpose corpus, keep the early layers - which learned low-level patterns, edges, textures, gradients, valid well beyond their original domain - and relearn the upper layers on the images you care about.",
                "The remaining choice is how deep to unfreeze: everything frozen except the classification head, or let the last convolutional blocks breathe. The more you unfreeze, the more the model adapts to the domain, and the more it risks overfitting a small dataset. It is a dial to tune, not a box to tick.",
              ],
            },
            {
              heading: "EfficientNet against ResNet",
              paragraphs: [
                "Both architectures answer the same question - how do you gain depth without training degrading - in two different ways. ResNet introduces residual connections: each block learns a difference from its input rather than a full transformation, which lets the gradient travel back intact through dozens of layers.",
                "EfficientNet starts from another observation: depth, width and input resolution cannot be tuned independently. Its compound scaling grows them together at a fixed ratio, which yields distinctly leaner models at a comparable parameter budget.",
                "So the comparison is not a matter of which one posts the better score. Under an identical protocol - same data, same augmentations, same unfreezing strategy - it is about behaviour: convergence speed, hyperparameter sensitivity, inference cost, and above all how each holds up on minority classes rather than on the average.",
              ],
            },
            {
              heading: "Preprocessing, where it is really decided",
              paragraphs: [
                "Stain normalisation addresses a well-documented nuisance in medical imaging: from one centre to another, from one device to another, the same tissue does not render the same way. Without correction, the network learns the device signature alongside the pathology, and collapses the moment you show it a source it has never seen.",
                "Advanced data augmentation plays on a different register. Rotations, flips, crops, brightness and contrast shifts: the aim is to manufacture plausible variability, the kind you would genuinely meet in a clinical setting, without inventing images no patient would ever produce. On rare classes, augmentation does double duty - it regularises and it rebalances.",
                "Imbalance is handled in parallel, at the sampling level and in the loss function, so that an error on a rare class weighs what it should instead of dissolving into the mass.",
              ],
            },
            {
              heading: "What this work taught me",
              paragraphs: [
                "The reflex on this kind of problem is to hunt for the winning architecture. Experience leads elsewhere: with the dataset held constant, the preprocessing pipeline and the way imbalance is handled move results more than switching from one family of networks to another.",
                "The other lesson is about metrics. Overall accuracy is a poor compass on imbalanced data; you have to look at the classes one by one, confusion matrix in hand, and accept that a model that is worse on average may be the right choice if it holds up on what counts.",
              ],
            },
          ],
        },
      },
      {
        slug: "ner-language-modeling",
        title: "Advanced NER & Language Modeling",
        kind: "NLP - Research",
        body: "Explored and implemented state-of-the-art NLP architectures, focusing on Transformers and BERT-based models for Named Entity Recognition. Ran transfer learning and fine-tuning experiments to adapt pre-trained models to domain-specific datasets, evaluated against rigorous NLP metrics, with deep work on attention mechanisms and sequence labeling.",
        tags: ["Transformers", "BERT", "NER", "Fine-tuning"],
        article: {
          metaDescription:
            "Named Entity Recognition with Transformers and BERT-based models: sequence labeling, attention mechanisms, fine-tuning on domain corpora and a serious evaluation protocol.",
          lede: "From Transformers to Named Entity Recognition: how you adapt a general-purpose pre-trained model to a domain vocabulary, and why evaluation is the trickiest part.",
          sections: [
            {
              heading: "Recognising an entity is labeling a sequence",
              paragraphs: [
                "Named Entity Recognition means spotting, inside a text, the fragments that designate something specific - a person, an organisation, a place, a date - and assigning each a type. Formally it is not sentence classification: it is sequence labeling, one decision per token, with a consistency constraint between neighbouring tokens.",
                "Hence the BIO annotation scheme, which separates the beginning of an entity from its continuation and from the rest of the text. The distinction looks trivial; it is what lets the model recognise two adjacent entities as two entities rather than one.",
              ],
            },
            {
              heading: "What attention changes",
              paragraphs: [
                "Before Transformers, sequence labeling relied on recurrent architectures, which read text left to right and pass a state from one word to the next. Distant context dilutes as it travels along that chain.",
                "The attention mechanism replaces that cascade with a direct relation: each token computes a weight against every other token in the sequence, and builds its representation as a weighted sum of whatever it judges relevant. A pronoun can reach its antecedent fifteen words back in a single step, and an ambiguous word can be disambiguated by the context surrounding it on both sides.",
                "For NER this is decisive: the same token can be a person's name, a brand or a place depending on what surrounds it, and that is exactly what attention is good at exploiting.",
              ],
            },
            {
              heading: "From pre-trained model to domain model",
              paragraphs: [
                "BERT arrives pre-trained on a general-purpose corpus, with a solid grasp of the language and no knowledge whatsoever of the target domain. Fine-tuning means continuing training on a specialised corpus, with a per-token classification head placed on top of the model.",
                "The decisions that matter at this stage are few but structural: the learning rate - too high and it erases what pre-training acquired; the number of epochs, which a small domain corpus saturates quickly; and how to handle subword segmentation, since the tokenizer splits technical terms into pieces and you have to decide how to realign labels onto the original words.",
              ],
            },
            {
              heading: "Evaluating seriously",
              paragraphs: [
                "NER is evaluated with precision, recall and F1 - but at the entity level, not the token level. The nuance is not cosmetic: a model that finds three of an entity's four tokens has not found the entity, it has produced a wrong answer. Counting per token inflates scores artificially.",
                "Recall on rare classes deserves separate tracking, for the same reason as on imbalanced images: a global average hides exactly the cases the system was built for.",
              ],
            },
            {
              heading: "What I take away",
              paragraphs: [
                "Fine-tuning a pre-trained model is quick to set up and deceptively easy to get wrong. Most of the work is not about the model but about what surrounds it: the quality and consistency of the annotations, label alignment after tokenisation, and an evaluation protocol that does not congratulate itself.",
              ],
            },
          ],
        },
      },
      {
        slug: "audio-stem-extraction",
        title: "Audio Stem Extraction",
        kind: "Signal Processing - Engineering",
        body: "An automated ingestion pipeline combining spectral analysis, audio normalisation and waveform preprocessing to optimise inputs for neural inference. A scalable, GPU-accelerated inference system orchestrated serverless, sized to handle high-dimensional audio data at low latency.",
        tags: ["Spectral analysis", "GPU", "Serverless", "Low latency"],
        article: {
          metaDescription:
            "An audio stem extraction pipeline: spectral analysis, normalisation, waveform preprocessing, GPU-accelerated inference and serverless orchestration at low latency.",
          lede: "Separating the tracks of a song takes as much work on the signal as on the model - and as much again on the infrastructure that serves it. Here is how I built the pipeline, from waveform to serverless inference.",
          sections: [
            {
              heading: "A signal problem before it is a model problem",
              paragraphs: [
                "Extracting a song's stems - isolating vocals, drums, bass, the rest - amounts to undoing a sum. The mix added sources together; the job is to recover the terms from the result alone. Nothing guarantees the decomposition is unique, and that is exactly what makes the problem interesting.",
                "The raw material does not lend itself to this. One minute of CD-quality audio is more than two and a half million samples per channel: a sequence too long and too weakly structured to be handed to a network as is.",
              ],
            },
            {
              heading: "Going through the spectrum",
              paragraphs: [
                "Spectral analysis solves that representation problem. The short-time Fourier transform cuts the signal into overlapping windows and gives, for each one, how energy is distributed across frequency. What you get is an image - a spectrogram - with time on the x axis, frequency on the y axis and intensity as the value.",
                "That change of representation has a direct consequence: the sources become visually separable. A voice, a snare and a bass line occupy neither the same bands nor the same temporal patterns. Separation turns back into a masking problem, which convolutional architectures are comfortable with.",
                "Choosing the window is a trade-off you cannot dodge: a long window gives fine frequency resolution but smears transients; a short window does the opposite. Percussion and sustained harmonic material do not call for the same compromise.",
              ],
            },
            {
              heading: "Normalise before inferring",
              paragraphs: [
                "The files entering the pipeline have nothing in common: different sample rates, mono or stereo, levels ranging from a compressed master to a demo recorded far too quietly. A model trained on calibrated inputs degrades as soon as that calibration no longer holds.",
                "So preprocessing levels everything first - resampling, channel handling, level normalisation - before any chunking. It is the least spectacular part of the pipeline, and the part reproducibility depends on.",
              ],
            },
            {
              heading: "Serving inference",
              paragraphs: [
                "A spectrogram is a dense tensor and source separation is heavy compute: the GPU is not an optimisation, it is the condition for staying under an acceptable response time.",
                "Serverless orchestration answers a different problem: the load is intermittent. Spikes when files arrive, nothing in between. A permanently reserved GPU would be expensive idle time; sizing on demand puts the cost on actual processing, at the price of a cold start you have to keep in check.",
                "Splitting the track into segments processed in parallel, then recombined, is what keeps latency in hand on long files - provided you plan an overlap between segments so the joins cannot be heard.",
              ],
            },
            {
              heading: "What I take away",
              paragraphs: [
                "On a chain like this, the model is rarely the bottleneck. I/O, signal preparation and how the work is split are what decide the real response time.",
                "And the choice of representation remains the most structural decision in the project: everything that follows - architecture, chunking, post-processing - flows from it.",
              ],
            },
          ],
        },
      },
    ] as ResearchProject[],
  },

  article: {
    backToProjects: "Back to projects",
    home: "Home",
    otherProjects: "Other research work",
  },

  contact: {
    eyebrow: "Contact",
    title: "Get in touch.",
    paragraphs: [
      "I'm happy to talk about AI in production: agents, applied GenAI, data pipelines and MLOps.",
      "A question, a project, or simply the urge to dig into a technical topic - write to me, I answer.",
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

/** URL absolue de la page d'accueil dans une langue - utilisée par hreflang et le sitemap. */
export function urlForLang(lang: Lang): string {
  return lang === DEFAULT_LANG ? `${SITE_URL}/` : `${SITE_URL}/?lang=${lang}`;
}

/** Chemin d'un article, sans le domaine : ce que consomment les `Link`. */
export function pathForArticle(slug: string): string {
  return `/research/${slug}`;
}

/** URL absolue d'un article dans une langue - hreflang, canonical et sitemap. */
export function urlForArticle(lang: Lang, slug: string): string {
  const base = `${SITE_URL}${pathForArticle(slug)}`;
  return lang === DEFAULT_LANG ? base : `${base}?lang=${lang}`;
}

/**
 * Les slugs publiés, dans l'ordre d'affichage. Lus sur `fr` : les deux langues
 * partagent les mêmes slugs, et le typage de `en` garantit qu'aucune traduction
 * ne manque.
 */
export const RESEARCH_SLUGS: string[] = fr.projects.items.map((item) => item.slug);

/** `undefined` si le slug n'existe pas : la route répond alors 404. */
export function findResearchProject(lang: Lang, slug: string): ResearchProject | undefined {
  return CONTENT[lang].projects.items.find((item) => item.slug === slug);
}

export const LINKS = {
  email: "contact.hichemgouia@gmail.com",
  linkedin: "https://www.linkedin.com/in/hichem-gouia/",
  github: "https://github.com/iamhmh",
  resume: "/Hichem_Gouia_AI_Engineer.pdf",
};
