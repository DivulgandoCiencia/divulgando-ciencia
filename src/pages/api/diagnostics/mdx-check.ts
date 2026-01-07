export const prerender = false;

export async function GET() {
    try {
        let resolved = null;
        try {
            // Try resolve first to get a clearer error message
            resolved = require.resolve('@astrojs/mdx');
        } catch (resErr) {
            resolved = `resolve_error: ${resErr.message}`;
        }

        let imported = true;
        try {
            await import('@astrojs/mdx');
        } catch (impErr) {
            imported = false;
        }

        const info = {
            ok: imported,
            resolved,
            nodeVersion: process.versions.node,
            platform: process.platform,
            cwd: process.cwd(),
        };

        return new Response(JSON.stringify(info), { status: 200 });
    } catch (e) {
        console.error('Diagnostics endpoint failed', e);
        return new Response('Internal Server Error', { status: 500 });
    }
}