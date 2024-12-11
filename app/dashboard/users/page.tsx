"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { getToken } from "@/utils/token";

interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
}

type Action =
  | { type: "SET_USERS"; payload: User[] }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "DELETE_USER"; payload: string };

const userReducer = (state: User[], action: Action): User[] => {
  switch (action.type) {
    case "SET_USERS":
      return action.payload;
    case "ADD_USER":
      return [...state, action.payload];
    case "UPDATE_USER":
      return state.map((user) =>
        user.id === action.payload.id ? { ...user, ...action.payload } : user
      );
    case "DELETE_USER":
      return state.filter((user) => user.id !== action.payload);
    default:
      return state;
  }
};

export default function Page() {
  const { toast } = useToast();
  const [users, dispatch] = React.useReducer(userReducer, []);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      dispatch({ type: "SET_USERS", payload: data.users });
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Gagal mendapatkan data Pengguna!",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (user: User) => {
    try {
      const { password, ...userData } = user; // Pisahkan password
      const updatedData = password ? { ...userData, password } : userData; // Sertakan password hanya jika diisi
  
      const token = await getToken();
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData), // Kirim data yang sudah disesuaikan
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memperbarui pengguna");
      }
  
      dispatch({ type: "UPDATE_USER", payload: updatedData });
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil diperbarui!",
      });
      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Gagal",
        description:
          error.message || "Terjadi kesalahan saat memperbarui pengguna",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!userId) {
      toast({
        title: "Gagal",
        description: "ID pengguna tidak ditemukan",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menghapus pengguna");
      }
  
      dispatch({ type: "DELETE_USER", payload: userId });
      toast({ title: "Berhasil", description: "Pengguna berhasil dihapus!" });
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Gagal",
        description:
         "Terjadi kesalahan saat menghapus pengguna",
        variant: "destructive",
      });
    }
  };
  

  return (
    <>
      <Toaster />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedUser(user);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setSelectedUser(user);
                  }}>
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Pengguna</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Nama</Label>
              <Input
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
              <Label>Email</Label>
              <Input
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
              <Label>Password (Opsional)</Label>
              <Input
                type="password"
                placeholder="Masukkan password baru (kosongkan jika tidak diubah)"
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value })
                }
              />

              <Label>Role</Label>
              <Select
                value={selectedUser.role}
                onValueChange={(value) =>
                  setSelectedUser({ ...selectedUser, role: value })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="USER">USER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                onClick={() => selectedUser && handleUpdateUser(selectedUser)}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedUser && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Pengguna</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus pengguna ini?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedUser.id && handleDeleteUser(selectedUser.id)
                }>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
