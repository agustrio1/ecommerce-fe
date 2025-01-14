'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import { createDiscount, deleteDiscount } from '@/actions/discount';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerChildren } from '@/utils/animations';

interface Discount {
  id?: string;
  code: string;
  value: number;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  expiresAt?: string;
  minPurchase?: number;
  maxUsage?: number;
}

interface DiscountManagementProps {
  initialDiscounts: Discount[];
}

export function DiscountManagement({ initialDiscounts }: DiscountManagementProps) {
  const [discounts, setDiscounts] = React.useState(initialDiscounts);
  const { toast } = useToast();

  const handleCreate = async (formData: FormData) => {
    try {
      const result = await createDiscount(formData);
      if (result.success) {
        const newDiscount = {
          ...result.data,
          code: formData.get('code') as string,
          value: Number(formData.get('value')),
          description: formData.get('description') as string,
          discountType: formData.get('discountType') as 'PERCENTAGE' | 'FIXED',
          expiresAt: formData.get('expiresAt') as string,
          minPurchase: Number(formData.get('minPurchase')) || undefined,
          maxUsage: Number(formData.get('maxUsage')) || undefined,
        };
        setDiscounts([...discounts, newDiscount]);
        toast({
          title: "Berhasil",
          description: "Diskon berhasil dibuat",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal membuat diskon",
        description: error.message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteDiscount(id);
  
      if (result.success) {
        setDiscounts((prevDiscounts) => prevDiscounts.filter((discount) => discount.id !== id));
  
        toast({
          title: "Berhasil",
          description: `Diskon dengan ID ${id} telah dihapus.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Gagal menghapus diskon",
          description: result.error || "Gagal menghapus diskon.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal menghapus diskon",
        description: error.message || "Terjadi kesalahan yang tidak terduga.",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <CreateDiscountForm onSubmit={handleCreate} />
      <ExistingDiscounts discounts={discounts} onDelete={handleDelete} />
    </div>
  );
}

function CreateDiscountForm({ onSubmit }: { onSubmit: (formData: FormData) => Promise<void> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Diskon</CardTitle>
        <CardDescription>Tambahkan kode diskon baru ke sistem.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Kode</Label>
            <Input
              id="code"
              name="code"
              placeholder="Masukkan kode diskon"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Nilai</Label>
            <Input
              id="value"
              name="value"
              type="number"
              placeholder="Masukkan nilai diskon"
              required
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              name="description"
              placeholder="Masukkan deskripsi diskon"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountType">Tipe</Label>
            <Select name="discountType">
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe diskon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Persentase</SelectItem>
                <SelectItem value="FIXED">Tetap</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Tanggal Kedaluwarsa</Label>
            <Input
              id="expiresAt"
              name="expiresAt"
              type="date"
              placeholder="Masukkan tanggal kedaluwarsa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minPurchase">Pembelian Minimum</Label>
            <Input
              id="minPurchase"
              name="minPurchase"
              type="number"
              placeholder="Masukkan jumlah pembelian minimum"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxUsage">Penggunaan Maksimum</Label>
            <Input
              id="maxUsage"
              name="maxUsage"
              type="number"
              placeholder="Masukkan jumlah penggunaan maksimum"
              min="0"
            />
          </div>
          <Button type="submit" className="w-full">
            Buat Diskon
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ExistingDiscounts({ discounts, onDelete }: { discounts: Discount[], onDelete: (id: string) => Promise<void> }) {
  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-700">Diskon yang Ada</CardTitle>
          <CardDescription className="text-purple-600">Kelola kode diskon yang ada dengan efektif.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-indigo-700">Kode</TableHead>
                  <TableHead className="text-indigo-700">Nilai</TableHead>
                  <TableHead className="text-indigo-700">Deskripsi</TableHead>
                  <TableHead className="text-indigo-700">Tipe</TableHead>
                  <TableHead className="text-indigo-700">Kedaluwarsa</TableHead>
                  <TableHead className="text-indigo-700">Pembelian Min.</TableHead>
                  <TableHead className="text-indigo-700">Penggunaan Maks.</TableHead>
                  <TableHead className="text-indigo-700">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {discounts.map((discount) => (
                    <motion.tr
                      key={discount.id}
                      variants={fadeIn}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                    >
                      <TableCell>{discount.code}</TableCell>
                      <TableCell>{discount.value}</TableCell>
                      <TableCell>{discount.description || 'N/A'}</TableCell>
                      <TableCell>{discount.discountType === 'PERCENTAGE' ? 'Persentase' : 'Tetap'}</TableCell>
                      <TableCell>{discount.expiresAt || 'N/A'}</TableCell>
                      <TableCell>{discount.minPurchase || 'N/A'}</TableCell>
                      <TableCell>{discount.maxUsage || 'N/A'}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(discount.id as string)}
                          className="bg-red-500 hover:bg-red-600 transition-colors duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
