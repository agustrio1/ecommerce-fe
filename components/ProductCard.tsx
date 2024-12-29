import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    images: any;
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(product.price);

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group"
    >
      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 mb-3">
        <Image
          src={product.images[0]?.image as any || ""}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-gray-900">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}