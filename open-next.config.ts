import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sem cache incremental (R2) configurado de proposito: nenhuma pagina usa
// revalidate/ISR hoje. Ver wrangler.jsonc e AGENTS.md "Decisoes fechadas"
// (2026-08-04).
export default defineCloudflareConfig();
