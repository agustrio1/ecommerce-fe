import { Metadata } from "next";
import { ShippingManagement } from "@/components/shippings/ShippingManagement";

export const metadata: Metadata = {
  title: "Pengiriman - Agus Store",
  description: "Kelola pengiriman produk",
};

export default function ShippingsPage() {
  return (
    <main className="md:p-4">
      <ShippingManagement />
    </main>
  );
}
