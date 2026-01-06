import { supabaseService as supabase } from "./supabase";
import { getCollection } from 'astro:content';
const articles = await getCollection('articles');
const authorCollection = await getCollection("authors");

export async function registerArticle(slug: string, metadata?: {title: string, author: string}): Promise<void> {
    if (!slug) return;

    try {
        const { data } = await supabase.from('articles').select('views').eq('slug', slug).maybeSingle();
        if (!data) {
            if (!metadata) return;
            await supabase.from('articles').insert({ slug, views: 0, title: metadata.title, author_identifier: metadata.author });
        }
    } catch (e) {
        console.log("Failed to register article", e);
    }
}

export async function registerView(slug: string, metadata?: {title: string, author: string}): Promise<void> {
    if (!slug) return;

    try {
        const cleanSlug = decodeURIComponent(String(slug)).replace(/^\/+|\/+$/g, '');
        console.log(slug, cleanSlug);

        const { data } = await supabase.from('articles').select('views').eq('slug', cleanSlug).maybeSingle();
        if (data) {
            await supabase.from('articles').update({ views: (data.views || 0) + 1 }).eq('slug', cleanSlug);
            return;
        }

        // Not found in DB: try to build metadata from content collection if not provided
        let title: string | undefined = undefined;
        let author_identifier: string | undefined = undefined;

        if (metadata) {
            title = metadata.title;
            author_identifier = metadata.author;
        } else {
            const article = articles.find(a => a.slug.split('/')[2] === cleanSlug);
            if (article) {
                title = article.data.title;
                const author = authorCollection.find(a => a.id === article.data.author?.id);
                author_identifier = author?.data?.name;
            }
        }

        // Insert fallback with at least slug and views. Title/author may be undefined.
        if (!title || !author_identifier) return;
        await supabase.from('articles').insert({ slug: cleanSlug, views: 1, title, author_identifier });
    } catch (e) {
        console.log("Failed to register view", e);
    }
}

export async function getTrending(limit = 5): Promise<string[]> {
    const { data } = await supabase
        .from('articles')
        .select('slug')
        .order('views', { ascending: false })
        .limit(limit);

    return data?.map(d => d.slug) || [];
}
