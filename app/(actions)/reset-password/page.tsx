'use client'

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { EyeIcon, EyeOffIcon, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"

type ResetPasswordForm = {
  email: string
  newPassword: string
}

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>()
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const password = watch("newPassword")

  const validatePassword = (password: string) => {
    const criteria = [
      { regex: /.{8,}/, label: "Minimal 8 karakter" },
      { regex: /[A-Z]/, label: "Huruf besar" },
      { regex: /[a-z]/, label: "Huruf kecil" },
      { regex: /[0-9]/, label: "Angka" },
      { regex: /[^A-Za-z0-9]/, label: "Karakter khusus" },
    ]

    return criteria.map(({ regex, label }) => ({
      label,
      valid: regex.test(password),
    }))
  }

  const passwordCriteria = validatePassword(password || "")

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true)

    if (!token) {
      alert("Token tidak ditemukan. Pastikan Anda mengakses link reset dengan benar.")
      setLoading(false)
      return
    }

    const payload = { ...data, token }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const responseData = await res.json()

      if (res.ok) {
        router.push("/login")
      } else {
        console.error("Reset password error:", responseData.error)
        alert(responseData.error || "Gagal reset password")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      alert("Terjadi kesalahan saat menghubungi server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Kata Sandi">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "Email harus diisi" })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="newPassword">Kata Sandi Baru</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              {...register("newPassword", {
                required: "Password harus diisi",
                validate: (value) =>
                  validatePassword(value).every((criteria) => criteria.valid) ||
                  "Kata sandi harus memenuhi semua kriteria",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-red-500 text-sm">{errors.newPassword.message}</span>
          )}
          <div className="mt-2 space-y-1">
            {passwordCriteria.map((criteria, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {criteria.valid ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <XCircle className="text-red-500" size={16} />
                )}
                <span className={`text-sm ${criteria.valid ? 'text-green-500' : 'text-red-500'}`}>
                  {criteria.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Reset Kata Sandi"
          )}
        </Button>
      </form>
      <div className="mt-4 text-center space-y-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Belum menerima email?{" "}
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Kirim ulang email
          </Link>
        </motion.p>
      </div>
    </AuthLayout>
  )
}

export default ResetPasswordPage

