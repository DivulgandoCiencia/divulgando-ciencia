import { registerView } from "../../../../../lib/analytics";

export const prerender = false;

export const GET = async ({ params, request }) => {
    const { slug, lang } = params;

    const origin = new URL(request.url).origin;
    const internalUrl = `${origin}/api/intern/content/${lang}/article/${slug}`;

    try {
        const resp = await fetch(internalUrl, { method: 'GET', headers: { 'x-internal-proxy': '1' } });
        if (!resp.ok) {
            return new Response(await resp.text(), { status: resp.status, headers: { 'content-type': resp.headers.get('content-type') || 'text/plain' } });
        }

        const data = await resp.json();

        // Register view server-side (non-blocking for the response)
        try {
            await registerView(slug, { title: data.articleTitle, author: data.authorData?.[0] });
        } catch (e) {
            console.warn('Proxy: failed to register view', e);
        }

        return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
    } catch (e) {
        console.error('Proxy: failed to fetch internal article', e);
        return new Response('Bad Gateway', { status: 502 });
    }
};
