'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, Bell, Eye, EyeOff, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { getToken } from '@/utils/token';
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
  isDeleted: boolean;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const fetchNotifications = async (page: number) => {
    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/notifications?page=${page}&pageSize=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Gagal mengambil notifikasi');
      
      const data = await response.json();
      setNotifications(data.notifications);
      setPaginationInfo({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalCount: data.totalCount,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat notifikasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    setSending(true);
    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message, sendEmail }),
      });

      if (!response.ok) throw new Error('Gagal membuat notifikasi');

      toast({
        title: "Berhasil",
        description: "Notifikasi berhasil dikirim",
      });

      setMessage('');
      setSendEmail(false);
      fetchNotifications(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim notifikasi",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userRole: 'ADMIN' }),
      });

      if (!response.ok) throw new Error('Gagal menghapus notifikasi');

      toast({
        title: "Berhasil",
        description: "Notifikasi berhasil dihapus",
      });

      fetchNotifications(paginationInfo.currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus notifikasi",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      fetchNotifications(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Notifikasi</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Total Notifikasi: {paginationInfo.totalCount}
            </span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Kartu Buat Notifikasi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="w-5 h-5 text-primary" />
                  Buat Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Input
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Masukkan pesan notifikasi..."
                    className="bg-white/70 dark:bg-gray-700/70"
                  />
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <Switch
                    id="send-email"
                    checked={sendEmail}
                    onCheckedChange={setSendEmail}
                  />
                  <Label htmlFor="send-email">Kirim notifikasi email</Label>
                </div>
                <Button 
                  onClick={handleCreateNotification}
                  disabled={!message || sending}
                  className="w-full"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {sending ? 'Mengirim...' : 'Kirim Notifikasi'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Kartu Statistik */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Statistik Cepat</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Terkirim</p>
                  <p className="text-2xl font-bold">{paginationInfo.totalCount}</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Belum Dibaca</p>
                  <p className="text-2xl font-bold">
                    {notifications.filter(n => !n.isRead).length}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Hari Ini</p>
                  <p className="text-2xl font-bold">
                    {notifications.filter(n => 
                      new Date(n.createdAt).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Tingkat Dibaca</p>
                  <p className="text-2xl font-bold">
                    {paginationInfo.totalCount ? 
                      Math.round((notifications.filter(n => n.isRead).length / paginationInfo.totalCount) * 100)
                    : 0}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Daftar Notifikasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-xl">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifikasi Terbaru
                </div>
                <div className="text-sm font-normal">
                  Menampilkan {notifications.length} dari {paginationInfo.totalCount} notifikasi
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Tidak ada notifikasi</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1 flex-1">
                                <p className="text-sm">{notification.message}</p>
                                <div className="flex items-center gap-4">
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {notification.isRead ? (
                                      <Eye className="w-3 h-3 text-muted-foreground" />
                                    ) : (
                                      <EyeOff className="w-3 h-3 text-primary" />
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {notification.isRead ? 'Sudah dibaca' : 'Belum dibaca'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Hapus Notifikasi</DialogTitle>
                                    <DialogDescription>
                                      Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini tidak dapat dibatalkan.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDeleteNotification(notification.id)}
                                    >
                                      Hapus
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                  disabled={paginationInfo.currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Sebelumnya
                </Button>
                <div className="text-sm">
                  Halaman {paginationInfo.currentPage} dari {paginationInfo.totalPages}
                </div>
                <Button
                  onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                  disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Berikutnya
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPage;

