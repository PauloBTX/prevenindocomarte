"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  ChevronRight,
  Download,
  BookOpen,
  Plus,
  Calendar,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModalidadeFormModal } from "./modalidade-form-modal"
import { cn } from "@/lib/utils"

interface Schedule {
  day: string
  time: string
}

interface Modalidade {
  id: string
  name: string
  type: string
  instructor: string
  schedule: Schedule[]
}

const modalidadesMock: Modalidade[] = [
  { 
    id: "1", 
    name: "Judô Infantil", 
    type: "MARTIAL_ART", 
    instructor: "Sgt. Ricardo Silva",
    schedule: [
      { day: "Segunda", time: "08:30" },
      { day: "Segunda", time: "14:30" },
      { day: "Quarta", time: "08:30" },
      { day: "Quarta", time: "14:30" },
    ] 
  },
  { 
    id: "2", 
    name: "Yoga Matinal", 
    type: "OTHER", 
    instructor: "Prof. Juliana Costa",
    schedule: [
      { day: "Terça", time: "07:00" },
      { day: "Quinta", time: "07:00" }
    ] 
  },
  { 
    id: "3", 
    name: "Zumba Fitness", 
    type: "DANCE", 
    instructor: "Cabo Maria Oliveira",
    schedule: [
      { day: "Segunda", time: "18:00" },
      { day: "Sexta", time: "18:00" },
      { day: "Sexta", time: "19:00" }
    ] 
  },
  { 
    id: "4", 
    name: "Karatê Adulto", 
    type: "MARTIAL_ART", 
    instructor: "Sgt. Ana Beatriz",
    schedule: [
      { day: "Terça", time: "19:30" },
      { day: "Quinta", time: "19:30" },
      { day: "Sábado", time: "09:00" }
    ] 
  },
  { 
    id: "5", 
    name: "Funcional", 
    type: "AEROBIC", 
    instructor: "Cabo Lucas Ferreira",
    schedule: [
      { day: "Segunda", time: "07:30" },
      { day: "Quarta", time: "07:30" },
      { day: "Sexta", time: "07:30" }
    ] 
  },
]

export default function ModalidadesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingModalidade, setEditingModalidade] = React.useState<Modalidade | null>(null)
  const [modalidades, setModalidades] = React.useState<Modalidade[]>(modalidadesMock)

  const filteredModalidades = modalidades.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "MARTIAL_ART":
        return <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-100 uppercase tracking-wider">Arte Marcial</span>
      case "AEROBIC":
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 uppercase tracking-wider">Aeróbica</span>
      case "DANCE":
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100 uppercase tracking-wider">Dança</span>
      case "OTHER":
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-700 text-[10px] font-bold border border-slate-100 uppercase tracking-wider">Outros</span>
      default:
        return null
    }
  }

  const formatSchedule = (schedule: Schedule[]) => {
    if (!schedule || schedule.length === 0) return "Não definido"
    
    // Group by day order
    const dayOrder = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
    const grouped: Record<string, string[]> = {}
    
    schedule.forEach(s => {
      if (!grouped[s.day]) grouped[s.day] = []
      grouped[s.day].push(s.time)
    })

    return dayOrder
      .filter(day => grouped[day])
      .map(day => {
        const times = grouped[day].sort().join(", ")
        return `${day.substring(0, 3)} (${times})`
      })
      .join(" | ")
  }

  const handleSave = (data: any) => {
    if (editingModalidade) {
      setModalidades(prev => prev.map(m => m.id === editingModalidade.id ? { ...m, ...data } : m))
    } else {
      const newModalidade = {
        id: (modalidades.length + 1).toString(),
        ...data
      }
      setModalidades(prev => [...prev, newModalidade])
    }
    setEditingModalidade(null)
  }

  const handleEdit = (m: Modalidade) => {
    setEditingModalidade(m)
    setIsModalOpen(true)
  }

  const handleNew = () => {
    setEditingModalidade(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Modalidades</h2>
          <p className="text-slate-500 mt-1">Gerencie as atividades esportivas e horários disponíveis.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 h-11 border-slate-200 text-slate-600 hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button 
            onClick={handleNew}
            className="gap-2 h-11 bg-[#003366] hover:bg-[#002855] text-white shadow-lg shadow-blue-100 rounded-xl px-6"
          >
            <Plus className="h-4 w-4" />
            Nova Modalidade
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Buscar modalidade..." 
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
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Modalidade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Instrutor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Dias e Horários</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredModalidades.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#003366]/5 flex items-center justify-center text-[#003366] font-bold">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-slate-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getTypeLabel(m.type)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">{m.instructor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formatSchedule(m.schedule)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(m)}
                      className="text-[#003366] hover:bg-blue-50 font-bold gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Editar
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredModalidades.map((m) => (
            <div 
              key={m.id} 
              onClick={() => handleEdit(m)}
              className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366] font-bold">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                  <div className="flex flex-col gap-1">
                    {getTypeLabel(m.type)}
                    <p className="text-[10px] font-bold text-[#003366] uppercase tracking-wider">{m.instructor}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                      <Clock className="h-3 w-3" />
                      {formatSchedule(m.schedule)}
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </div>
          ))}
        </div>

        {filteredModalidades.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Nenhuma modalidade encontrada com "{searchTerm}"</p>
          </div>
        )}
      </div>

      <ModalidadeFormModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSave}
        initialData={editingModalidade}
      />
    </div>
  )
}
