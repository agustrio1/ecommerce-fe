import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {      
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/user/*', '/dashboard/*'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  }
}
