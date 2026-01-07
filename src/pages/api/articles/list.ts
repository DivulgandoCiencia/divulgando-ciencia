import { getCollection } from 'astro:content';
import { type APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    const articles = (await getCollection('articles'))
    if (!articles || articles.length === 0) return new Response(JSON.stringify({ error: 'Article not found' }), { status: 404 });
    let slugs = articles.map((item) => {
        return {
            slug: item.slug.split('/')[2],
            title: item.data.title,
            description: item.data.description,
            lang: item.id.split('/')[0],
        }
    })

    let response = {'es': slugs.filter((item) => item.lang === 'es').map((item) => {return {slug: item.slug, title: item.title, description: item.description}}),
                    'en': slugs.filter((item) => item.lang === 'en').map((item) => {return {slug: item.slug, title: item.title, description: item.description}})}

    return new Response(JSON.stringify({'data':response}), { status: 200});
}
