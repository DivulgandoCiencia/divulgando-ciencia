import { getCollection } from "astro:content";
import { experimental_AstroContainer } from "astro/container";
import { getContainerRenderer as mdxContainerRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import { clientTranslations } from "../../../../../i18n";

const articles = await getCollection("articles");
const authorCollection = await getCollection("authors");
const renderers = await loadRenderers([mdxContainerRenderer()]);
const container = experimental_AstroContainer.create({renderers});

import { ScienceList } from "../../../../../components/Science"
import { calcReadTime } from '../../../../../components/readTime';

export const prerender = true;

export function getStaticPaths() {
    let paths = [];
    for (const lang of ['es','en']) {
        for (const article of articles) {
            if (article.slug.split('/')[0] === lang) {
                paths.push({ params: { lang: lang, slug: article.slug.split('/')[2] } });
            }
        }
    } 
    return paths;
}

export const GET = async ({ params }) => {
    const { slug, lang } = params;
    const t = clientTranslations[lang];

    const article = articles.find(a => a.slug.split('/')[2] === slug);

    if (!article) {
        return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    const html = await (await container).renderToString((await article.render()).Content);
    const science = ScienceList.filter(({id}) => article.slug.split('/')[1] == id)[0];

    const author = article.data.author ? (await authorCollection.find(a => a.id === article.data.author.id)).data : undefined;
    let authors = []; if (article.data.authors?.length > 1) {article.data.authors?.map(async(a) => {authors.push([(await authorCollection.find(b => b.id === a.id)).data, a.id])})}

    const authorsHeaderHTML = article.data.authors?.length > 1 ? (
        `<div class='relative flex items-center'>
            <div class="flex -space-x-4">
                ${authors.slice(0, 3).map((author, index) => (
                    `<div class="author-avatar-wrapper relative group">
                        <img src=${author.avatar || "/placeholder.svg?height=50&width=50"} alt=${author.name} class="h-12 w-12 rounded-full object-cover border-2 border-background shadow-sm transition-transform hover:z-10 hover:scale-110" style='z-index: ${authors.slice(0, 3).length - index}'/>
                        <div class="author-tooltip opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-1/2 bottom-full mb-2 -translate-x-1/2 min-w-[200px] bg-card border rounded-lg shadow-lg p-3 transition-all duration-200 z-20">
                            <div class="flex items-start gap-3">
                                <img src=${author.avatar || "/placeholder.svg?height=50&width=50"} alt=${author.name} class="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                                <div>
                                    <div class="font-medium">${author.name}</div>
                                    <div class="text-xs text-muted-foreground">${author.title}</div>
                                    <div class="text-xs text-muted-foreground">${author.institution}</div>
                                </div>
                            </div>
                            ${author.bio && (`<p class="text-xs text-muted-foreground mt-2 line-clamp-3">${author.bio}</p>`)}
                            <div class="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r border-b rotate-45"></div>
                        </div>
                    </div>`
                )).join('\n')}

                ${Math.max(0, authors.length - 3) > 0 && (
                    `<div class="h-12 w-12 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-sm font-medium text-primary shadow-sm z-0">
                        +${Math.max(0, authors.length - 3)}
                    </div>`
                )}
            </div>
            <div class="ml-4"><span class="text-sm font-medium">${authors.length === 1 ? authors[0].name : authors.length === 2 ? `${authors[0].name} ${t.common.and} ${authors[1].name}`: `${authors[0].name} ${t.common.and} ${authors.length - 1} ${t.common.more}`}</span></div>
        </div>
        <style>
            .author-tooltip {
                pointer-events: none;
            }
            .author-avatar-wrapper:hover .author-tooltip {
                pointer-events: auto;
            }
        </style>
        `
    ) : (
        `<div class="flex items-center gap-3">
            <img src=${"/images/autores/" + article.data.author.id + ".webp" || "/placeholder.svg"} alt=${author.name} class="h-12 w-12 rounded-full object-cover"/>
            <div>
                <div class="font-medium">${author.name}</div>
                <div class="text-sm text-muted-foreground flex"><Icon icon="calendar" className="mr-1 h-4 w-4 mt-0.5" /> ${article.data.date.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
        </div>`
    )

    const authorsHTML = article.data.authors?.length > 1 ? (
        `<div class="rounded-xl border bg-card p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <h3 class="text-lg font-semibold mb-4">About the Authors</h3>
            <div class="space-y-6">
                ${authors.map(author => (
                    `<div class="flex items-start gap-4">
                        <img 
                            src=${"/images/autores/" + author[1] + ".webp" || "/placeholder.svg"}
                            alt=${author[0].name}
                            class="h-16 w-16 rounded-full object-cover shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        />
                        <div>
                            <div class="font-medium">${author[0].name}</div>
                            <div class="text-sm text-muted-foreground">title</div>
                            <div class="text-sm text-muted-foreground">institution</div>
                            ${author.bio && `<p class="text-sm text-muted-foreground mt-1">${author[0].bio}</p>`}
                        </div>
                    </div>`
                )).join('\n')}
            </div>
        </div>`
    ) : (
        `<div class="rounded-xl border bg-card p-6">
            <h3 class="text-lg font-semibold mb-4">${t.article.aboutAuthor}</h3>
            <div class="flex items-center gap-4 mb-4">
                <img src=${"/images/autores/" + article.data.author.id + ".webp" || "/placeholder.svg"} alt=${author.name} class="h-16 w-16 rounded-full object-cover"/>
                <div>
                    <div class="text-3xl hidden"></div>
                    <div class=${"font-medium text-" + (author.social_media === undefined ? 'xl' : 'base')}>${author.name}</div>
                    <div class="text-sm text-muted-foreground">${author.bio || t.articles.defaultBio}</div>    
                </div>
            </div>
        </div>`
    )

    const tags = article.data.tags ? article.data.tags.map(tag => (`<a href={"/articles?page=1&tags=${tag.toLowerCase().replace(/\s+/g, '-')}"} class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-all hover:scale-105">${tag}</a>`)).join("\n") : "<div/>"
    const references = article.data.references ? article.data.references.map(ref => (
        `<li class="border-l-2 border-primary/30 pl-4 py-1 hover:border-primary transition-colors">
            <p class="font-medium">${ref.title}</p>
            <p class="text-muted-foreground">${ref.authors}. <em>${ref.journal}</em>, ${ref.year}.</p>
            <p class="text-primary hover:underline"><a href={'https://doi.org/${ref.doi}'} target="_blank" rel="noopener noreferrer">DOI: ${ref.doi}</a></p>
        </li>`
    )).join('\n') : "<div/>"

    //Related Articles
    let articlesL = [];
    function pushIfNotIncluded (arts: (typeof articles[0])[]) {
        let slugs = [];
        articlesL.forEach(article => {
            slugs.push(article.slug);
        });
        arts.forEach(article => {
            if (!slugs.includes(article.slug)) {
                articlesL.push(article);
            }
        });
    }

    if (article.data.tags !== undefined) { pushIfNotIncluded(articles.filter(a => { return a.data.tags !== undefined ? a.data.tags.some(tag => article.data.tags.includes(tag)) : false; })); }
    if (science !== undefined) { pushIfNotIncluded(articles.filter(a => { return a.slug.split('/')[1] === science.id})); }

    const relatedArticles = `
    <div class="rounded-xl border bg-card p-6">
        <h3 class="text-lg font-semibold mb-4">${t.article.relatedArticles}</h3>
        <div class="space-y-4">
            ${articlesL.slice(0,3).map(article => (
                `<div class="group">
                    <a href=${`/article/${article.slug.split('/')[2]}`} class="flex gap-3">
                        <div class="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <img src=${'/images/contenido/'+article.slug.split('/')[2]+'/portada.webp' || "/placeholder.svg"} alt=${article.data.title}class="h-full w-full object-cover rounded-md transition-transform group-hover:scale-105"/>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                ${article.data.title}
                            </h4>
                            <p class="text-xs text-muted-foreground mt-1">
                                ${article.data.author !== undefined ? authorCollection.filter(({id}) => article.data.author.id === id)[0].data.name : authorCollection.filter(({id}) => article.data.authors[0].id === id)[0].data.name + ` ${t.common.and} ${(article.data.authors.length - 1).toString()} ${t.common.more}` } • ${calcReadTime(article.body) + ' ' + t.articles.readTime}
                            </p>
                        </div>
                    </a>
                </div>`
            )).join('\n')}
        </div>
        <a href="/articles" class="block mt-4 text-sm text-primary hover:underline">${t.article.viewMoreArticles}</a>
    </div>`

    return new Response(
        JSON.stringify({
            articleTitle: article.data.title,
            articleDescription: article.data.description,
            portrait:"/images/contenido/" + article.slug.split('/')[2] + "/portada.webp" || "/placeholder.svg",

            scienceDataId: science.id,
            scienceDataName: science.name,
            scienceDataColor: science.color,
            scienceDataIcon: science.icon,
            readTimeNum: calcReadTime(article.body),

            authorsHeader: authorsHeaderHTML,
            authors: authorsHTML,
            contentHTML: html,

            tagList: tags,
            referenceList: references,
            hasReferencesHiddenText: article.data.references===undefined ? "hidden" : "",
            relatedArticles: relatedArticles,
        })
    );
};
