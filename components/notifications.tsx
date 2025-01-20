"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, Trash2, RefreshCw, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchWithAuth } from "@/utils/api"
import { useInView } from "react-intersection-observer"
import { getToken } from "@/utils/token"
import { redirect } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Notification {
  id: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function Notifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { toast } = useToast()
  const { ref, inView } = useInView()

  const fetchNotifications = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) {
        redirect("/login")
        return
      }
      const userPayload = JSON.parse(atob(token.split(".")[1]))
      const userId = userPayload?.id

      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${userId}`)
      if (!res.ok) throw new Error("Gagal mengambil data notifikasi.")
      const data = await res.json()
      if (!Array.isArray(data.notifications)) throw new Error("Format data tidak valid.")
      setNotifications(data.notifications)
    } catch (error: any) {
      if (error.message === "Token tidak ditemukan") {
        redirect("/login")
      } else {
        setError(error.message)
        toast({
          title: "Terjadi kesalahan saat mengambil notifikasi",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  React.useEffect(() => {
    if (inView) {
      fetchNotifications()
    }
  }, [inView, fetchNotifications])

  async function markAsRead(notificationId: string) {
    try {
      const token = await getToken()
      if (!token) {
        redirect("/login")
        return
      }
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read/${notificationId}`, {
        method: "PUT",
      })
      if (!res.ok) throw new Error("Gagal menandai notifikasi sebagai telah dibaca.")
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )
      toast({ title: "Notifikasi berhasil ditandai sebagai telah dibaca", variant: "default" })
    } catch (error: any) {
      if (error.message === "Token tidak ditemukan") {
        redirect("/login")
      } else {
        toast({
          title: "Kesalahan saat menandai notifikasi",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      const token = await getToken()
      if (!token) {
        redirect("/login")
        return
      }
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Gagal menghapus notifikasi.")
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
      toast({ title: "Notifikasi berhasil dihapus", variant: "default" })
    } catch (error: any) {
      if (error.message === "Token tidak ditemukan") {
        redirect("/login")
      } else {
        toast({
          title: "Kesalahan saat menghapus notifikasi",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
            <Bell className="mr-2 h-6 w-6 md:h-8 md:w-8" />
            Notifikasi
          </CardTitle>
          <Button onClick={fetchNotifications} variant="ghost" size="icon" className="rounded-full">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] md:h-[70vh]">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <p className="text-center text-red-500 py-8">{error}</p>
            ) : (
              <AnimatePresence>
                {notifications.length > 0 ? (
                  <div className="grid gap-4 grid-cols-1">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          className={`${notification.isRead ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-700"} hover:shadow-lg transition-shadow duration-300`}
                        >
                          <CardContent className="pt-6">
                            <p className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              {notification.isRead ? "Sudah dibaca" : "Belum dibaca"} •{" "}
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Selengkapnya
                                  <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Detail Notifikasi</DialogTitle>
                                  <DialogDescription>{notification.message}</DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end space-x-2 mt-4">
                                  {!notification.isRead && (
                                    <Button onClick={() => markAsRead(notification.id)} variant="outline" size="sm">
                                      <Check className="mr-2 h-4 w-4" />
                                      Tandai Sudah Dibaca
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() => deleteNotification(notification.id)}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <div className="flex space-x-2">
                              {!notification.isRead && (
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-blue-100 dark:hover:bg-blue-900"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteNotification(notification.id)}
                                variant="destructive"
                                size="sm"
                                className="hover:bg-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Tidak ada notifikasi.
                  </motion.p>
                )}
              </AnimatePresence>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <div ref={ref} />
    </div>
  )
}

