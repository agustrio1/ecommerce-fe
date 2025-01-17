"use client";

import * as React from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { getToken } from "@/utils/token";
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string | null;
}

export default function Page() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengambil data kategori",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setSelectedImage(null);
    setPreviewUrl(null);
    setSelectedCategory(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddCategory = async () => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", categoryName);
      if (selectedImage) {
        formData.append("images", selectedImage);
      }

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add category");

      toast({
        title: "Success",
        description: "Sukses menambahkan kategori",
      });
      resetForm();
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan kategori",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", categoryName);
      if (selectedImage) {
        formData.append("images", selectedImage);
      }
      formData.append("id", selectedCategory.id);

      const res = await fetch(`/api/categories`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update category");

      toast({
        title: "Success",
        description: "Sukses memperbarui kategori",
      });
      resetForm();
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui kategori",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;

    try {
      const token = await getToken();
      const res = await fetch(`/api/categories`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: deleteCategoryId }),
      });

      if (!res.ok) throw new Error("Failed to delete category");

      toast({
        title: "Success",
        description: "Sukses menghapus kategori",
      });
      fetchCategories();
      setDeleteCategoryId(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus kategori",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manajemen Kategori</CardTitle>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setIsEditMode(false);
              resetForm();
            }}
            className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Gambar</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsModalOpen(true);
                            setIsEditMode(true);
                            setSelectedCategory(category);
                            setCategoryName(category.name);
                            setPreviewUrl(category.image);
                          }}
                          className="flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteCategoryId(category.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Perbarui informasi kategori."
                : "Tambah kategori baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Nama Kategori</Label>
                <Input
                  id="category-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Masukkan nama kategori"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category-image">Gambar Kategori</Label>
                <div className="flex flex-col gap-4">
                  {previewUrl && (
                    <div className="relative w-full aspect-video">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      id="category-image"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      {previewUrl ? "Ganti Gambar" : "Upload Gambar"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                if (isEditMode) {
                  handleUpdateCategory();
                } else {
                  handleAddCategory();
                }
              }}>
              {isEditMode ? "Perbarui" : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
            <DialogDescription>
              Apakah anda yakin ingin menghapus kategori ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
