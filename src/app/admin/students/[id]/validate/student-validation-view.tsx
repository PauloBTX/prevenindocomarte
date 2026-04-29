"use client"

import * as React from "react"
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  User, 
  MapPin, 
  FileText, 
  Activity,
  Eye,
  Car,
  ShieldCheck,
  Phone,
  Heart,
  Users,
  Info,
  Calendar,
  Pencil,
  Save,
  Plus,
  Trash2,
  ChevronRight,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import marcas from "@/external/veiculos/marcas.json"
import { ConfirmationModal, ConfirmationModalType } from "@/components/ui/confirmation-modal"

interface StudentValidationViewProps {
  id: string
}

interface Vehicle {
  brand: string
  model: string
  plate: string
}

interface Guardian {
  name: string
  cpf: string
  whatsapp: string
}

export function StudentValidationView({ id }: StudentValidationViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") as "personal" | "vehicles") || "personal"
  const [activeTab, setActiveTab] = React.useState<"personal" | "vehicles">(initialTab)
  
  // Modal State
  const [modal, setModal] = React.useState<{
    isOpen: boolean
    title: string
    description: string
    type: ConfirmationModalType
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "question",
    onConfirm: () => {},
  })

  const openModal = (config: Omit<typeof modal, "isOpen">) => {
    setModal({ ...config, isOpen: true })
  }

  // State for editing
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [editValue, setEditValue] = React.useState<string>("")
  
  // Mock data for the specific student - now in state
  const [student, setStudent] = React.useState({
    id,
    type: id === "2" ? "DEPENDENT" : "SELF",
    name: id === "2" ? "Gabriel Oliveira" : "Ricardo Silva",
    status: "PENDING",
    cpf: id === "2" ? "444.555.666-77" : "123.456.789-01",
    email: id === "2" ? "gabriel.kids@email.com" : "ricardo.silva@email.com",
    phone: id === "2" ? "(61) 98888-0000" : "(61) 98765-4321",
    birthDate: id === "2" ? "2012-08-20" : "1995-05-15",
    notes: id === "2" ? "Aluno muito interessado em esporte." : "Deseja participar das aulas de Judô no período noturno.",
    health: {
      issues: id === "2" ? ["Alergias (alimentares, medicamentos, picadas, etc.)"] : ["Asma", "Problemas ortopédicos (joelho, coluna, etc.)"],
      observations: id === "2" ? "Alérgico a picada de abelha." : "Cirurgia no joelho esquerdo em 2022. Usa bombinha se necessário.",
      medicationContinuous: id === "1",
      medicationList: id === "1" ? "Aerolin, Condroitina" : "",
      medicationDuringClass: id === "1"
    },
    emergency: {
      contactName: id === "2" ? "Luciana Oliveira" : "Ana Silva",
      contactPhone: id === "2" ? "(61) 98877-6655" : "(61) 91234-5678",
      healthPlan: "Unimed",
      hospital: "Hospital de Base"
    },
    guardians: id === "2" ? [
      { name: "Carlos Oliveira", cpf: "987.654.321-00", whatsapp: "(61) 99988-7766" },
      { name: "Luciana Oliveira", cpf: "111.222.333-44", whatsapp: "(61) 98877-6655" }
    ] : [],
    vehicles: [
      { brand: "Toyota", model: "Corolla", plate: "ABC-1234" },
      { brand: "Honda", model: "Civic", plate: "XYZ-9876" }
    ],
    documents: [
      { type: "Documento com Foto", status: "VALID", name: "rg_frente.jpg" },
      { type: "Foto 3x4", status: "VALID", name: "foto_perfil.png" },
      { type: "Comprovante de Residência", status: "PENDING", name: "conta_luz.jpg" },
      { type: "Declaração Escolar / Nada Consta", status: "VALID", name: "nada_consta.pdf" }
    ]
  })

  // Vehicle adding state
  const [isAddingVehicle, setIsAddingVehicle] = React.useState(false)
  const [newVehicle, setNewVehicle] = React.useState<Vehicle>({ brand: "", model: "", plate: "" })
  const [models, setModels] = React.useState<any[]>([])

  // Helpers
  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) return null;
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const maskPlate = (value: string) => {
    let v = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (v.length > 7) v = v.slice(0, 7);
    
    // Pattern: 3 letters followed by 4 numbers OR 3 letters, 1 number, 1 letter, 2 numbers
    if (v.length > 3) {
      // Check if 5th char is a digit (Old pattern)
      const isOldPattern = /^[A-Z]{3}[0-9]/.test(v);
      if (isOldPattern && !/^[A-Z]{3}[0-9][A-Z]/.test(v)) {
        return v.slice(0, 3) + "-" + v.slice(3);
      }
    }
    return v;
  };

  const age = calculateAge(student.birthDate)

  // Edit Handlers
  const startEditing = (field: string, value: string) => {
    setEditingField(field)
    setEditValue(value)
  }

  const saveEdit = (field: string) => {
    openModal({
      title: "Confirmar Alteração",
      description: "Deseja salvar as alterações realizadas neste campo?",
      type: "question",
      onConfirm: () => {
        const keys = field.split(".")
        setStudent(prev => {
          const next = JSON.parse(JSON.stringify(prev))
          let target = next
          for (let i = 0; i < keys.length - 1; i++) {
            target = target[keys[i]]
          }
          target[keys[keys.length - 1]] = editValue
          return next
        })
        setEditingField(null)
      }
    })
  }

  // Vehicle Handlers
  const handleBrandChange = async (brandName: string) => {
    setNewVehicle(prev => ({ ...prev, brand: brandName, model: "" }))
    const brand = marcas.find(m => m.nome === brandName)
    if (brand) {
      try {
        const data = await import(`@/external/veiculos/${brand.codigo}.json`)
        setModels(data.modelos)
      } catch (e) {
        setModels([])
      }
    } else {
      setModels([])
    }
  }

  const addVehicle = () => {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.plate) {
      openModal({
        title: "Campos Incompletos",
        description: "Por favor, preencha todos os campos do veículo antes de salvar.",
        type: "warning",
        onConfirm: () => {}
      })
      return
    }
    
    setStudent(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle]
    }))
    setNewVehicle({ brand: "", model: "", plate: "" })
    setIsAddingVehicle(false)
  }

  const removeVehicle = (index: number) => {
    openModal({
      title: "Remover Veículo",
      description: `Tem certeza que deseja remover o veículo ${student.vehicles[index].brand} ${student.vehicles[index].model}?`,
      type: "danger",
      onConfirm: () => {
        setStudent(prev => ({
          ...prev,
          vehicles: prev.vehicles.filter((_, i) => i !== index)
        }))
      }
    })
  }

  const handleApprove = () => {
    openModal({
      title: "Aprovar Inscrição",
      description: "Ao aprovar, o aluno será notificado e poderá iniciar as atividades após a retirada da carteirinha.",
      type: "success",
      onConfirm: () => {
        router.push("/admin/students")
      }
    })
  }

  const handleReject = () => {
    openModal({
      title: "Rejeitar Inscrição",
      description: "Tem certeza que deseja rejeitar este cadastro? Esta ação não pode ser desfeita facilmente.",
      type: "danger",
      onConfirm: () => {
        router.push("/admin/students")
      }
    })
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        onOpenChange={(open) => setModal(prev => ({ ...prev, isOpen: open }))}
        title={modal.title}
        description={modal.description}
        type={modal.type}
        onConfirm={modal.onConfirm}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-slate-200">
            <Link href="/admin/students">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-bold text-slate-900">Validar Cadastro</h2>
               <span className={cn(
                 "px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                 student.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-green-50 text-green-700 border-green-100"
               )}>
                 {student.status === "PENDING" ? "Aguardando Revisão" : "Aprovado"}
               </span>
            </div>
            <p className="text-slate-500">Analise e edite os dados conforme necessário.</p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 w-fit border border-slate-200/50">
          <button
            onClick={() => setActiveTab("personal")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "personal" 
                ? "bg-white text-[#003366] shadow-sm" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            <User className="h-4 w-4" />
            Dados Pessoais
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "vehicles" 
                ? "bg-white text-[#003366] shadow-sm" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            <Car className="h-4 w-4" />
            Veículos ({student.vehicles.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === "personal" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Section: Personal Info */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#003366]" />
                    <h3 className="font-bold text-slate-900">Informações Básicas</h3>
                  </div>
                  {student.type === "DEPENDENT" && (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-[#003366] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      Dependente / Menor
                    </span>
                  )}
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                  <EditableItem 
                    label="Nome Completo" 
                    value={student.name} 
                    id="name"
                    editingField={editingField}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStartEdit={() => startEditing("name", student.name)}
                    onSave={() => saveEdit("name")}
                  />
                  <EditableItem 
                    label="CPF" 
                    value={student.cpf} 
                    id="cpf"
                    editingField={editingField}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStartEdit={() => startEditing("cpf", student.cpf)}
                    onSave={() => saveEdit("cpf")}
                  />
                  <div className="space-y-1 group">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Data de Nascimento / Idade</span>
                      <button onClick={() => startEditing("birthDate", student.birthDate)} className="p-1 opacity-0 group-hover:opacity-100 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Pencil className="h-3 w-3" />
                      </button>
                    </div>
                    {editingField === "birthDate" ? (
                      <div className="flex gap-2 items-center">
                        <Input type="date" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="h-8" />
                        <Button size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700 shrink-0" onClick={() => saveEdit("birthDate")}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-slate-800">{new Date(student.birthDate).toLocaleDateString('pt-BR')}</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-lg text-xs font-bold border",
                          age && age < 18 ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                          {age} anos {age && age < 18 ? "(Menor)" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                  <EditableItem 
                    label="E-mail" 
                    value={student.email} 
                    id="email"
                    editingField={editingField}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStartEdit={() => startEditing("email", student.email)}
                    onSave={() => saveEdit("email")}
                  />
                  <EditableItem 
                    label="WhatsApp / Telefone" 
                    value={student.phone} 
                    id="phone"
                    editingField={editingField}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStartEdit={() => startEditing("phone", student.phone)}
                    onSave={() => saveEdit("phone")}
                  />
                  <EditableItem 
                    label="Observações de Cadastro" 
                    value={student.notes} 
                    id="notes"
                    fullWidth
                    editingField={editingField}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStartEdit={() => startEditing("notes", student.notes)}
                    onSave={() => saveEdit("notes")}
                  />
                </div>
              </section>

              {/* Section: Guardians (If Dependent) */}
              {student.type === "DEPENDENT" && (
                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-[#003366]" />
                      <h3 className="font-bold text-slate-900">Responsáveis Legais</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    {student.guardians.map((guardian, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 grid grid-cols-1 sm:grid-cols-3 gap-6 relative group">
                        <EditableItem 
                          label={`Nome Responsável ${i+1}`} 
                          value={guardian.name} 
                          id={`guardians.${i}.name`}
                          editingField={editingField}
                          editValue={editValue}
                          setEditValue={setEditValue}
                          onStartEdit={() => startEditing(`guardians.${i}.name`, guardian.name)}
                          onSave={() => saveEdit(`guardians.${i}.name`)}
                        />
                        <EditableItem 
                          label="CPF" 
                          value={guardian.cpf} 
                          id={`guardians.${i}.cpf`}
                          editingField={editingField}
                          editValue={editValue}
                          setEditValue={setEditValue}
                          onStartEdit={() => startEditing(`guardians.${i}.cpf`, guardian.cpf)}
                          onSave={() => saveEdit(`guardians.${i}.cpf`)}
                        />
                        <EditableItem 
                          label="WhatsApp" 
                          value={guardian.whatsapp} 
                          id={`guardians.${i}.whatsapp`}
                          editingField={editingField}
                          editValue={editValue}
                          setEditValue={setEditValue}
                          onStartEdit={() => startEditing(`guardians.${i}.whatsapp`, guardian.whatsapp)}
                          onSave={() => saveEdit(`guardians.${i}.whatsapp`)}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section: Health & Emergency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-red-600" />
                      <h3 className="font-bold text-slate-900">Saúde</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-2 group">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Condições / Problemas</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {student.health.issues.map((issue, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[11px] font-medium border border-red-100">
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                    <EditableItem 
                      label="Obs. de Saúde" 
                      value={student.health.observations} 
                      id="health.observations"
                      editingField={editingField}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onStartEdit={() => startEditing("health.observations", student.health.observations)}
                      onSave={() => saveEdit("health.observations")}
                    />
                    <div className="pt-4 border-t border-slate-50 space-y-3">
                       <HealthCheck label="Uso contínuo de medicamentos" checked={student.health.medicationContinuous} />
                       {student.health.medicationContinuous && (
                         <div className="pl-6 space-y-4 border-l-2 border-slate-100 ml-2">
                           <EditableItem 
                              label="Lista de Medicamentos" 
                              value={student.health.medicationList} 
                              id="health.medicationList"
                              editingField={editingField}
                              editValue={editValue}
                              setEditValue={setEditValue}
                              onStartEdit={() => startEditing("health.medicationList", student.health.medicationList)}
                              onSave={() => saveEdit("health.medicationList")}
                            />
                           <HealthCheck label="Toma durante a aula" checked={student.health.medicationDuringClass} />
                         </div>
                       )}
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <h3 className="font-bold text-slate-900">Emergência</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <EditableItem 
                      label="Contato" 
                      value={student.emergency.contactName} 
                      id="emergency.contactName"
                      editingField={editingField}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onStartEdit={() => startEditing("emergency.contactName", student.emergency.contactName)}
                      onSave={() => saveEdit("emergency.contactName")}
                    />
                    <EditableItem 
                      label="Telefone" 
                      value={student.emergency.contactPhone} 
                      id="emergency.contactPhone"
                      editingField={editingField}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onStartEdit={() => startEditing("emergency.contactPhone", student.emergency.contactPhone)}
                      onSave={() => saveEdit("emergency.contactPhone")}
                    />
                    <EditableItem 
                      label="Plano de Saúde" 
                      value={student.emergency.healthPlan} 
                      id="emergency.healthPlan"
                      editingField={editingField}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onStartEdit={() => startEditing("emergency.healthPlan", student.emergency.healthPlan)}
                      onSave={() => saveEdit("emergency.healthPlan")}
                    />
                    <EditableItem 
                      label="Hospital" 
                      value={student.emergency.hospital} 
                      id="emergency.hospital"
                      editingField={editingField}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onStartEdit={() => startEditing("emergency.hospital", student.emergency.hospital)}
                      onSave={() => saveEdit("emergency.hospital")}
                    />
                  </div>
                </section>
              </div>

              {/* Section: Documents */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#003366]" />
                    <h3 className="font-bold text-slate-900">Documentação</h3>
                  </div>
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {student.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors bg-slate-50/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                          <FileText className={cn("h-5 w-5", doc.status === "VALID" ? "text-green-500" : "text-amber-500")} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{doc.type}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{doc.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === "VALID" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50 h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-[#003366]" />
                    <h3 className="font-bold text-slate-900">Veículos do Aluno</h3>
                  </div>
                  <Button 
                    onClick={() => setIsAddingVehicle(true)} 
                    size="sm" 
                    className="bg-[#003366] hover:bg-[#002855] text-white rounded-xl gap-2 shadow-lg shadow-blue-100"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Veículo
                  </Button>
                </div>
                <div className="p-8">
                  
                  {/* Add Vehicle Form */}
                  {isAddingVehicle && (
                    <div className="mb-8 p-6 rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/30 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-[#003366] flex items-center gap-2">
                          <Plus className="h-4 w-4" /> Novo Veículo
                        </h4>
                        <Button variant="ghost" size="sm" onClick={() => setIsAddingVehicle(false)} className="text-slate-400">Cancelar</Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Marca</Label>
                          <select 
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
                            value={newVehicle.brand}
                            onChange={(e) => handleBrandChange(e.target.value)}
                          >
                            <option value="">Selecione...</option>
                            {marcas.map(m => <option key={m.codigo} value={m.nome}>{m.nome}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Modelo</Label>
                          <select 
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
                            disabled={!newVehicle.brand}
                            value={newVehicle.model}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                          >
                            <option value="">Selecione...</option>
                            {models.map(m => <option key={m.nome} value={m.nome}>{m.nome}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Placa</Label>
                          <Input 
                            placeholder="ABC-1234 ou ABC1D23" 
                            className="h-10 uppercase"
                            maxLength={8}
                            value={newVehicle.plate}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, plate: maskPlate(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                         <Button onClick={addVehicle} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl gap-2">
                           <Save className="h-4 w-4" />
                           Salvar Veículo
                         </Button>
                      </div>
                    </div>
                  )}

                  {student.vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {student.vehicles.map((v, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 flex items-center gap-6 relative overflow-hidden group hover:border-red-100 transition-all">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                            <Car className="h-7 w-7 text-[#003366]" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Veículo {i+1}</p>
                            <h4 className="text-lg font-bold text-slate-900">{v.brand} {v.model}</h4>
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono font-bold text-sm">
                              {v.plate}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeVehicle(i)}
                            className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Car className="h-8 w-8" />
                      </div>
                      <p className="text-slate-500 font-medium">Nenhum veículo cadastrado para este aluno.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Right Column: Decisions */}
        <div className="space-y-8 sticky top-24">
           <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#003366]" />
              <h3 className="font-bold text-slate-900">Veredito do Admin</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Confirme se os documentos batem com os dados informados. 
                  <span className="block mt-1 font-bold">Verificação presencial ainda será necessária.</span>
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleApprove}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold gap-2 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Aprovar Cadastro
                </Button>
                
                <Button 
                  onClick={handleReject}
                  variant="outline"
                  className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 font-bold gap-2 rounded-xl"
                >
                  <XCircle className="h-5 w-5" />
                  Rejeitar Inscrição
                </Button>
              </div>

              <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed font-bold uppercase tracking-widest">
                  Status de Auditoria
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <Calendar className="h-4 w-4" />
                   <span>Atualizado hoje, às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

interface EditableItemProps {
  label: string
  value: string
  id: string
  fullWidth?: boolean
  editingField: string | null
  editValue: string
  setEditValue: (v: string) => void
  onStartEdit: () => void
  onSave: () => void
}

function EditableItem({ 
  label, 
  value, 
  id, 
  fullWidth = false,
  editingField,
  editValue,
  setEditValue,
  onStartEdit,
  onSave
}: EditableItemProps) {
  const isEditing = editingField === id

  return (
    <div className={cn("space-y-1 group", fullWidth && "sm:col-span-2")}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        {!isEditing && (
          <button 
            onClick={onStartEdit}
            className="p-1 opacity-0 group-hover:opacity-100 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Editar campo"
          >
            <Pencil className="h-3 w-3" />
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="flex gap-2 items-center animate-in slide-in-from-left-2 duration-300">
          <Input 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)} 
            className="h-9 focus-visible:ring-blue-500" 
            autoFocus
          />
          <Button 
            size="icon" 
            className="h-9 w-9 bg-green-600 hover:bg-green-700 shrink-0 shadow-lg shadow-green-100" 
            onClick={onSave}
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <p className="text-base font-semibold text-slate-800 leading-relaxed min-h-[1.5rem]">
          {value || "-"}
        </p>
      )}
    </div>
  )
}

function HealthCheck({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
        checked ? "bg-[#003366] border-[#003366]" : "bg-white border-slate-200"
      )}>
        {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
      </div>
      <span className={cn("text-xs font-medium", checked ? "text-slate-900" : "text-slate-400")}>
        {label}
      </span>
    </div>
  )
}
