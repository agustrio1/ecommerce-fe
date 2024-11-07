"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type ForgotPasswordForm = {
  email: string;
};

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false); 

  const onSubmit = async (data: ForgotPasswordForm) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (res.ok) {
      router.push("/");
    } else {
      console.error("Forgot password error:", responseData.error);
      alert(responseData.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl text-center font-semibold mb-6">
          Lupa Kata Sandi
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
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
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="w-full flex items-center justify-center" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null} 
              {loading ? 'Memproses...' : 'Kirim'}
            </Button>
          </div>
        </form>
        <p className="text-center mt-4">
          Kembali ke{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
