import { getCollection, render, getEntry } from 'astro:content';
import { type APIRoute } from 'astro';
import { clientTranslations } from '../../../../i18n';

export const GET: APIRoute = async ({ request }) => {
    const article = (await getCollection('articles')).filter(({slug}) => slug.split('/')[2] == request.url.split('/')[request.url.split('/').length - 1] );
    if (!article || article.length === 0) return new Response(JSON.stringify({ error: 'Article not found' }), { status: 404 });

    let response = article.map((item) => {
        return {
            title: item.data.title,
            description: item.data.description,
            lang: item.id.split('/')[0],
            body: item.body,
        }
    })

    return new Response(JSON.stringify({'data':response}), { status: 200});
}

