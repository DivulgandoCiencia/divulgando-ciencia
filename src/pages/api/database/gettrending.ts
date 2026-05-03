import type { APIRoute } from 'astro';
import { getTrending } from '../../../lib/analytics';
import { getCollection } from 'astro:content';
import { experimental_AstroContainer } from "astro/container";
import ArticleCard from "../../../components/home/ArticleCard.astro";

const container = await experimental_AstroContainer.create();

const articles = (await getCollection('articles'));
const articlesData = articles.map(article => {
    return {
        slug: article.id,
        body: article.body,
        ...article.data,
    };
});
articlesData.sort((a, b) => b.date.getTime() - a.date.getTime());

export const GET: APIRoute = async ({ request }) => {
    const trending = await getTrending(5);
    return new Response(JSON.stringify(trending), { status: 200 });
}

export const POST: APIRoute = async ({ request }) => {
    const {lang} = await request.json();
    const trending = await getTrending(5);
    let articlesFiltered = articlesData.filter(({slug}) => slug.split('/')[0] === lang && trending.includes(slug.split('/')[1])); 
    articlesFiltered.push(...articlesData.filter(({slug}) => slug.split('/')[0] === lang && !trending.includes(slug.split('/')[1])).slice(0,5-articlesFiltered.length));
    articlesFiltered.sort((a, b) => b.date.getTime() - a.date.getTime());
    const trendingArticles = await Promise.all(articlesFiltered.map(async (article) => (await container.renderToString(ArticleCard, {props:{...article, lang:lang}}))))
    return new Response(JSON.stringify({trendingArticles: trendingArticles.join('')}), { status: 200 });
}
