export interface ExternalPost {
  title: string;
  date: string;
  excerpt: string;
  href: string;
  source: string;
}

export type Block =
  | string
  | { heading: string }
  | { list: string[] }
  | { image: string; alt: string; caption?: string };

export interface InternalPost {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  body: Block[];
}

export type Post = ExternalPost | InternalPost;

export function isInternal(post: Post): post is InternalPost {
  return "slug" in post;
}

// ---------------------------------------------------------------------------
// Vos articles.
//
// Deux types de posts sont supportés :
//  - InternalPost : hébergé sur le site, avec un `slug` et un `body`.
//    Accessible sur /writing/<slug> et listé dans le sitemap.
//  - ExternalPost : simple lien sortant (`href` + `source`), ex. un post
//    LinkedIn, un article Medium ou dev.to.
//
// Le `body` d'un post interne est un tableau de blocs :
//  - "texte"                       → un paragraphe (markdown inline : **gras**,
//                                    *italique*, [lien](https://...))
//  - { heading: "Titre" }          → un sous-titre h2
//  - { list: ["a", "b"] }          → une liste à puces
//  - { image: "CLE", alt, caption }→ une image ; "CLE" est résolue via la map
//                                    IMAGES dans src/routes/writing.$slug.tsx
// ---------------------------------------------------------------------------
export const POSTS: Post[] = [
  {
    title: "Titre de votre premier article",
    date: "Jan 2026",
    excerpt:
      "Un résumé de deux ou trois lignes qui donne envie de lire l'article. C'est ce texte qui apparaît dans la liste sur la page d'accueil et dans les aperçus de partage.",
    slug: "premier-article",
    body: [
      "Premier paragraphe d'introduction. Posez le contexte : quel problème vous avez rencontré, pourquoi il vous a intéressé, ce que le lecteur va apprendre.",
      { heading: "Un sous-titre" },
      "Vous pouvez mettre du texte **en gras**, du texte *en italique*, et des [liens externes](https://example.com) directement dans vos paragraphes.",
      "Un deuxième paragraphe pour développer l'idée.",
      {
        list: [
          "Un premier point de liste",
          "Un deuxième point de liste",
          "Un troisième point de liste",
        ],
      },
      { heading: "Un autre sous-titre" },
      "Vous pouvez illustrer un passage avec une image. La clé ci-dessous est résolue via la map IMAGES dans src/routes/writing.$slug.tsx.",
      {
        image: "ILLUSTRATION",
        alt: "Décrivez ici le contenu de l'image pour l'accessibilité et le référencement.",
        caption: "Figure 1. Une légende optionnelle sous l'image.",
      },
      "Un paragraphe de conclusion.",
      { heading: "Références" },
      "Nom, P. (2026). *Titre de la source*. [https://example.com](https://example.com)",
    ],
  },
  {
    title: "Titre de votre second article",
    date: "Déc 2025",
    excerpt:
      "Un second article hébergé sur le site, pour montrer comment la liste se comporte avec plusieurs entrées.",
    slug: "second-article",
    body: [
      "Le corps de votre second article. Dupliquez ce bloc autant de fois que nécessaire.",
      { heading: "Une section" },
      "Du contenu.",
    ],
  },
  {
    title: "Un article publié ailleurs",
    date: "Nov 2025",
    excerpt:
      "Exemple de post externe : il n'a pas de page sur le site, le lien renvoie directement vers la plateforme d'origine.",
    href: "https://www.linkedin.com/in/votre-profil/",
    source: "LinkedIn",
  },
];
