import { getCollection } from "astro:content";
import { calcReadTime } from "../../../../components/readTime";
import { ScienceList } from "../../../../components/Science";
import { clientTranslations } from "../../../../i18n";

export const prerender = false;

const articlesCollection = await getCollection('articles');
const authors = await getCollection('authors');
let articlesDataES = []
let articlesDataEN = []
articlesCollection.filter(({slug}) => slug.split('/')[0] === 'es').sort((a, b) => b.data.date.getTime() - a.data.date.getTime()).map(({data, slug, body}) => {
    let auths = []
    if (data.authors) data.authors.map((author) => {auths.push([authors.filter(({id}) => id==author.id)[0].data, author.id])}); else auths=undefined;
    articlesDataES.push({
        title: data.title,
        author: [authors.filter(({id}) => id == data.author.id)[0].data, data.author.id],
        authors: auths,
        description: data.description,
        tags: data.tags,
        references: data.references,
        altImage: data.altImage,
        date: data.date,
        dateName: data.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
        science: ScienceList.filter(({id}) => id == slug.split('/')[1])[0],
        readTime: calcReadTime(body),
        id: slug.split('/')[2],
        slug: slug,
    })
})
articlesCollection.filter(({slug}) => slug.split('/')[0] === 'en').sort((a, b) => b.data.date.getTime() - a.data.date.getTime()).map(({data, slug, body}) => {
    let auths = []
    if (data.authors) data.authors.map((author) => {auths.push([authors.filter(({id}) => id==author.id)[0].data, author.id])}); else auths=undefined;
    articlesDataEN.push({
        title: data.title,
        author: [authors.filter(({id}) => id == data.author.id)[0].data, data.author.id],
        authors: auths,
        description: data.description,
        tags: data.tags,
        references: data.references,
        altImage: data.altImage,
        date: data.date,
        dateName: data.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
        science: ScienceList.filter(({id}) => id == slug.split('/')[1])[0],
        readTime: calcReadTime(body),
        id: slug.split('/')[2],
        slug: slug,
    })
})

