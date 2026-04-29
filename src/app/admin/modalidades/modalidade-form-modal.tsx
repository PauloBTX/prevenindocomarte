"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Clock, Plus, X, Trash2 } from "lucide-react"

interface ModalidadeFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
  initialData?: any
}

const DAYS_OF_WEEK = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo"
]

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const MINUTES = ["00", "15", "30", "45"]

const INSTRUCTORS = [
  "Sgt. Ricardo Silva",
  "Cabo Maria Oliveira",
  "Prof. Gabriel Santos",
  "Sgt. Ana Beatriz",
  "Cabo Lucas Ferreira",
  "Prof. Juliana Costa"
]

export function ModalidadeFormModal({ 
  isOpen, 
  onOpenChange, 
  onSave, 
  initialData 
}: ModalidadeFormModalProps) {
  const [name, setName] = React.useState(initialData?.name || "")
  const [type, setType] = React.useState(initialData?.type || "MARTIAL_ART")
  const [instructor, setInstructor] = React.useState(initialData?.instructor || "")
  
  // State: Record<Day, Array<Times>>
  const [selectedSchedule, setSelectedSchedule] = React.useState<Record<string, string[]>>(() => {
    if (!initialData?.schedule) return {}
    return initialData.schedule.reduce((acc: any, curr: any) => {
      if (!acc[curr.day]) acc[curr.day] = []
      if (!acc[curr.day].includes(curr.time)) {
        acc[curr.day].push(curr.time)
      }
      return acc
    }, {})
  })
  
  // Time Picker State
  const [timePickerDay, setTimePickerDay] = React.useState<string | null>(null)
  const [tempHour, setTempHour] = React.useState("08")
  const [tempMinute, setTempMinute] = React.useState("00")

  const handleDayClick = (day: string) => {
    setTempHour("08")
    setTempMinute("00")
    setTimePickerDay(day)
  }

  const saveTime = () => {
    if (timePickerDay) {
      const newTime = `${tempHour}:${tempMinute}`
      setSelectedSchedule(prev => {
        const currentTimes = prev[timePickerDay] || []
        if (currentTimes.includes(newTime)) return prev
        return {
          ...prev,
          [timePickerDay]: [...currentTimes, newTime].sort()
        }
      })
      setTimePickerDay(null)
    }
  }

  const removeTime = (day: string, timeIndex: number) => {
    setSelectedSchedule(prev => {
      const currentTimes = prev[day] || []
      const nextTimes = currentTimes.filter((_, i) => i !== timeIndex)
      const next = { ...prev }
      if (nextTimes.length === 0) {
        delete next[day]
      } else {
        next[day] = nextTimes
      }
      return next
    })
  }

  const handleSave = () => {
    // Flatten the Record into the expected schedule array format
    const schedule: { day: string, time: string }[] = []
    Object.entries(selectedSchedule).forEach(([day, times]) => {
      times.forEach(time => {
        schedule.push({ day, time })
      })
    })
    
    onSave({ name, type, instructor, schedule })
    onOpenChange(false)
  }

  // Reset form when modal opens with new/different data
  React.useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "")
      setType(initialData?.type || "MARTIAL_ART")
      setInstructor(initialData?.instructor || "")
      const initialSchedule = initialData?.schedule?.reduce((acc: any, curr: any) => {
        if (!acc[curr.day]) acc[curr.day] = []
        if (!acc[curr.day].includes(curr.time)) acc[curr.day].push(curr.time)
        return acc
      }, {}) || {}
      setSelectedSchedule(initialSchedule)
    }
  }, [isOpen, initialData])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl bg-white rounded-3xl">
          <DialogHeader className="p-8 bg-[#003366] text-white">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus className="h-6 w-6" />
              {initialData ? "Editar Modalidade" : "Nova Modalidade"}
            </DialogTitle>
            <p className="text-blue-100/70 text-sm mt-1">Configure os dias e horários da atividade.</p>
          </DialogHeader>

          <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome da Modalidade</Label>
              <Input 
                id="name" 
                placeholder="Ex: Judô Infantil, Karatê, Yoga..." 
                className="h-12 rounded-xl border-slate-200 focus:ring-[#003366]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Tipo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de Atividade</Label>
                <select 
                  id="type"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20 transition-all appearance-none cursor-pointer"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="MARTIAL_ART">Arte Marcial</option>
                  <option value="AEROBIC">Atividade Aeróbica</option>
                  <option value="DANCE">Dança</option>
                  <option value="OTHER">Outros</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instrutor Responsável</Label>
                <select 
                  id="instructor"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20 transition-all appearance-none cursor-pointer"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                >
                  <option value="">Selecione um instrutor...</option>
                  {INSTRUCTORS.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dias da Semana */}
            <div className="space-y-4">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selecione os Dias</Label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = !!selectedSchedule[day]
                  const dayShort = day.substring(0, 3)
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        "relative flex flex-col items-center justify-center py-4 rounded-xl border transition-all hover:scale-105",
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">{dayShort}</span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-blue-600 text-[10px] font-bold border border-blue-100">
                          {selectedSchedule[day].length}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Horários Listados */}
            {Object.keys(selectedSchedule).length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Horários Cadastrados</Label>
                <div className="space-y-3">
                  {DAYS_OF_WEEK.map(day => {
                    if (!selectedSchedule[day]) return null
                    return (
                      <div key={day} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-[#003366] uppercase tracking-widest">{day}</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedSchedule[day].map((time, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm group">
                              {time}
                              <button 
                                onClick={() => removeTime(day, idx)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => handleDayClick(day)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-all"
                          >
                            <Plus className="h-3 w-3" /> Add
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 mt-0">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-12 px-6 font-bold text-slate-500 hover:bg-slate-200 transition-all"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="rounded-xl h-12 px-8 font-bold bg-[#003366] hover:bg-[#002855] text-white shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
              disabled={!name || !instructor || Object.keys(selectedSchedule).length === 0}
            >
              Salvar Modalidade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mini Modal para Horário */}
      <Dialog open={!!timePickerDay} onOpenChange={(open) => !open && setTimePickerDay(null)}>
        <DialogContent className="sm:max-w-[300px] p-6 rounded-3xl border-none shadow-2xl bg-white animate-in zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Novo Horário: {timePickerDay}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-center gap-3 py-6">
            <div className="space-y-1.5 flex-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase text-center block">Hora</Label>
              <select 
                className="w-full h-12 text-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold focus:ring-2 focus:ring-blue-500/20"
                value={tempHour}
                onChange={(e) => setTempHour(e.target.value)}
              >
                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <span className="text-2xl font-bold text-slate-300 mt-4">:</span>
            <div className="space-y-1.5 flex-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase text-center block">Min</Label>
              <select 
                className="w-full h-12 text-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold focus:ring-2 focus:ring-blue-500/20"
                value={tempMinute}
                onChange={(e) => setTempMinute(e.target.value)}
              >
                {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
             <Button variant="ghost" onClick={() => setTimePickerDay(null)} className="flex-1 rounded-xl font-bold text-slate-500">
               Cancelar
             </Button>
             <Button onClick={saveTime} className="flex-1 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100">
               Adicionar
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
