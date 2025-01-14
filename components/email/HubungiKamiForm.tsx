'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HubungiKamiForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    text: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Sanitasi data form
    const sanitizedFormData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      text: formData.text.trim(),
    };

    // Validasi data form
    if (!sanitizedFormData.name || !sanitizedFormData.email || !sanitizedFormData.text) {
      alert("Semua kolom wajib diisi.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedFormData),
      });

      if (response.ok) {
        alert("Pesan berhasil dikirim!");
        setFormData({ name: '', email: '', text: '' });
      } else {
        alert("Terjadi kesalahan saat mengirim pesan.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim pesan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nama
        </label>
        <Input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          Pesan
        </label>
        <Textarea
          name="text"
          id="text"
          rows={4}
          value={formData.text}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Button type="submit" className="w-full">
          Kirim Pesan
        </Button>
      </div>
    </form>
  );
}
