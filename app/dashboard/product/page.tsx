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
      <h1 className="text-2xl font-bold mb-6">Kelola Produk</h1>

      <Button
        onClick={() => {
          setIsModalOpen(true);
          resetForm();
        }}>
        Tambah Produk
      </Button>

      <div className="mt-6">
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
                <TableCell>
                  {product.name.length > 20
                    ? `${product.name.slice(0, 20)}...`
                    : product.name}
                </TableCell>
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
                    Hapus
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
