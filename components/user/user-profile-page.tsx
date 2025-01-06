'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { getToken } from '@/utils/token';
import { useToast } from '@/hooks/use-toast';
import { Save, Settings } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const UserProfilePage = () => {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({ name: '', email: '', password: '' });
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        const userPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = userPayload?.id;

        if (!userId) {
          throw new Error('ID pengguna tidak ditemukan dalam token');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Gagal memuat data pengguna');

        const userData = await res.json();
        setUser(userData.user);
        setEditData({ name: userData.user.name, email: userData.user.email, password: '' });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat profil pengguna',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [toast]); // Empty array ensures this runs only once during initial mount

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
        const token = await getToken();
        if (!token) throw new Error('Token tidak ditemukan');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user?.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editData), 
        });

        if (!res.ok) throw new Error('Gagal menyimpan perubahan');

        const updatedUser = await res.json();
        setUser(updatedUser.user);
        setIsEditing(false);
        toast({
            title: 'Berhasil',
            description: 'Perubahan berhasil disimpan',
        });
    } catch (error) {
        console.error('Error:', error);
        toast({
            title: 'Error',
            description: 'Gagal menyimpan perubahan',
            variant: 'destructive',
        });
    }
};

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
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

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent>
          <p className="text-center">Pengguna tidak ditemukan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Nama
              </label>
              <Input
                id="name"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password (opsional)
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={editData.password}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <Button onClick={handleSave} className="w-full mt-4" variant="default">
              <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col space-y-2">
              <span className="font-semibold">Nama:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-semibold">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-semibold">Dibuat:</span>
              <span>{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-semibold">Diperbarui Terakhir:</span>
              <span>{formatDate(user.updatedAt)}</span>
            </div>
            <Button onClick={handleEditToggle} className="w-full mt-4" variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Edit Profil
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
