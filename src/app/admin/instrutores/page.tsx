import * as React from "react"
import { UserSquare2, Construction } from "lucide-react"

export default function InstrutoresPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#003366]">
        <UserSquare2 className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Instrutores</h2>
      <p className="text-slate-500 max-w-md mx-auto">Esta área está em desenvolvimento. Em breve você poderá gerenciar a equipe de instrutores.</p>
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
        <Construction className="h-3.5 w-3.5" />
        Em Construção
      </div>
    </div>
  )
}
