// src/middleware.ts
import { defineMiddleware } from 'astro/middleware';
import { languages } from './i18n/index';
import { getCollection } from 'astro:content';

const articles = (await getCollection('articles')).map(a => a.slug.split('/')[2]);

export const onRequest = defineMiddleware(async (context, next) => {
    const host = context.request.headers.get('host') ?? '';
    let lang = 'es';
    
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
    if (context.url.pathname.split('/').filter((a) => a !== '').length === 1 && articles.includes(context.url.pathname.split('/').filter((a) => a !== '')[0])) return Response.redirect(`${context.url.origin}/article${context.url.pathname}`);
    if (context.url.pathname.split('/').filter((a) => a !== '').length === 1 && context.url.pathname.split('/').filter((a) => a !== '')[0] === 'articulos') return Response.redirect(`${context.url.origin}/articles`);
    if (context.url.pathname.startsWith('/articulo/')) return Response.redirect(`${context.url.origin}${context.url.pathname.replace('/articulo/', '/article/')}`);

    return next();
});
