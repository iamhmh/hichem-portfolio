import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { POSTS, isInternal, type InternalPost, type Block } from "@/lib/writing";
import illustration from "@/assets/illustration.svg";

// Les clés utilisées dans les blocs `image` de src/lib/writing.ts sont résolues ici.
// Déposez vos images dans src/assets/, importez-les en haut du fichier, puis
// ajoutez une entrée. Un bloc peut aussi contenir une URL absolue directement.
const IMAGES: Record<string, string> = {
  ILLUSTRATION: illustration,
};

const INLINE_RE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

function renderInline(text: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] && match[2]) {
      nodes.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-border transition hover:decoration-foreground"
        >
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      nodes.push(<strong key={match.index} className="font-semibold text-foreground">{match[3]}</strong>);
    } else if (match[4]) {
      nodes.push(<em key={match.index}>{match[4]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const post = POSTS.filter(isInternal).find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article introuvable — Hichem Gouia" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData as { post: InternalPost };
    const title = `${post.title} — Hichem Gouia`;
    const socialImage = "https://hichemgouia.com/social-preview.png?v=1";
    return {
      meta: [
        { title },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:image", content: socialImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: socialImage },
      ],
    };
  },
  errorComponent: PostError,
  notFoundComponent: PostNotFound,
  component: PostPage,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-xs font-semibold">
              HG
            </span>
            <span className="text-foreground/90">Hichem Gouia</span>
          </Link>
          <Link
            to="/"
            hash="writing"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour aux écrits
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">{children}</main>
    </div>
  );
}

function PostPage() {
  const { post } = Route.useLoaderData() as { post: InternalPost };
  return (
    <Shell>
      <article>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {post.date}
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
          {post.body.map((block: Block, i: number) => {
            if (typeof block === "string") return <p key={i}>{renderInline(block)}</p>;
            if ("list" in block) {
              return (
                <ul key={i} className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
                  {block.list.map((item: string, j: number) => (
                    <li key={j}>{renderInline(item)}</li>
                  ))}
                </ul>
              );
            }
            if ("heading" in block) {
              return (
                <h2
                  key={i}
                  className="!mt-12 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                >
                  {block.heading}
                </h2>
              );
            }
            return (
              <figure key={i} className="!mt-10 space-y-3">
                <img
                  src={IMAGES[block.image] ?? block.image}
                  alt={block.alt}
                  loading="lazy"
                  className="w-full rounded-lg border border-border bg-card"
                />
                {block.caption ? (
                  <figcaption className="text-sm leading-relaxed text-muted-foreground">
                    {renderInline(block.caption)}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </article>
    </Shell>
  );
}

function PostNotFound() {
  return (
    <Shell>
      <h1 className="text-2xl font-semibold tracking-tight">Article introuvable</h1>
      <p className="mt-3 text-muted-foreground">
        Cet article n'existe pas ou a été déplacé.
      </p>
    </Shell>
  );
}

function PostError() {
  return (
    <Shell>
      <h1 className="text-2xl font-semibold tracking-tight">Une erreur est survenue</h1>
      <p className="mt-3 text-muted-foreground">Veuillez réessayer plus tard.</p>
    </Shell>
  );
}
