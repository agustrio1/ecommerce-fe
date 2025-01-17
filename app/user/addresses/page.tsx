"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getToken } from "@/utils/token";
import { useToast } from "@/hooks/use-toast";
import { Save, Edit, MapPin, Phone, Calendar, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Address {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AddressCard() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editData, setEditData] = React.useState<
    Omit<Address, "id" | "createdAt" | "updatedAt" | "userId">
  >({
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    type: "SHIPPING",
  });

  const { toast } = useToast();

  React.useEffect(() => {
    let isMounted = true;

    const fetchAddress = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Token tidak ditemukan");

        const userPayload = JSON.parse(atob(token.split(".")[1]));
        const userId = userPayload?.id;

        if (!userId) throw new Error("ID pengguna tidak ditemukan dalam token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Gagal memuat data alamat");

        const addressData = await res.json();

        if (isMounted) {
          setAddresses(addressData);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Gagal memuat data alamat",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setEditData({
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      phone: address.phone,
      type: address.type,
    });
  };

  const handleSave = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/addresses/${editingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (!res.ok) throw new Error("Gagal menyimpan perubahan");

      setAddresses((prev) =>
        prev.map((address) =>
          address.id === editingId ? { ...address, ...editData } : address
        )
      );
      setEditingId(null);
      toast({
        title: "Berhasil",
        description: "Perubahan berhasil disimpan",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Gagal menyimpan perubahan",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingId("new");
    setEditData({
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: "",
      type: "SHIPPING",
    });
  };

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
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
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
        <AnimatePresence mode="wait">
          {addresses.length === 0 && editingId !== "new" ? (
            <motion.div
              key="no-address"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8">
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
                className="mb-6 p-4 border rounded-lg">
                {editingId === address.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address1">Alamat 1</Label>
                        <Input
                          id="address1"
                          name="address1"
                          value={editData.address1}
                          onChange={handleInputChange}
                          placeholder="Alamat 1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address2">Alamat 2</Label>
                        <Input
                          id="address2"
                          name="address2"
                          value={editData.address2}
                          onChange={handleInputChange}
                          placeholder="Alamat 2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Kota</Label>
                        <Input
                          id="city"
                          name="city"
                          value={editData.city}
                          onChange={handleInputChange}
                          placeholder="Kota"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Provinsi</Label>
                        <Input
                          id="state"
                          name="state"
                          value={editData.state}
                          onChange={handleInputChange}
                          placeholder="Provinsi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Negara</Label>
                        <Input
                          id="country"
                          name="country"
                          value={editData.country}
                          onChange={handleInputChange}
                          placeholder="Negara"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Kode Pos</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={editData.postalCode}
                          onChange={handleInputChange}
                          placeholder="Kode Pos"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telepon</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={editData.phone}
                          onChange={handleInputChange}
                          placeholder="Telepon"
                        />
                      </div>
                    </div>
                    <Button onClick={handleSave} className="w-full">
                      <Save className="mr-2" size={16} />
                      Simpan
                    </Button>
                  </div>
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
                    <Button
                      onClick={() => handleEdit(address)}
                      variant="outline"
                      size="sm">
                      <Edit className="mr-2" size={16} />
                      Edit
                    </Button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
