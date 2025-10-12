import json from './frontmatter.json'
import { getCollection } from "astro:content";
const articles = await getCollection('articles');
let frontmatter = json;
articles.map((article) => {
    frontmatter[article.slug.split('/')[0]]['article/'+article.slug.split('/')[2]] = {
        title: article.data.title,
        description: article.data.description,
        image:'/images/contenido/'+article.slug.split('/')[2]+'/portada.webp'
    }
})
const prerender = true;
export {frontmatter, prerender};