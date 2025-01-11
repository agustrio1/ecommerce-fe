export async function getProducts(page = 1, limit = 10): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&limit=${limit}`,
    {
      next: { revalidate: 60 },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  
  return {
    products: data.data || [],
    meta: data.meta || {
      page: 1,
      totalPages: 1,
      limit: 10
    }
  };
}


export async function getProductBySlug(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`, {
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products by slug');
  }
  return response.json();
}