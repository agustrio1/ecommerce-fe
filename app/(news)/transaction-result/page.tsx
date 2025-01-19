import { Suspense } from 'react';
import TransactionResultContent from '@/components/TransactionResultContent';

const TransactionResult = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <TransactionResultContent />
      </Suspense>
    </main>
  );
};

export default TransactionResult;

