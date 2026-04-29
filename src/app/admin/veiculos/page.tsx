"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  ChevronRight,
  Download,
  Car,
  User
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const veiculosMock = [
  { id: "1", brand: "Toyota", model: "Corolla", plate: "ABC-1234", owner: "Ricardo Silva", studentId: "1" },
  { id: "2", brand: "Honda", model: "Civic", plate: "XYZ-9876", owner: "Ricardo Silva", studentId: "1" },
  { id: "3", brand: "Volkswagen", model: "Gol", plate: "KJU-5544", owner: "Gabriel Oliveira", studentId: "2" },
  { id: "4", brand: "Fiat", model: "Uno", plate: "PPT-0011", owner: "Gabriel Santos", studentId: "3" },
  { id: "5", brand: "Chevrolet", model: "Onix", plate: "BRA-2E19", owner: "Ana Beatriz", studentId: "4" },
  { id: "6", brand: "Jeep", model: "Compass", plate: "JKR-0909", owner: "Lucas Ferreira", studentId: "5" },
]

export default function VeiculosListPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredVeiculos = veiculosMock.filter(v => 
    v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Veículos</h2>
          <p className="text-slate-500 mt-1">Gerencie o controle de acesso e veículos cadastrados.</p>
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
              placeholder="Buscar por placa, modelo ou dono..." 
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
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Veículo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Placa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Proprietário</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVeiculos.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366] font-bold">
                        <Car className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{v.brand} {v.model}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold text-xs uppercase tracking-wider">
                      {v.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {v.owner}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" asChild className="text-[#003366] hover:bg-blue-50 font-bold gap-1 group-hover:translate-x-1 transition-transform">
                      <Link href={`/admin/students/${v.studentId}/validate?tab=vehicles`}>
                        Editar
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
          {filteredVeiculos.map((v) => (
            <Link 
              key={v.id} 
              href={`/admin/students/${v.studentId}/validate?tab=vehicles`}
              className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366] font-bold">
                  <Car className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{v.brand} {v.model}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-600 border border-slate-200">{v.plate}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{v.owner}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </Link>
          ))}
        </div>

        {filteredVeiculos.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Nenhum veículo encontrado com "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
