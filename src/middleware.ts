// src/middleware.ts
import { defineMiddleware } from 'astro/middleware';
import { languages } from './i18n/index';
import { getCollection } from 'astro:content';
import { registerView } from './lib/analytics';

const articles = await getCollection('articles');
const authorCollection = await getCollection("authors");

export const onRequest = defineMiddleware(async (context, next) => {
    const host = context.request.headers.get('host') ?? '';
    let lang = 'es';

    // Analytics tracking
    let _exit = false;
    while ((context.url.pathname.startsWith('/api/content/es/article/') || context.url.pathname.startsWith('/api/content/en/article/')) && !_exit) {
        _exit = true;
        const article = articles.find(a => a.slug === context.url.pathname.split('/article/')[1]);
        if (!article) break;
        const author = authorCollection.find(author => author.id === article.data.author.id);
        await registerView(article.slug.split('/')[2], {title: article.data.title, author: author?.data.name});
        break;
    }
    
    const cookies = context.cookies.get('divciencia-lang');
    const cookiesTheme = context.cookies.get('divciencia-theme');
    const subdomain = host.split('.')[0];

    if (cookies?.value) {
        lang = cookies?.value ?? 'es';
    } else if (context.request.headers.get('accept-language')) {
        const acceptLanguage = context.request.headers.get('accept-language') ?? '';
        const langFromHeader = acceptLanguage.split(',')[0].split('-')[0];
        lang = langFromHeader;
    } else {
        if (languages.includes(subdomain as any)) {
            lang = subdomain;
        }
    }
    
    lang = languages.includes(lang as any) ? lang : 'es';

    context.cookies.set('divciencia-lang', lang, { domain: '.divulgandociencia.com', sameSite: 'none', secure: true, maxAge: 365 * 86400, path: '/' });
    
    context.locals.lang = lang;
    context.locals.theme = cookiesTheme?.value ?? '';
    if (context.url.hostname === 'localhost') {context.locals.lang = 'es'; context.locals.theme = 'dark';}

    return next();
});
