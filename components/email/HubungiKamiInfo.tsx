'use client';

import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';

export default function HubungiKamiInfo() {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Informasi Kontak
        </h3>
        <div className="mt-5 space-y-6">
          <div className="flex items-center">
            <MailIcon className="h-6 w-6 text-gray-400" />
            <span className="ml-3 text-gray-500">support@tokoonline.com</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-6 w-6 text-gray-400" />
            <span className="ml-3 text-gray-500">+62 123 4567 890</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-6 w-6 text-gray-400" />
            <span className="ml-3 text-gray-500">Jl. Raya Kediri No. 123, Kediri</span>
          </div>
        </div>
      </div>
    </div>
  );
}
