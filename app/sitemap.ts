import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";
import { getBlogPosts } from "@/lib/data/blogPosts";
import { getServices } from "@/lib/data/services";

/**
 * `/sitemap.xml`: páginas fixas + uma entrada por serviço publicado (mesma
 * fonte de `generateStaticParams` em `app/servicos/[slug]/page.tsx`, então
 * serviço novo no admin entra aqui sozinho).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([getServices(), getBlogPosts()]);

  const fixed: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/servicos`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/equipe`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contato`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/servicos/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.published_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...fixed, ...serviceEntries, ...postEntries];
}
