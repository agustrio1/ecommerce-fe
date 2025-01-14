'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getToken } from '@/utils/token'
import { useToast } from '@/hooks/use-toast'
import { Save, Settings, Trash2, Bell, Shield, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

export default function UserSetting() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [data, setData] = React.useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = await getToken()
      if (!token) {
        toast({
          title: "Error",
          description: "Token tidak ditemukan. Harap login ulang.",
          variant: "destructive",
        })
        return
      }

      const userPayload = JSON.parse(atob(token.split(".")[1]))
      const userId = userPayload?.id

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await response.json()
      setData(userData)
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengambil data pengguna.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleDeletingUser = async () => {
    try {
      const token = await getToken()
      if (!token) {
        toast({
          title: "Error",
          description: "Token tidak ditemukan. Harap login ulang.",
          variant: "destructive",
        })
        return
      }

      const userPayload = JSON.parse(atob(token.split(".")[1]))
      const userId = userPayload?.id

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      toast({
        title: "Sukses",
        description: "Akun Anda telah berhasil dihapus.",
        variant: "default",
      })

      // Redirect to home page or login page after successful deletion
      window.location.href = "/"
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus akun. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <SettingsSkeleton />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pengaturan Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={data?.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nama Pengguna</Label>
              <Input id="username" value={data?.username} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value="********"
                  readOnly
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Notifikasi Email</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Notifikasi Push</Label>
              <Switch id="push-notifications" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Hapus Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Menghapus akun Anda akan menghapus semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Akun
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Anda yakin ingin menghapus akun?</DialogTitle>
                <DialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen dari sistem kami.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={handleDeletingUser}>
                  Ya, Hapus Akun Saya
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

