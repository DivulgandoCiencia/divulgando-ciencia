// src/middleware.ts
import { defineMiddleware } from 'astro/middleware';
import { languages } from './i18n/index';

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

    context.cookies.set('divciencia-lang', lang, { domain: '.divulgandociencia.com', sameSite: 'none', secure: true });
    
    context.locals.lang = lang;
    context.locals.theme = cookiesTheme?.value ?? '';

    // Esto lo he modificado yo, quitalo cuando lo necesites
    const response = await next();

    response.headers.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=3600"
    );

    return response;

    // Esto lo tenias tu. return next();
});
