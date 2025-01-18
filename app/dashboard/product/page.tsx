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
import { Loader2 } from 'lucide-react';

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
    handlePageChange,
    currentPage,
    totalPages,
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
      "image/webp": [],
      "image/jpg": [],
      "image/avif": [],
    },
    maxFiles: 5,
    multiple: true,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Kelola Produk</h1>

      <Button
        onClick={() => {
          setIsModalOpen(true);
          resetForm();
        }}
        className="mb-6">
        Tambah Produk
      </Button>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat produk...</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Gambar</TableHead>
                <TableHead>Berat</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name.length > 20
                      ? `${product.name.slice(0, 20)}...`
                      : product.name}
                  </TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0].image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.weight} kg</TableCell>
                  <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => openEditModal(product)}
                        variant="outline"
                        size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteProductId(product.id as string);
                          setIsDeleteModalOpen(true);
                        }}>
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between items-center">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}>
          Sebelumnya
        </Button>
        <span className="text-sm text-gray-600">
          Halaman {currentPage} dari {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}>
          Selanjutnya
        </Button>
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Produk" : "Tambah Produk"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edit detail produk." : "Isi detail produk baru."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Berat (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => updateFormField("weight", Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Harga (Rp)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateFormField("price", Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stok
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => updateFormField("stock", Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Deskripsi
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategori
              </Label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => updateFormField("categoryId", e.target.value)}
                className="col-span-3 w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags.join(",")}
                onChange={(e) => updateFormField("tags", e.target.value.split(","))}
                placeholder="Tags dipisahkan koma"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Gambar</Label>
              <div
                {...getRootProps()}
                className="col-span-3 border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input {...getInputProps()} />
                <p className="text-center text-sm text-gray-600">
                  Seret & lepas beberapa file di sini, atau klik untuk memilih file (maksimal 5)
                </p>
              </div>
            </div>
            {imageFiles.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="col-start-2 col-span-3">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 mt-1">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={isEditMode ? handleUpdateProduct : handleAddProduct}>
              {isEditMode ? "Perbarui" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}