const handler = async (body, lang = 'en') => {;
    let articlesData = lang === 'es' ? articlesDataES.slice() : articlesDataEN.slice();
    const t = clientTranslations[lang];

    const articlesPerPage = 12;
    let currentPage = parseInt(body['page'] || "1");
    const scienceParam = body['science'] || null;
    const searchParam = body['search'] || null;
    const tagParam = body['tags'] || null;
    let filteredArticles = [...articlesData];

    function filterArticlesBySearch(searchTerm) {
        if (!searchTerm) {
            return;
        }

        const term = searchTerm.toLowerCase().replace(/[\u0300-\u036f]/g, "");
        let filteredArticlesByTerm = filteredArticles.filter(article => {
            const title = article.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
            const description = article.description.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
            const science = article.science.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
            const authors = article.authors !== undefined ? 
                article.authors.map(a => a[0].name.toLowerCase()).join(' ').normalize("NFKD").replace(/[\u0300-\u036f]/g, "") : 
                (article.author[0] !== undefined ? article.author[0].name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "") : '');
            const tags = article.tags !== undefined ?
                article.tags.map(tag => tag.toLowerCase()).join(' ').normalize("NFKD").replace(/[\u0300-\u036f]/g, "") : '';
            return title.includes(term) || 
                description.includes(term) || 
                science.includes(term) || 
                authors.includes(term) ||
                tags.includes(term);
        });

        term.split(' ').forEach((word) => {
            let filteredArticlesByWord = filteredArticles.filter(article => {
                const title = article.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
                const description = article.description.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
                const science = article.science.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
                const authors = article.authors !== undefined ? 
                    article.authors.map(a => a[0].name.toLowerCase()).join(' ').normalize("NFKD").replace(/[\u0300-\u036f]/g, "") : 
                    (article.author[0] !== undefined ? article.author[0].name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "") : '');
                const tags = article.tags !== undefined ?
                    article.tags.map(tag => tag.toLowerCase()).join(' ').normalize("NFKD").replace(/[\u0300-\u036f]/g, "") : '';
                return title.includes(word) || 
                    description.includes(word) || 
                    science.includes(word) || 
                    authors.includes(word) ||
                    tags.includes(word);
            });
            filteredArticlesByWord.forEach((article) => {
                if (!filteredArticlesByTerm.includes(article)) {
                    filteredArticlesByTerm.push(article);
                }
            });
        })
        return filteredArticlesByTerm;
    }

    if (scienceParam) {
        filteredArticles = articlesData.filter(article => 
            article.science.id.toLowerCase() === scienceParam.toLowerCase()
        );
    }
    if (searchParam) filteredArticles = filterArticlesBySearch(searchParam);
    if (tagParam) {
        filteredArticles = articlesData.filter(article => 
            article.tags !== undefined ? article.tags.filter(tag => tag.toLowerCase().replace(/\s+/g, '-') === tagParam.toLowerCase()).length > 0 : false
        );
    }

    // Calculate pagination
    const totalArticles = filteredArticles.length
    const totalPages = Math.max(1, Math.ceil(totalArticles / articlesPerPage))
    currentPage = Math.max(1, Math.min(currentPage, totalPages));
    function buildPagination(currentPage, totalPages) {
        currentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
        totalPages = Math.max(1, Math.floor(totalPages));
        if (totalPages === 1) return [1];
        const pages = [];
        pages.push(1);
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        if (start > 2) {pages.push('ellipsis');}
        for (let i = start; i <= end; i++) {pages.push(i);}
        if (end < totalPages - 1) {pages.push('ellipsis');}
        pages.push(totalPages);
        const seen = new Set();
        return pages.filter(x => {
            if (seen.has(x)) return false;
            seen.add(x);
            return true;
        });
    }

    const pages = buildPagination(currentPage, totalPages)


    // Get articles for current page
    const startIndex = (currentPage - 1) * articlesPerPage
    const endIndex = Math.min(startIndex + articlesPerPage, totalArticles)
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    let pageFilters = '';
    if (scienceParam) pageFilters += `&science=${scienceParam}`;
    if (searchParam) pageFilters += `&search=${searchParam}`;
    if (tagParam) pageFilters += `&tags=${tagParam}`;

    const paginatedArticlesHTML = `
        <div id="articles-grid" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" style=${paginatedArticles.length === 0 ? 'display: none;' : ''}>
        ${paginatedArticles.map((article) =>
            `<div class="overflow-hidden rounded-lg shadow-md dark:shadow-[#151515] bg-card text-card-foreground h-full flex flex-col transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-xl">
                <div class="h-48 w-full relative overflow-hidden">
                    <a href=${"/article/"+article.slug.split('/')[2]}><img src=${"/images/contenido/" + article.id + "/portada.webp" || "/placeholder.svg"} alt=${article.title} width="400" height="225" class="h-full w-full object-cover rounded-t-xl transition-transform hover:scale-105 duration-700"/></a>
                    <div class="absolute top-2 left-2">
                        <span class="${"text-primary-foreground px-2 py-1 text-xs font-medium rounded-full shadow-md bg-color-"+article.science.color}">
                            ${t.sciences[article.science.name]}
                        </span>
                    </div>
                </div>
                <div class="p-6 flex-1 flex flex-col">
                    <div class="mb-2">
                        <a href=${"/article/"+article.slug.split('/')[2]} class="hover:text-primary transition-colors">
                            <h4 class="text-xl font-semibold line-clamp-2 group-hover:text-primary">
                                ${article.title}
                            </h4>
                        </a>
                        <div class="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>${article.dateName}</span>
                            <span>•</span>
                            <span>${article.readTime} ${t.articles.readTime}</span>
                        </div>
                    </div>
                    <p class="line-clamp-3 text-muted-foreground mb-4 flex-1">${article.description}</p>
                    <div class="flex justify-between items-center mt-auto">
                        <div class="flex items-center">
                            <img style="view-transition-name:${article.slug.split('/')[2]}-portrait;" alt=${"Foto de perfil de "+article.author[0].name} src=${"/images/autores/"+article.author[1]+".webp"} class="bg-principal-white h-6 w-6 rounded-full object-contain my-auto mr-2"/>
                            <div class="text-sm font-medium">
                                ${article.authors && article.authors.length > 0
                                    ? article.authors[0].name + (article.authors.length > 1 ? ` +${article.authors.length - 1}` : '')
                                    : article.author[0]?.name || 'Unknown Author'}
                            </div>
                        </div>
                        <a href=${"/article/"+article.slug.split('/')[2]}>
                            <button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 hover:scale-105 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                ${t.common.readArticle}
                            </button>
                        </a>
                    </div>
                </div>
            </div>`
        ).join('')}
        </div>
        <div id="no-articles-message" class="text-center py-12" style="${paginatedArticles.length !== 0 ? 'display: none;' : ''}">
            <p class="text-muted-foreground">${t.articles.noArticlesFound}</p>
        </div>
    `
    const paginationHTML = `
        <a href="${currentPage <= 1 ? '' : `?page=${currentPage - 1}${pageFilters}`}" class="${`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border ${currentPage > 1 ? 'border-input bg-background hover:bg-accent transition-colors' : 'border-input bg-background opacity-50 cursor-not-allowed'}`}" aria-disabled=${currentPage <= 1} tabindex=${currentPage <= 1 ? -1 : 0} aria-label='Go to previous page' style=${currentPage <= 1 ? "pointer-events: none" : ''}>
            <span class="sr-only">Previous Page</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
        ${
            pages.map((page) => {
                if (page === 'ellipsis') {
                    return '<span class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-2 border border-input bg-background">...</span>'
                } else {
                    if (currentPage === page) {
                        return `<a href=${`?page=${page}${pageFilters}`} class="${`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 ${currentPage === page ? 'bg-primary text-primary-foreground' : 'border border-input bg-background hover:bg-accent transition-colors'}`}" aria-label=${`Go to page ${page}`} aria-current='page'>${page}</a>`
                    } else {
                        return `<a href=${`?page=${page}${pageFilters}`} class="${`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 ${currentPage === page ? 'bg-primary text-primary-foreground' : 'border border-input bg-background hover:bg-accent transition-colors'}`}" aria-label=${`Go to page ${page}`}>${page}</a>`
                    }
                }
            }).join('')
        }
        <a href="${currentPage >= totalPages ? '' : `?page=${currentPage + 1}${pageFilters}`}" class="${`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border ${currentPage < totalPages ? 'border-input bg-background hover:bg-accent transition-colors' : 'border-input bg-background opacity-50 cursor-not-allowed'}`}" aria-disabled=${currentPage >= totalPages} tabindex=${currentPage >= totalPages ? -1 : 0} aria-label='Go to next page' style=${currentPage >= totalPages ? "pointer-events: none" : ''}>
            <span class="sr-only">Next Page</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </a>
    `
    const scienceSelectorHTML = `
        <select id="science-filter" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px]">
            <option value="">${t.sciences.all}</option>
            ${ScienceList.map(science => {
                if (science.id === scienceParam) {return `<option value=${science.id} selected>${t.sciences[science.name]}</option>`}
                else {return `<option value=${science.id}>${t.sciences[science.name]}</option>`}
            })}
        </select>
    `

    return JSON.stringify({
            currentPage: currentPage,
            searchParam: searchParam || '',
            hideTags: tagParam ? '' : 'display: none;',
            stylePageIndicator: paginatedArticles.length === 0 ? 'display: none;' : '',

            scienceSelector: scienceSelectorHTML,
            paginatedArticles: paginatedArticlesHTML,
            pagination: paginationHTML,
        })
}

export const POST = async ({ params, request }) => {
    let body = {};
    if (request.headers.get("Content-Type") === "application/json") body = await request.json();
    const url = new URL(request.url);
    const response = await handler(body, ['es','en'].includes(url.pathname.split('/')[3]) ? url.pathname.split('/')[3] : 'en');
    return new Response(
        response,
        {
            headers: { "Content-Type": "application/json" },
        }
    );
}

export const GET = async ({ params, request }) => {
    let body = {};
    const url = new URL(request.url);
    const response = await handler(body, ['es','en'].includes(url.pathname.split('/')[3]) ? url.pathname.split('/')[3] : 'en');
    return new Response(
        response,
        {
            headers: { "Content-Type": "application/json" },
        }
    );
}