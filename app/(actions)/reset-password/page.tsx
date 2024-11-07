"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ResetPasswordForm = {
  email: string;
  newPassword: string;
};

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);

    if (!token) {
      alert(
        "Token tidak ditemukan. Pastikan Anda mengakses link reset dengan benar."
      );
      setLoading(false);
      return;
    }

    const payload = { ...data, token };
    // console.log("Payload yang dikirim:", payload);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();

    if (res.ok) {
      router.push("/login");
    } else {
      console.error("Reset password error:", responseData.error);
      alert(responseData.error || "Gagal reset password");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="max-w-md w-full p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl text-center font-semibold mb-6">
          Reset Kata Sandi
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email harus diisi" })}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="newPassword">Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                id="newPassword" 
                type={showPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "Password harus diisi",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-red-500">{errors.newPassword.message}</span>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? "Memproses..." : "Reset Kata Sandi"}
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
          <p>
            Belum menerima email?{" "}
            <Link href="/forgot-password" className="text-blue-500">
              Kirim ulang email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
