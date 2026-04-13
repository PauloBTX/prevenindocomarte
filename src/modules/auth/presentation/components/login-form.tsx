"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, User, Eye, EyeOff } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    // alert(JSON.stringify(data))
    console.log(data)
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Prevenindo com Arte</h1>
        <p className="text-sm text-slate-600">
          Bem-vindo(a) de volta! Faça login para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2 relative">
          <Label htmlFor="username" className="text-slate-900">Usuário</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input
              id="username"
              placeholder="Digite seu usuário"
              className="pl-10 h-12 text-base border-slate-300 focus-visible:ring-slate-800"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-900">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              className="pl-10 pr-10 h-12 text-base border-slate-300 focus-visible:ring-slate-800"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-1">
          <a href="#" className="text-sm text-[#003366] hover:underline font-medium">
            Esqueceu a senha?
          </a>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            className="w-full h-12 text-base text-white bg-[#003366] hover:bg-[#002244] font-semibold transition-colors"
            disabled={isSubmitting}
          >
            Login
          </Button>

          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "w-full h-12 text-base bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#003366] font-semibold transition-colors"
            )}
          >
            Novo Usuário
          </Link>
        </div>
      </form>
    </div>
  )
}
