import json from './frontmatter.json'
import { getCollection } from "astro:content";
const articles = await getCollection('articles');
let frontmatter = json as any;
articles.map((article) => {
    frontmatter[article.id.split('/')[0]]['article/'+article.id.split('/')[2]] = {
        title: article.data.title,
        description: article.data.description,
        image:'/images/contenido/'+article.id.split('/')[2]+'/portada.webp',
        date: article.data.date,
        author: article.data.author
    }
})
const prerender = true;
export {frontmatter, prerender};