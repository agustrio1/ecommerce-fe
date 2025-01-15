import { Suspense } from 'react';
import Notifications from "@/components/notifications";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {         
  title: "Notifikasi - Agus Store",
  description: "Kelola notifikasi Anda di Agus Store.",
};

function LoadingNotifications() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-1/4 mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<LoadingNotifications />}>
      <Notifications />
    </Suspense>
  );
}

