import * as React from "react"
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 mt-1">Bem-vindo à central de controle do projeto Prevenindo com Arte.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total de Alunos", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Matrículas Ativas", value: "856", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pendentes de Validação", value: "42", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Crescimento Mensal", value: "+12%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-2.5 rounded-xl`}>
                <stat.icon className={`h-6 w-6 ${stat.icon === TrendingUp ? 'text-indigo-600' : stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Validar Novos Alunos</h3>
            <p className="text-slate-500 mb-6">Existem 42 novos cadastros aguardando sua revisão e aprovação.</p>
          </div>
          <Button asChild className="bg-[#003366] hover:bg-[#002244] w-fit gap-2 h-11 px-6 rounded-xl">
            <Link href="/admin/students">
              Ir para validação
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="bg-gradient-to-br from-[#003366] to-[#001a33] p-8 rounded-3xl text-white shadow-xl shadow-blue-900/20 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Gerenciar Modalidades</h3>
            <p className="text-blue-100 mb-6 text-sm opacity-80">Configure novas turmas, horários e vagas para as atividades esportivas.</p>
          </div>
          <Button variant="secondary" asChild className="bg-white text-[#003366] hover:bg-blue-50 w-fit gap-2 h-11 px-6 rounded-xl">
            <Link href="/admin/modalidades">
              Configurar Atividades
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Atividades Recentes</h3>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold">
            Ver tudo
          </Button>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs">
                {item === 1 ? 'RS' : item === 2 ? 'ML' : 'TP'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {item === 1 ? 'Ricardo Souza' : item === 2 ? 'Maria Letícia' : 'Tiago Pereira'} 
                  <span className="font-normal text-slate-500 ml-1">solicitou matrícula em</span>
                  <span className="text-[#003366] ml-1">Jiu-Jitsu Kids</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Há {item * 5} minutos</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Pendente
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
