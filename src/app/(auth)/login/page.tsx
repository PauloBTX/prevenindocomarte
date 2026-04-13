import { LoginForm } from "@/modules/auth/presentation/components/login-form"

// We can place the logo or text at the top here, or inside LoginForm.
// Based on the image, the logo is at the very top.
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="mb-8 w-24 h-24 bg-slate-100/50 flex items-center justify-center rounded-[2rem] shadow-sm">
        {/* Placeholder para a logo real */}
        <div className="font-bold text-[#003366] text-xl flex items-center gap-1">
          <span className="text-green-600">▲</span>PMDF
        </div>
      </div>
      
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
