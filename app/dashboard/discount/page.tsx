import { fetchDiscounts } from '@/actions/discount';
import { DiscountManagement } from '@/components/DiscountManagement';
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Kelola Diskon - Agus Store',
  description: 'Kelola diskon yang tersedia di Agus Store.',
}

export const dynamic = 'force-dynamic';

export default async function AdminDiscountPage() {
  try {
    const discounts = await fetchDiscounts();
    return <DiscountManagement initialDiscounts={discounts} />;
  } catch (error: any) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error.message || 'An error occurred while fetching discounts.'}</p>
      </div>
    );
  }
}

