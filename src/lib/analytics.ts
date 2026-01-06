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
        const { data } = await supabase.from('articles').select('views').eq('slug', slug).maybeSingle();
        if (data) {
            await supabase.from('articles').update({ views: (data.views || 0) + 1 }).eq('slug', slug);
        } else {
            if (!metadata) {
                const article = articles.filter(a => {a.slug.split('/')[2] === slug})[0];
                if (!article) return;
                const author = authorCollection.filter(a => a.id === article.data.author.id)[0];
                await supabase.from('articles').insert({ slug, views: 1, title: article.data.title, author_identifier: author.data.name });
            };
            await supabase.from('articles').insert({ slug, views: 1, title: metadata.title, author_identifier: metadata.author });
        }
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
