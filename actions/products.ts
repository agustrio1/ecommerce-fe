

export async function getProducts() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-cache"
    }); 
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
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