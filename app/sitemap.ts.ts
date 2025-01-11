import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories`,
            lastModified: new Date(),
            changeFrequency: 'daily',
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
        },
    ]

}