"use client";

import Link from "next/link";
import { ChevronLeft, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterChoicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Header Form */}
      <div className="w-full bg-white h-16 shadow-xs flex items-center px-4 md:px-8 border-b">
        <div className="max-w-md w-full mx-auto flex items-center gap-4 relative">
          <button 
            type="button" 
            onClick={() => router.push("/login")} 
            className="absolute left-0 p-2 text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="w-full text-center text-slate-800 font-bold text-lg md:text-xl">Escolha Tipo de Cadastro</h1>
        </div>
      </div>

      <div className="w-full max-w-md p-6 pt-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="text-center text-slate-500 text-base mb-2">Selecione o perfil para iniciar o cadastro.</p>
        
        {/* Dependent Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase">Cadastro Protegido</p>
            <h2 className="text-xl font-bold text-slate-800">Criança/Adolescente/Vulnerável</h2>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            Para menores ou pessoas em situação de vulnerabilidade, com o acompanhamento de um responsável.
          </p>
          <Link href="/register/dependent" className="w-full">
            <button className="w-full py-4 rounded-xl bg-[#002855] hover:bg-[#003875] text-white font-semibold text-base transition-colors shadow-sm">
              Iniciar Cadastro
            </button>
          </Link>
        </div>

        {/* Self Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-[#002855]" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase">Cadastro Individual</p>
            <h2 className="text-xl font-bold text-slate-800">Adulto</h2>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            Para usuários maiores de 18 anos que desejam se cadastrar individualmente.
          </p>
          <Link href="/register/self" className="w-full">
            <button className="w-full py-4 rounded-xl bg-[#002855] hover:bg-[#003875] text-white font-semibold text-base transition-colors shadow-sm">
              Iniciar Cadastro
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
