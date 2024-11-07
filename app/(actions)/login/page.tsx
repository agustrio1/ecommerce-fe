"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false); 
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true); 
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/");
    } else {
      console.error("Login error:", responseData.error);
      alert(responseData.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl text-center font-semibold mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email harus diisi",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format email tidak valid",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Kata Sandi</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Kata sandi harus diisi",
                  minLength: {
                    value: 8,
                    message: "Kata sandi minimal 8 karakter",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="w-full flex items-center justify-center" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null} 
              {loading ? 'Memproses...' : 'Login'}
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>Belum punya akun? <Link href="/register" className="text-blue-500">Daftar</Link></p>
          <p>Lupa kata sandi? <Link href="/forgot-password" className="text-blue-500">Lupa kata sandi</Link></p>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
