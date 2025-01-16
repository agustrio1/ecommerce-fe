"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";
import { motion } from "framer-motion";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    setLoading(false);
    if (res.ok) {
      router.push("/login");
    } else {
      router.push("/register");
      console.error("Registration error:", responseData.error);
    }
  };

  const validatePassword = (password: string) => {
    const criteria = [
      { regex: /.{8,}/, label: "Minimal 8 karakter" },
      { regex: /[A-Z]/, label: "Huruf besar" },
      { regex: /[a-z]/, label: "Huruf kecil" },
      { regex: /[0-9]/, label: "Angka" },
      { regex: /[^A-Za-z0-9]/, label: "Karakter khusus" },
    ];

    return criteria.map(({ regex, label }) => ({
      label,
      valid: regex.test(password),
    }));
  };

  const passwordCriteria = validatePassword(password || "");

  return (
    <AuthLayout title="Buat Akun">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            type="text"
            {...register("name", { required: "Nama harus diisi" })}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div>
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
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="password">Kata Sandi</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Kata sandi harus diisi",
                validate: (value) =>
                  validatePassword(value).every((criteria) => criteria.valid) ||
                  "Kata sandi harus memenuhi semua kriteria",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
          <div className="mt-2 space-y-1">
            {passwordCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center space-x-2">
                {criteria.valid ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <XCircle className="text-red-500" size={16} />
                )}
                <span
                  className={`text-sm ${
                    criteria.valid ? "text-green-500" : "text-red-500"
                  }`}>
                  {criteria.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
      </form>
      <div className="text-center mt-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}>
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Masuk
          </Link>
        </motion.p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
