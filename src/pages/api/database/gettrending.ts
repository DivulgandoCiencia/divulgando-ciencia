import type { APIRoute } from 'astro';
import { getTrending } from '../../../lib/analytics';

export const GET: APIRoute = async ({ request }) => {
    const trending = await getTrending(5);
    return new Response(JSON.stringify(trending), { status: 200 });
}