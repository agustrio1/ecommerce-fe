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
    },
    maxFiles: 5,
    multiple: true,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kelola Produk</h1>

      <Button
        onClick={() => {
          setIsModalOpen(true);
          resetForm();
        }}>
        Tambah Produk
      </Button>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Berat</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <TableRow
                  key={product.id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}
                >
                  <TableCell className="py-4 px-4 text-sm text-gray-900 whitespace-nowrap">
                    {product.name.length > 20
                      ? `${product.name.slice(0, 20)}...`
                      : product.name}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0].image}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-md shadow-sm"
                      />
                    )}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{product.weight} kg</TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{product.stock}</TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => openEditModal(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setDeleteProductId(product.id as string);
                          setIsDeleteModalOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-xs"
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  Tidak ada produk
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}>
          Sebelumnya
        </Button>
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}>
          Selanjutnya
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Produk" : "Tambah Produk"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edit detail produk." : "Isi detail produk."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nama</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
              />
            </div>

            <div>
              <Label>Berat</Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  updateFormField("weight", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Harga</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  updateFormField("price", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Stok</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  updateFormField("stock", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Deskripsi</Label>
              <Input
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
              />
            </div>

            <div>
              <Label>Kategori</Label>
              <select
                value={formData.categoryId}
                onChange={(e) => updateFormField("categoryId", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
                <option value="">Pilih Kategori</option>
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
                onChange={(e) =>
                  updateFormField("tags", e.target.value.split(","))
                }
                placeholder="Tags dipisahkan koma"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label>Unggah Gambar</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-400 p-4 cursor-pointer mt-1">
                <input {...getInputProps()} />
                <p className="text-center text-gray-500">
                  Seret & lepas beberapa file di sini, atau klik untuk memilih
                  file (maksimal 5)
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
            <Button onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button
              onClick={isEditMode ? handleUpdateProduct : handleAddProduct}>
              {isEditMode ? "Perbarui" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
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

