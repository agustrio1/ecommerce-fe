import { Metadata } from "next";
import { ShippingHistory } from "@/components/user/shippinghistory/ShippingHistory";

export const metadata: Metadata = {
    title: "Riwayat Pengiriman - Agus Store",
    description: "Riwayat pengiriman produk di Agus Store.",
};

export default function ShippingHistoryPage() {
  return <ShippingHistory />;
}