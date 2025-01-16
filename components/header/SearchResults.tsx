import Link from "next/link";
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const SearchResults = ({
  showResults,
  isLoading,
  results,
  currentPage,
  totalPages,
  handleProductClick,
  handlePageChange,
  formatRupiah,
}: any) => {
  if (!showResults) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md max-h-96 overflow-y-auto z-10 mt-2">
      {isLoading ? (
        <div className="p-4">
          <Loader2 className="animate-spin mx-auto text-primary" />
        </div>
      ) : results.length > 0 ? (
        <>
          <ul>
            {results.map((product: any) => (
              <li key={product.id} className="border-b last:border-b-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition duration-150"
                  onClick={handleProductClick}
                >
                  <img
                    src={product.images[0]?.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">
                      {product.name}
                    </h3>
                    <p className="text-primary font-medium">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-center p-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
            <span className="mx-2 self-center">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2"
            >
                <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 p-4">No products found.</p>
      )}
    </div>
  );
};

