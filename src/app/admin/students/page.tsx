"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  Clock, 
  ChevronRight,
  Download
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const studentsMock = [
  { id: "1", name: "Ricardo Silva", status: "PENDING", date: "2026-04-20", cpf: "123.***.***-01" },
  { id: "2", name: "Maria Oliveira", status: "APPROVED", date: "2026-04-18", cpf: "456.***.***-02" },
  { id: "3", name: "Gabriel Santos", status: "PENDING", date: "2026-04-15", cpf: "789.***.***-03" },
  { id: "4", name: "Ana Beatriz", status: "REJECTED", date: "2026-04-10", cpf: "321.***.***-04" },
  { id: "5", name: "Lucas Ferreira", status: "PENDING", date: "2026-04-25", cpf: "654.***.***-05" },
  { id: "6", name: "Juliana Costa", status: "APPROVED", date: "2026-04-22", cpf: "987.***.***-06" },
]

export default function StudentsListPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredStudents = studentsMock.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 uppercase tracking-wider">Aprovado</span>
      case "PENDING":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 uppercase tracking-wider">Pendente</span>
      case "REJECTED":
        return <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 uppercase tracking-wider">Rejeitado</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Lista de Alunos</h2>
          <p className="text-slate-500 mt-1">Gerencie e valide os cadastros de novos alunos.</p>
        </div>
        <Button variant="outline" className="gap-2 h-11 border-slate-200 text-slate-600 hover:bg-slate-50">
          <Download className="h-4 w-4" />
          Exportar Lista
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Buscar aluno por nome..." 
              className="pl-10 h-11 border-slate-200 focus-visible:ring-[#003366] rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 h-11 border-slate-200 text-slate-600 px-6 rounded-xl">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Aluno</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">CPF</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Data Cadastro</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#003366]/5 flex items-center justify-center text-[#003366] font-bold text-xs">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-semibold text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {student.cpf}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(student.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" asChild className="text-[#003366] hover:bg-blue-50 font-bold gap-1 group-hover:translate-x-1 transition-transform">
                      <Link href={`/admin/students/${student.id}/validate`}>
                        Validar
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredStudents.map((student) => (
            <Link 
              key={student.id} 
              href={`/admin/students/${student.id}/validate`}
              className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366] font-bold">
                  {student.name[0]}
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(student.status)}
                    <span className="text-[10px] text-slate-400 font-medium">{student.cpf}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </Link>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Nenhum aluno encontrado com "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
