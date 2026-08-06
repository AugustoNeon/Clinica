import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Convencao legada `middleware.ts` (nao `proxy.ts`) de proposito: o Next 16
// diz que `proxy.ts` SEMPRE roda em runtime Node.js ("Proxy always runs on
// Node.js runtime"), e o adaptador @opennextjs/cloudflare (alvo de deploy
// desta app) recusa Node.js middleware. `middleware.ts` ainda aceita
// `runtime: "edge"` explicito, que e o que o Cloudflare Workers suporta.
export const config = {
  matcher: ["/admin/:path*"],
  runtime: "experimental-edge",
};
