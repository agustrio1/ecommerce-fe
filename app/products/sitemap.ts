import { getProducts } from '@/actions/products';

export async function generateSitemaps() {
    const products = await getProducts();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${products.map((product: any) => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug}</loc>
        </url>
      `).join('')}
    </urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

export default async function sitemap(req: Request) {
    return generateSitemaps();
}