import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/utils/token";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  isPrimary: boolean;
  image: string;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  weight: number;
  price: number;
  stock: number;
  category: string;
  categoryId: string;
  images: ProductImage[];
  tags?: string[];
}

interface ProductForm {
  name: string;
  description: string;
  weight: number;
  price: number;
  stock: number;
  categoryId: string;
  tags: string[];
}

export const useProductManagement = () => {
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    weight: 0,
    price: 0,
    stock: 0,
    categoryId: "",
    tags: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=${currentPage}&limit=${limit}`);
      const data = await res.json();
      if (data && data.status === "success" && Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalPages(data.meta.totalPages);
      } else {
        console.error("Unexpected data structure:", data);
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  };

  const createFormData = () => {
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("weight", formData.weight.toString());
    formDataObj.append("price", formData.price.toString());
    formDataObj.append("stock", formData.stock.toString());
    formDataObj.append("categoryId", formData.categoryId);

    formData.tags.forEach((tag) => {
      formDataObj.append("tags[]", tag);
    });

    imageFiles.forEach((file) => {
      formDataObj.append("images", file);
    });

    return formDataObj;
  };

  const handleAddProduct = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Failed to get token",
          variant: "destructive",
        });
        return;
      }

      const formDataObj = createFormData();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const data = await res.json();
      setProducts([...products, data]);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Failed to get token",
          variant: "destructive",
        });
        return;
      }

      const formDataObj = createFormData();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        }
      );

      const data = await res.json();
      const updatedProducts = products.map((product) =>
        product.id === selectedProduct.id ? { ...data } : product
      );
      setProducts(updatedProducts);
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;

    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Failed to get token",
          variant: "destructive",
        });
        return;
      }

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${deleteProductId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(products.filter((product) => product.id !== deleteProductId));
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Product deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      weight: 0,
      price: 0,
      stock: 0,
      categoryId: "",
      tags: [],
    });
    setSelectedProduct(null);
    setImageFiles([]);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsModalOpen(true);
    setFormData({
      name: product.name,
      description: product.description,
      weight: product.weight,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      tags: product.tags || [],
    });
    setImageFiles([]);
  };

  const handleImageFiles = (files: File[]) => {
    if (files.length > 5) {
      toast({
        title: "Error",
        description: "You can upload a maximum of 5 images.",
        variant: "destructive",
      });
      return;
    }
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const updateFormField = (field: keyof ProductForm, value: string | number | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Pagination Handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // State
    categories,
    products,
    selectedProduct,
    isModalOpen,
    isDeleteModalOpen,
    isEditMode,
    imageFiles,
    formData,
    currentPage,
    totalPages,

    // Actions
    setIsModalOpen,
    setIsDeleteModalOpen,
    setDeleteProductId,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    openEditModal,
    resetForm,
    handleImageFiles,
    updateFormField,
    goToPage,
    nextPage,
    prevPage,
    handlePageChange,
  };
};