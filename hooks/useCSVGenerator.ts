import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
}

export function useCSVGenerator(orders: Order[]) {
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState<string>("");

  const generateCSV = () => {
    if (orders.length === 0) {
      toast({
        title: "Error",
        description: "Tidak ada data untuk diunduh",
        variant: "destructive",
      });
      return;
    }

    
    const BOM = "\uFEFF";
    const headers = ["ID Pesanan", "Tanggal", "Total", "Status"];
    const csvContent = BOM + [
      headers.join("\t"),
      ...orders.map(order => [
        order.id,
        new Date(order.createdAt).toLocaleDateString("id-ID"),
        order.total,
        order.status
      ].join("\t"))
    ].join("\n");

    setCsvContent(csvContent);
  };

  const downloadCSV = () => {
    if (!csvContent) {
      generateCSV();
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan-pesanan-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { generateCSV, downloadCSV };
}

