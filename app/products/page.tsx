
import { Metadata } from 'next';
import { getProducts } from '../../actions/products';
import FilterComponent from '../../components/FilterComponent';

interface ProductImage {
  isPrimary: boolean;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: ProductImage[];
  slug: string;
}

export const metadata: Metadata = {
  title: 'Produk Kami',
  description: 'Temukan berbagai produk terbaik kami di sini.',
};

export default async function Page() {
  const products: Product[] = await getProducts(); 

  return (
    <section className='pt-16'>
      <FilterComponent products={products} />

    </section>
  );
}
