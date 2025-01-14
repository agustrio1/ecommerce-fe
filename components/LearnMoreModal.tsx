'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pelajari Lebih Lanjut</DialogTitle>
          <DialogDescription>
            Temukan informasi lebih lanjut tentang produk dan layanan kami.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Kami menyediakan berbagai produk berkualitas tinggi dengan harga terbaik. Setiap pembelian dijamin dengan garansi 30 hari uang kembali.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Produk berkualitas tinggi</li>
            <li>Dukungan pelanggan 24/7</li>
            <li>Program loyalitas dengan poin dan diskon eksklusif</li>
          </ul>
        </div>
        <Button onClick={onClose}>Tutup</Button>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;

