'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const TransactionResult = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get('order_id');
  const status_code = searchParams.get('status_code');
  const transaction_status = searchParams.get('transaction_status');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'failed' | 'pending'>('pending');

  useEffect(() => {
    if (status_code && transaction_status) {
      if (status_code === '200' && transaction_status === 'settlement') {
        setMessage('Transaksi berhasil!');
        setStatus('success');
      } else if (transaction_status === 'pending') {
        setMessage('Transaksi masih dalam proses.');
        setStatus('pending');
      } else {
        setMessage('Transaksi gagal.');
        setStatus('failed');
      }
    }
  }, [status_code, transaction_status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 border-green-200';
      case 'failed':
        return 'bg-red-100 border-red-200';
      case 'pending':
        return 'bg-yellow-100 border-yellow-200';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border-2 ${getStatusColor()} transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col items-center mb-6">
          {getStatusIcon()}
          <h1 className="text-3xl font-bold mt-4 text-center">Hasil Transaksi</h1>
        </div>
        <div className="mb-8 text-center">
          <p className="text-xl font-semibold mb-2">{message}</p>
          <p className="text-gray-600">ID Pesanan: {order_id || 'Tidak tersedia'}</p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link 
            href="/" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out text-center"
          >
            Kembali ke Beranda
          </Link>
          <Link 
            href="/user/order-history" 
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out text-center"
          >
            Lihat Pesanan Saya
          </Link>
        </div>
      </div>
    </main>
  );
};

export default TransactionResult;

