import { frontmatter } from "@/json/frontmatter";
const base = "https://www.divulgandociencia.com";
const baseen = "https://en.divulgandociencia.com"

const urls: string[] = [];

for (const lang of Object.keys(frontmatter)) {
    for (const page of Object.keys(frontmatter[lang])) {
        if (page === "404") continue;
        urls.push(`${lang == 'es' ? base : baseen}/${page === "home" ? "" : page}`);
    }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
        (url) => `  <url>
        <loc>${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>${url.includes("/articles/") ? "0.7" : "1.0"}</priority>
    </url>`
    )
    .join("\n")}
</urlset>`;


export async function GET() {
    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
