"use client";

import { useDropzone } from "react-dropzone";
import { Toaster } from "@/components/ui/toaster";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProductManagement } from "@/hooks/use-product-management";

export default function ProductPage() {
  const {
    categories,
    products,
    isModalOpen,
    isDeleteModalOpen,
    isEditMode,
    imageFiles,
    formData,
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
  } = useProductManagement();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageFiles,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
    maxFiles: 5,
    multiple: true,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <Button
        onClick={() => {
          setIsModalOpen(true);
          resetForm();
        }}>
        Add Product
      </Button>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.images.length > 0 && (
                    <img
                      src={product.images[0].image}
                      alt={product.name}
                      className="h-16 w-16 object-cover"
                    />
                  )}
                </TableCell>
                <TableCell>{product.weight}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(product)}>Edit</Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setDeleteProductId(product.id as string);
                      setIsDeleteModalOpen(true);
                    }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edit the product details."
                : "Fill in the product details."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
              />
            </div>

            <div>
              <Label>Weight</Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => updateFormField("weight", Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => updateFormField("price", Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => updateFormField("stock", Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
              />
            </div>

            <div>
              <Label>Category</Label>
              <select
                value={formData.categoryId}
                onChange={(e) => updateFormField("categoryId", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Tags</Label>
              <Input
                value={formData.tags.join(",")}
                onChange={(e) => updateFormField("tags", e.target.value.split(","))}
                placeholder="Comma-separated tags"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label>Upload Images</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-400 p-4 cursor-pointer mt-1">
                <input {...getInputProps()} />
                <p className="text-center text-gray-500">
                  Drag & drop some files here, or click to select files (max 5)
                </p>
              </div>
              <div className="mt-2">
                {imageFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mt-1">
                    <span>{file.name}</span>
                    <span>{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              onClick={isEditMode ? handleUpdateProduct : handleAddProduct}>
              {isEditMode ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}