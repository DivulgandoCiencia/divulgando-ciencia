import { getCollection } from "astro:content";
import { experimental_AstroContainer } from "astro/container";
import FeaturedArticleCard from "../../../components/home/FeaturedArticleCard.astro";
import ArticleCard from "../../../components/home/ArticleCard.astro";

const lang = 'es';
const articles = (await getCollection('articles')).filter(({slug}) => slug.split('/')[0] === lang);
const articlesData = articles.map(article => {
    // Handle both author and authors fields
    return {
        slug: article.slug,
        body: article.body,
        ...article.data,
    };
});
articlesData.sort((a, b) => b.date.getTime() - a.date.getTime());
const container = await experimental_AstroContainer.create();


export const prerender = true;

export const GET = async ({}) => {
    const featuredArticles = await Promise.all(articlesData.slice(0,3).map(async article => (await container.renderToString(FeaturedArticleCard, {props: {slug:article.slug, body:article.body, title:article.title, description:article.description, author:article.author, authors:article.authors, date:article.date}}))))
    const recentArticles = await Promise.all(articlesData.slice(0,6).map(async (article) => (await container.renderToString(ArticleCard, {props:{...article}}))))

    return new Response(
        JSON.stringify({
            featuredArticles: featuredArticles.join(''),
            recentArticles: recentArticles.join(''),
        }),
    );
}