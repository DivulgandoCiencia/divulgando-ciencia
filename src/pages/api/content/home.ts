import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    const data = { }
    return new Response(JSON.stringify(data), { status: 200});
}