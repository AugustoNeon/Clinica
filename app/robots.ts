import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";

/**
 * `/robots.txt`. Indexação liberada desde 2026-08-12 (issue #52); `/admin`
 * fica fora do índice aqui E via `robots: noindex` em `app/admin/layout.tsx`
 * (defesa em dupla: robots.txt é sugestão, a meta tag é ordem).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
