"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getToken } from "@/utils/token"
import { useToast } from "@/hooks/use-toast"
import { Save, Edit, MapPin, Phone, Calendar, Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AddressForm } from "@/components/AddressForm"

interface Address {
  id: string
  address1: string
  address2?: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  type: string
  createdAt: string
  updatedAt: string
  userId: string
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getUserIdFromToken = async () => {
  const token = await getToken()
  if (!token) throw new Error("Token tidak ditemukan")
  const userPayload = JSON.parse(atob(token.split(".")[1]))
  return userPayload?.id
}

export default function AddressCard() {
  const [addresses, setAddresses] = React.useState<Address[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editData, setEditData] = React.useState<Omit<Address, "id" | "createdAt" | "updatedAt" | "userId">>({
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    type: "SHIPPING",
  })

  const { toast } = useToast()

  React.useEffect(() => {
    let isMounted = true

    const fetchAddress = async () => {
      try {
        const token = await getToken()
        if (!token) throw new Error("Token tidak ditemukan")

        const userPayload = JSON.parse(atob(token.split(".")[1]))
        const userId = userPayload?.id

        if (!userId) throw new Error("ID pengguna tidak ditemukan dalam token")

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Gagal memuat data alamat")

        const addressData = await res.json()

        if (isMounted) {
          setAddresses(addressData)
        }
      } catch (error) {
        console.error(error)
        if (isMounted) {
          toast({
            title: "Error",
            description: "Gagal memuat data alamat",
            variant: "destructive",
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAddress()

    return () => {
      isMounted = false
    }
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id)
    setEditData({
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      phone: address.phone,
      type: address.type,
    })
  }

  const handleSave = async () => {
    try {
      const token = await getToken()
      if (!token) throw new Error("Token tidak ditemukan")

      const userId = await getUserIdFromToken()
      if (!userId) throw new Error("ID pengguna tidak ditemukan dalam token")

      const method = editingId === "new" ? "POST" : "PUT"
      const url =
        editingId === "new"
          ? `${process.env.NEXT_PUBLIC_API_URL}/addresses`
          : `${process.env.NEXT_PUBLIC_API_URL}/addresses/${editingId}`

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...editData, userId }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Server error:", errorData)
        throw new Error(errorData.message || "Gagal menyimpan perubahan")
      }

      const savedAddress = await res.json()

      if (editingId === "new") {
        setAddresses((prev) => [...prev, savedAddress])
      } else {
        setAddresses((prev) =>
          prev.map((address) => (address.id === editingId ? { ...address, ...savedAddress } : address)),
        )
      }
      setEditingId(null)
      toast({
        title: "Berhasil",
        description: editingId === "new" ? "Alamat baru berhasil ditambahkan" : "Perubahan berhasil disimpan",
      })
    } catch (error: any) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan perubahan",
        variant: "destructive",
      })
    }
  }

  const handleAddNew = () => {
    setEditingId("new")
    setEditData({
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: "",
      type: "SHIPPING",
    })
  }

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken()
      if (!token) throw new Error("Token tidak ditemukan")

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Gagal menghapus alamat")

      setAddresses((prev) => prev.filter((address) => address.id !== id))
      toast({
        title: "Berhasil",
        description: "Alamat berhasil dihapus",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Gagal menghapus alamat",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span>Alamat Pengguna</span>
          </div>
          <Button onClick={handleAddNew} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Alamat
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {editingId === "new" && (
            <motion.div
              key="new-address-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 border rounded-lg shadow-sm"
            >
              <AddressForm editData={editData} handleInputChange={handleInputChange} handleSave={handleSave} />
            </motion.div>
          )}
          {addresses.length === 0 && editingId !== "new" ? (
            <motion.div
              key="no-address"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-gray-500">Alamat belum tersedia</p>
              <Button onClick={handleAddNew} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Alamat Baru
              </Button>
            </motion.div>
          ) : (
            addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {editingId === address.id ? (
                  <AddressForm editData={editData} handleInputChange={handleInputChange} handleSave={handleSave} />
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{address.address1}</p>
                    {address.address2 && <p>{address.address2}</p>}
                    <p>{`${address.city}, ${address.state}, ${address.country} ${address.postalCode}`}</p>
                    <p className="flex items-center">
                      <Phone className="mr-2" size={16} />
                      {address.phone}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="mr-2" size={16} />
                      Diperbarui: {formatDate(address.updatedAt)}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={() => handleEdit(address)} variant="outline" size="sm">
                        <Edit className="mr-2" size={16} />
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(address.id)} variant="destructive" size="sm">
                        <Trash2 className="mr-2" size={16} />
                        Hapus
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

