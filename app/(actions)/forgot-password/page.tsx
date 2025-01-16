"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { motion } from "framer-motion";

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
    <AuthLayout title="Lupa Kata Sandi">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null} 
              {loading ? 'Memproses...' : 'Kirim'}
            </Button>
          </div>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center  mt-4"
        >
          Kembali ke{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-700 font-medium">
            Login
          </Link>
          </motion.p>
      </AuthLayout>
  );
};

export default ForgotPasswordPage;
