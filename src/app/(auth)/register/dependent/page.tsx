"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ChevronLeft, Info, Plus, Trash2, ArrowRight, CheckCircle2, ArrowLeft, MapPin, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import marcas from "@/external/veiculos/marcas.json";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { FileUploadCard } from "@/components/ui/file-upload-card";
import { PasswordStrengthInput } from "@/components/ui/password-strength-input";
import { PhotoCropperModal } from "@/components/ui/photo-cropper-modal";
import { REGISTRATION_CONFIG } from "@/config/registration";
import { cn } from "@/lib/utils";

const reqStr = (msg: string) => z.string().min(1, msg);

const vehicleSchema = z.object({
  brand: reqStr("Marca obrigatória").min(2, "Mínimo 2 caracteres"),
  model: reqStr("Modelo obrigatório").min(2, "Mínimo 2 caracteres"),
  plate: reqStr("Placa obrigatória").regex(/^([a-zA-Z]{3}-?[0-9]{4}|[a-zA-Z]{3}[0-9][a-zA-Z][0-9]{2}|[a-zA-Z]{3}[0-9]{2}[a-zA-Z][0-9])$/, "Placa inválida (ex: ABC-1234 ou ABC1D23)"),
});

const guardianSchema = z.object({
  name: reqStr("Nome do responsável obrigatório").refine(val => val.trim().split(/\s+/).length >= 2, "Digite nome e sobrenome"),
  cpf: reqStr("CPF do responsável obrigatório").min(14, "CPF incompleto"),
  whatsapp: reqStr("WhatsApp do responsável obrigatório").min(14, "WhatsApp incompleto"),
});

const formSchema = z.object({
  videoPassword: reqStr("Digite a senha do vídeo").refine((val) => val === REGISTRATION_CONFIG.videoPassword, "Senha incorreta do vídeo"),
  name: reqStr("Nome completo obrigatório")
    .min(3, "Mínimo 3 caracteres")
    .refine(val => val.trim().split(/\s+/).length >= 2, "Digite o nome e sobrenome"),
  cpf: reqStr("CPF obrigatório").min(14, "CPF incompleto"), // length with mask is 14
  birthDate: reqStr("Data obrigatória").min(10, "Data incompleta"),
  whatsapp: reqStr("Telefone obrigatório").min(14, "Telefone incompleto"),
  email: reqStr("E-mail obrigatório").email("E-mail inválido"),
  healthIssues: z.array(z.string()).optional(),
  healthObservations: z.string().optional(),
  medicationContinuous: z.boolean().default(false),
  medicationList: z.string().optional(),
  medicationDuringClass: z.boolean().default(false),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyHealthPlan: z.string().optional(),
  emergencyHospital: z.string().optional(),
  password: reqStr("Senha de acesso obrigatória").min(6, "No mínimo 6 caracteres"),
  confirmPassword: reqStr("Confirmação de senha obrigatória").min(1, "Confirme sua senha"),
  needsParking: z.boolean().default(false),
  vehicles: z.array(vehicleSchema).max(3).optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "Aceite obrigatório para aprovação"),
  acceptRules: z.boolean().refine((val) => val === true, "Aceite obrigatório para aprovação"),
  notes: z.string().optional(),
  
  // Dependent fields
  guardians: z.array(guardianSchema).min(1, "Adicione ao menos um responsável").max(3),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.emergencyContactName && (!data.emergencyContactPhone || data.emergencyContactPhone.trim() === "")) return false;
  return true;
}, {
  message: "Telefone de emergência obrigatório ao informar o acompanhante",
  path: ["emergencyContactPhone"],
}).refine((data) => {
  if (data.needsParking && (!data.vehicles || data.vehicles.length === 0)) return false;
  return true;
}, {
  message: "Adicione ao menos 1 veículo",
  path: ["vehicles"],
}).refine((data) => {
  if (data.medicationContinuous && (!data.medicationList || data.medicationList.trim() === "")) return false;
  return true;
}, {
  message: "Informe qual(is) medicamento(s)",
  path: ["medicationList"],
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterDependentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const totalSteps = 7; 

  const { register, handleSubmit, control, trigger, setValue, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      cpf: "",
      birthDate: "",
      whatsapp: "",
      email: "",
      password: "",
      confirmPassword: "",
      healthIssues: [],
      healthObservations: "",
      medicationContinuous: false,
      medicationList: "",
      medicationDuringClass: false,
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyHealthPlan: "",
      emergencyHospital: "",
      needsParking: false,
      acceptTerms: false,
      acceptRules: false,
      vehicles: [],
      videoPassword: "",
      notes: "",
      guardians: [{ name: "", cpf: "", whatsapp: "" }],
    }
  });

  const { fields: vehicles, append: appendVehicle, remove: removeVehicle } = useFieldArray({
    control,
    name: "vehicles",
  });

  const { fields: guardians, append: appendGuardian, remove: removeGuardian } = useFieldArray({
    control,
    name: "guardians",
  });

  const [modelsByVehicle, setModelsByVehicle] = React.useState<Record<number, any[]>>({});

  const handleBrandChange = async (brandName: string, index: number) => {
    setValue(`vehicles.${index}.brand`, brandName);
    setValue(`vehicles.${index}.model`, ""); // Reset model
    
    const brand = marcas.find(m => m.nome === brandName);
    if (brand) {
      try {
        const data = await import(`@/external/veiculos/${brand.codigo}.json`);
        setModelsByVehicle(prev => ({ ...prev, [index]: data.modelos }));
      } catch (e) {
        console.error("Error loading models:", e);
        setModelsByVehicle(prev => ({ ...prev, [index]: [] }));
      }
    } else {
      setModelsByVehicle(prev => ({ ...prev, [index]: [] }));
    }
  };

  const needsParking = watch("needsParking");

  // Formatters
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setValue(fieldName as any, value, { shouldValidate: true, shouldDirty: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
    setValue(fieldName as any, value, { shouldValidate: true, shouldDirty: true });
  };

  // File Upload states
  type UploadState = "idle" | "uploading" | "success";

  // Resp Documents
  const [respDocStates, setRespDocStates] = React.useState<UploadState[]>(["idle"]);
  const [respDocFiles, setRespDocFiles] = React.useState<(File | null)[]>([null]);
  const [respUploadErrors, setRespUploadErrors] = React.useState<string[]>([""]);

  const setRespDocStateAtIndex = (index: number, state: UploadState) => {
    setRespDocStates(prev => {
      const next = [...prev];
      next[index] = state;
      return next;
    });
  };

  const setRespDocFileAtIndex = (index: number, file: File | null) => {
    setRespDocFiles(prev => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  // Aluno Documents
  const [docState, setDocState] = React.useState<UploadState>("idle");
  const [photoState, setPhotoState] = React.useState<UploadState>("idle");
  const [schoolState, setSchoolState] = React.useState<UploadState>("idle");
  const [addressState, setAddressState] = React.useState<UploadState>("idle");

  const [docFile, setDocFile] = React.useState<File | null>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [schoolFile, setSchoolFile] = React.useState<File | null>(null);
  const [addressFile, setAddressFile] = React.useState<File | null>(null);

  const [uploadError, setUploadError] = React.useState("");
  const [respUploadError, setRespUploadError] = React.useState("");

  const [isCropperOpen, setIsCropperOpen] = React.useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = React.useState("");

  const handlePhotoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setTempPhotoUrl(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoCropComplete = (blob: Blob) => {
    const croppedFile = new File([blob], "foto_aluno_3x4_recortada.jpg", { type: "image/jpeg" });
    setPhotoFile(croppedFile);
    setPhotoState("success");
  };

  const simulateUpload = (
    file: File | null, 
    setState: React.Dispatch<React.SetStateAction<UploadState>>,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (!file) return;
    setState("uploading");
    setFileState(file);
    setTimeout(() => {
      setState("success");
    }, 1500);
  };

  const removeUpload = (
    setState: React.Dispatch<React.SetStateAction<UploadState>>,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setState("idle");
    setFileState(null);
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${id}?rel=0`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const handleNextStep = async () => {
    let isStepValid = false;

    if (currentStep === 1) {
      isStepValid = true;
    } else if (currentStep === 2) {
      isStepValid = await trigger(["videoPassword"]);
    } else if (currentStep === 3) {
      isStepValid = await trigger([
        "name", "cpf", "birthDate", "whatsapp", "email", 
        "healthIssues", "healthObservations",
        "medicationContinuous", "medicationList", "medicationDuringClass",
        "emergencyContactName", "emergencyContactPhone", "emergencyHealthPlan", "emergencyHospital",
        "password", "confirmPassword", "notes"
      ]);
    } else if (currentStep === 4) {
      const valid = await trigger(["guardians"]);
      const allDocsUploaded = respDocFiles.every((file, idx) => idx >= guardians.length || file !== null);
      
      if (!allDocsUploaded) {
        setRespUploadErrors(prev => {
          const next = [...prev];
          guardians.forEach((_, i) => {
            if (!respDocFiles[i]) next[i] = "Por favor, envie o documento com foto deste responsável.";
            else next[i] = "";
          });
          return next;
        });
        isStepValid = false;
      } else {
        setRespUploadErrors(guardians.map(() => ""));
        isStepValid = valid;
      }
    } else if (currentStep === 5) {
      if (!needsParking) {
        isStepValid = true;
      } else {
        isStepValid = await trigger(["needsParking", "vehicles"]);
      }
    } else if (currentStep === 6) {
      if (!docFile || !photoFile || !schoolFile || !addressFile) {
        setUploadError("Por favor, envie todos os 4 documentos obrigatórios.");
        isStepValid = false;
      } else {
        setUploadError("");
        isStepValid = true;
      }
    }

    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = (data: FormValues) => {
    if (!docFile || !photoFile || !schoolFile || !addressFile) {
      setCurrentStep(6);
      setUploadError("Por favor, envie todos os 4 documentos obrigatórios antes de aceitar os termos.");
      return;
    }
    console.log("Form data:", data, { docFile, photoFile, schoolFile, addressFile, respDocFile });
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SUCCESS SCREEN RENDER
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center">
        {/* Header Success */}
        <div className="w-full bg-white h-16 shadow-xs flex items-center px-4 md:px-8 border-b">
          <div className="max-w-2xl w-full mx-auto flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => router.push("/")} 
              className="p-2 text-[#002855] hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[#002855] font-bold tracking-widest text-sm md:text-base uppercase">Prevenindo com Arte</h1>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
            
            <div className="relative mb-6 mt-10">
              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 className="w-12 h-12 stroke-[3]" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#cc9b59] rounded-full flex items-center justify-center border-4 border-slate-50">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-[#002855] text-3xl font-bold mb-1">Cadastro Realizado!</h2>
            <div className="w-16 h-1 bg-[#cc9b59] rounded-full mb-10"></div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 w-full relative overflow-hidden border-t-[3px] border-t-[#cc9b59]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-2 text-[#002855]">
                  <Info className="w-6 h-6 fill-[#002855] text-white" />
                  <h3 className="font-bold text-lg">Validação Necessária</h3>
                </div>

                <p className="text-slate-600 text-[15px] leading-relaxed max-w-[280px]">
                  Não esqueça de fazer a <span className="font-bold text-[#002855]">validação presencial</span>. Vá ao <span className="font-bold text-slate-800">4º Batalhão</span> o quanto antes para validar o cadastro e efetuar os pagamentos.
                </p>

                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 w-full mt-4">
                  <p className="text-red-700 font-bold flex items-center justify-center gap-1.5 text-sm mb-1 uppercase tracking-wide">
                    <Info className="w-4 h-4" /> Atenção
                  </p>
                  <p className="text-slate-700 text-sm">
                    A presença do <span className="font-bold text-red-700">Responsável Legal</span> é obrigatória na validação.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="button" 
              onClick={() => router.push("/login")} 
              variant="outline"
              className="mt-12 w-full h-14 border-2 border-[#002855] text-[#002855] text-lg font-bold rounded-2xl hover:bg-[#002855] hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Voltar ao Início
            </Button>
          </div>
        </div>

        {/* Footer Success */}
        <div className="py-8 flex flex-col items-center text-center text-slate-500 text-sm space-y-2">
           <p className="flex items-center justify-center gap-1.5">
             <MapPin className="w-4 h-4" /> 4º Batalhão de Polícia Militar - Guará, DF
           </p>
           <p>© 2026 PMDF - Prevenindo com Arte</p>
        </div>
      </div>
    );
  }

  // Define shared tailwind fixes for shadcn data-checked components to fix them becoming white/disappearing
  const checkboxOverrideClasses = "";
  const switchOverrideClasses = "data-checked:bg-[#002855] data-[state=checked]:bg-[#002855]";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-12">
      {/* Header Form */}
      <div className="w-full bg-[#002855] text-white pt-12 pb-6 px-4 md:px-8 relative shadow-md">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <div className="grid grid-cols-[3rem_1fr_3rem] items-center relative gap-2">
            <button 
              type="button" 
              title="Voltar"
              onClick={() => {
                if(currentStep === 1) router.back();
                else handlePrevStep();
              }} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center justify-self-start"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <h1 className="text-xl md:text-2xl font-bold tracking-wide text-center">Cadastro Para Dependente</h1>

            <button 
              type="button" 
              title="Voltar ao Login"
              onClick={() => router.push("/login")} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center justify-self-end text-white"
            >
              <Home className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-center sm:justify-end">
            <div className="text-sm font-medium whitespace-nowrap opacity-80">
              Passo {currentStep} de {totalSteps}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="w-full max-w-2xl px-4 mt-6">
        <div className="flex items-center w-full gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 w-full rounded-full transition-all duration-300", 
                i + 1 <= currentStep ? "bg-blue-600" : "bg-slate-200"
              )}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* STEP 1: Orientações */}
          {currentStep === 1 && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2 pb-4 border-b">
                <h2 className="text-2xl font-bold text-slate-800">APÓS PREENCHER ESSA FICHA, COMPARECER À SALA DO PROJETO</h2>
                <p className="text-slate-500 font-medium tracking-wide">Orientações para a INSCRIÇÃO 2026</p>
              </div>

              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>Para garantir sua vaga no programa, siga atentamente as etapas e os prazos abaixo:</p>
                
                <h3 className="font-bold text-slate-900 mt-6">1. Cronograma e Local</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Período:</strong> a partir de 20 de fevereiro de 2026.</li>
                  <li><strong>Local para validação:</strong> a partir de 23 de fevereiro, na sala do Programa Prevenindo com Arte (dentro do 4º Batalhão).</li>
                  <li><strong>Horários de atendimento para validação:</strong></li>
                  <ul className="list-circle pl-5 mt-1 text-sm text-slate-600">
                    <li>Segunda a quinta: 8h as 12h e 14h as 18h.</li>
                    <li>Sexta-feira: 8h as 12h.</li>
                  </ul>
                </ul>

                <h3 className="font-bold text-slate-900 mt-6">2. Passo a passo da inscrição</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Formulário online:</strong> Preencha o formulário digital.</li>
                  <li><strong>Validação presencial:</strong> Em seguida, vá ao Batalhão para validar o cadastro e efetuar o pagamento da carteirinha.</li>
                  <li>É necessário levar declaração escolar <strong>IMPRESSA</strong>, se menor de idade;</li>
                  <li>É necessário levar <strong>NADA CONSTA</strong> criminal do TJDFT impresso (aluno de 18 a 54 anos de idade).</li>
                  <li><strong>Retirada da carteirinha:</strong> O documento fica pronto em 2 dias úteis. As aulas só podem ser iniciadas após a retirada da carteirinha plastificada.</li>
                  <li>Entre no grupo do whatsapp 2026 da sua turma para saber a data de retorno de sua modalidade (QR codes no quadro de avisos de fora sala).</li>
                </ul>

                <h3 className="font-bold text-slate-900 mt-6">3. Valores e pagamentos</h3>
                <div className="bg-red-50 border border-red-100 p-4 rounded-lg my-2">
                  <p className="text-red-900 font-medium">Atenção: Os pagamentos devem ser feitos exclusivamente em DINHEIRO. O programa NÃO aceita PIX ou cartões.</p>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Carteirinha (1ª via):</strong> R$5.</li>
                  <li><strong>Adesivo QR Code (veículos):</strong> R$5 cada veículo (por enquanto o de 2025 está válido).</li>
                  <li><strong>Uniformes (uso obrigatório em todas as modalidades):</strong></li>
                  <ul className="list-circle pl-5 mt-1 text-sm text-slate-600">
                    <li>Camiseta regata: R$35.</li>
                    <li>Camiseta manga curta: R$40.</li>
                    <li>Kit escolinha de futebol: R$85.</li>
                  </ul>
                </ul>

                <h3 className="font-bold text-amber-600 mt-8 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Pontos de Atenção (Leia com cuidado)
                </h3>
                <ul className="list-none space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <li><strong>Menores de idade:</strong> É obrigatória a presença do responsável legal na sala do programa para realizar a validação da matrícula.</li>
                  <li><strong>Frequência e desligamento:</strong> O aluno que tiver 3 faltas consecutivas sem justificativa será automaticamente desligado do programa.</li>
                  <li><strong>Acesso de veículos:</strong> Para entrar no batalhão com veículo próprio, é obrigatório fixar o adesivo QR Code no para-brisa. QR code 2025 ainda válido!</li>
                  <li><strong>Segundas vias:</strong> Em caso de perda, os valores aumentam progressivamente (2ª via R$10; 3ª via R$15, etc).</li>
                  <li className="font-semibold text-slate-900">Confirmação: O preenchimento do formulário sem o comparecimento presencial para validação anula a inscrição.</li>
                </ul>

                <p className="text-center font-bold text-blue-800 text-lg mt-8">Desejamos um ótimo treino a todos em 2026!</p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="button" size="lg" onClick={handleNextStep} className="bg-[#002855] hover:bg-[#003875] text-white">
                  Entendi, Continuar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </section>
          )}

          {/* STEP 2: Vídeo */}
          {currentStep === 2 && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">Assista ao Vídeo de Boas-Vindas</h2>
                <p className="text-slate-500 font-medium">Assista o vídeo atentamente até o final, a senha de liberação aparecerá durante o vídeo.</p>
              </div>

              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border bg-slate-900 relative">
                 <iframe 
                  className="w-full h-full absolute inset-0"
                  src={getYoutubeEmbedUrl(REGISTRATION_CONFIG.videoUrl)} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <Label htmlFor="videoPassword" className="text-base text-slate-800 font-semibold">Qual a senha que apareceu no vídeo? *</Label>
                  <Controller
                    name="videoPassword"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        id="videoPassword" 
                        placeholder="Digite a senha..." 
                        {...field} 
                        className={cn("h-12 text-lg", errors.videoPassword && "border-red-500")} 
                      />
                    )}
                  />
                  {errors.videoPassword && <p className="text-sm font-medium text-red-500">{errors.videoPassword.message}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" size="lg" onClick={handlePrevStep}>Voltar</Button>
                <Button type="button" size="lg" onClick={handleNextStep} className="bg-[#002855] hover:bg-[#003875] text-white">
                  Continuar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </section>
          )}

          {/* STEP 3: Dados Pessoais do Aluno */}
          {currentStep === 3 && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Dados Pessoais Do Aluno</h2>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input id="name" placeholder="Nome e Sobrenome" {...register("name")} className={errors.name ? "border-red-500" : ""} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Controller
                        name="cpf"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field}
                            id="cpf" 
                            placeholder="000.000.000-00" 
                            maxLength={14}
                            onChange={(e) => {
                              handleCpfChange(e, "cpf");
                            }}
                            className={errors.cpf ? "border-red-500" : ""} 
                          />
                        )}
                      />
                      {errors.cpf && <p className="text-xs text-red-500">{errors.cpf.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate">Data de Nascimento *</Label>
                      <Input id="birthDate" type="date" {...register("birthDate")} className={errors.birthDate ? "border-red-500" : ""} />
                      {errors.birthDate && <p className="text-xs text-red-500">{errors.birthDate.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp">WhatsApp *</Label>
                      <Controller
                        name="whatsapp"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field}
                            id="whatsapp" 
                            placeholder="(00) 00000-0000" 
                            maxLength={15}
                            onChange={(e) => {
                              handlePhoneChange(e, "whatsapp");
                            }}
                            className={errors.whatsapp ? "border-red-500" : ""} 
                          />
                        )}
                      />
                      {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" placeholder="seuemail@exemplo.com" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mt-4">
                  <Label htmlFor="notes">Observações (Opcional)</Label>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                       <textarea 
                         id="notes" 
                         placeholder="Escreva alguma observação, se houver..." 
                         className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                         {...field}
                       />
                    )}
                  />
                  {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Informações de Saúde do Aluno</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Hipertensão", 
                    "Diabetes", 
                    "Problemas Cardíacos", 
                    "Asma", 
                    "Epilepsia / convulsões",
                    "Alergias (alimentares, medicamentos, picadas, etc.)",
                    "Problemas respiratórios (além de asma)",
                    "Problemas neurológicos",
                    "Problemas ortopédicos (joelho, coluna, etc.)",
                    "Transtornos psicológicos (ansiedade, TDAH, depressão)",
                    "Deficiências (auditiva, visual, motora, intelectual)"
                  ].map((item, i) => (
                    <div key={item} className="flex flex-row items-center space-x-3 text-sm">
                      <Controller
                        control={control}
                        name="healthIssues"
                        render={({ field }) => (
                          <Checkbox 
                            id={`health-${i}`}
                            className={checkboxOverrideClasses}
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([...currentValues, item]);
                              } else {
                                field.onChange(currentValues.filter((val) => val !== item));
                              }
                            }}
                          />
                        )}
                      />
                      <Label htmlFor={`health-${i}`} className="font-normal cursor-pointer leading-none text-slate-700 select-none">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 mt-4">
                  <Label htmlFor="healthObservations">Observações sobre a saúde</Label>
                  <Controller
                    name="healthObservations"
                    control={control}
                    render={({ field }) => (
                       <textarea 
                         id="healthObservations" 
                         placeholder="Informe detalhes sobre as condições marcadas acima ou outras informações relevantes..." 
                         className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                         {...field}
                       />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Uso de Medicamentos</h2>
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between p-4 border rounded-xl border-slate-200 bg-slate-50/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="medicationContinuous" className="text-base font-semibold text-slate-800 cursor-pointer">Uso contínuo de medicamentos?</Label>
                      <p className="text-sm text-muted-foreground">Informe se o aluno utiliza medicação regularmente.</p>
                    </div>
                    <Controller
                      control={control}
                      name="medicationContinuous"
                      render={({ field }) => (
                        <Switch 
                          id="medicationContinuous" 
                          className={switchOverrideClasses} 
                          checked={field.value ?? false} 
                          onCheckedChange={field.onChange} 
                        />
                      )}
                    />
                  </div>

                  {watch("medicationContinuous") && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1.5">
                        <Label htmlFor="medicationList">Qual(is)? *</Label>
                        <Input 
                          id="medicationList" 
                          placeholder="Nome dos medicamentos" 
                          {...register("medicationList")} 
                          className={errors.medicationList ? "border-red-500" : ""}
                        />
                        {errors.medicationList && <p className="text-xs text-red-500">{errors.medicationList.message}</p>}
                      </div>

                      <div className="flex flex-row items-center justify-between p-4 border rounded-xl border-slate-200">
                        <div className="space-y-0.5">
                          <Label htmlFor="medicationDuringClass" className="text-sm font-medium text-slate-800 cursor-pointer">Precisa tomar durante o período da aula?</Label>
                        </div>
                        <Controller
                          control={control}
                          name="medicationDuringClass"
                          render={({ field }) => (
                            <Switch 
                              id="medicationDuringClass" 
                              className={switchOverrideClasses} 
                              checked={field.value ?? false} 
                              onCheckedChange={field.onChange} 
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Informações de Emergência</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyContactName">Nome do acompanhante (opcional)</Label>
                    <Input 
                      id="emergencyContactName" 
                      placeholder="Nome completo do contato" 
                      {...register("emergencyContactName")} 
                      className={errors.emergencyContactName ? "border-red-500" : ""}
                    />
                    {errors.emergencyContactName && <p className="text-xs text-red-500">{errors.emergencyContactName.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyContactPhone">Telefone de emergência {watch("emergencyContactName") ? "*" : "(opcional)"}</Label>
                    <Controller
                      name="emergencyContactPhone"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          id="emergencyContactPhone" 
                          placeholder="(00) 00000-0000" 
                          maxLength={15}
                          onChange={(e) => {
                            handlePhoneChange(e, "emergencyContactPhone");
                          }}
                          className={errors.emergencyContactPhone ? "border-red-500" : ""} 
                        />
                      )}
                    />
                    {errors.emergencyContactPhone && <p className="text-xs text-red-500">{errors.emergencyContactPhone.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyHealthPlan">Convênio/plano de saúde (opcional)</Label>
                    <Input 
                      id="emergencyHealthPlan" 
                      placeholder="Nome do plano, se houver" 
                      {...register("emergencyHealthPlan")} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyHospital">Hospital de preferência (opcional)</Label>
                    <Input 
                      id="emergencyHospital" 
                      placeholder="Nome do hospital preferencial" 
                      {...register("emergencyHospital")} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Acesso e Segurança</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Criar Senha *</Label>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <PasswordStrengthInput
                          id="password"
                          placeholder="Sua senha"
                          className={errors.password ? "border-red-500" : ""}
                          {...field}
                        />
                      )}
                    />
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Repita sua senha" 
                      {...register("confirmPassword")} 
                      className={errors.confirmPassword ? "border-red-500" : ""} 
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" size="lg" onClick={handlePrevStep}>Voltar</Button>
                <Button type="button" size="lg" onClick={handleNextStep} className="bg-[#002855] hover:bg-[#003875] text-white">
                  Continuar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </section>
          )}

          {/* STEP 4: Dados do Responsável */}
          {currentStep === 4 && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-bold text-slate-800">Dados Do Responsável</h2>
                  {guardians.length < 3 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        appendGuardian({ name: "", cpf: "", whatsapp: "" });
                        setRespDocStates(prev => [...prev, "idle"]);
                        setRespDocFiles(prev => [...prev, null]);
                        setRespUploadErrors(prev => [...prev, ""]);
                      }}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Adicionar outro
                    </Button>
                  )}
                </div>
                
                <div className="space-y-10">
                  {guardians.map((field, index) => (
                    <div key={field.id} className="space-y-6 relative">
                      {index > 0 && (
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <h3 className="font-semibold text-slate-600">Responsável {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => {
                              removeGuardian(index);
                              setRespDocStates(prev => prev.filter((_, i) => i !== index));
                              setRespDocFiles(prev => prev.filter((_, i) => i !== index));
                              setRespUploadErrors(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Remover
                          </button>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor={`guardians.${index}.name`}>Nome Completo *</Label>
                          <Input 
                            id={`guardians.${index}.name`} 
                            placeholder="Nome e Sobrenome do Responsável" 
                            {...register(`guardians.${index}.name` as const)} 
                            className={errors.guardians?.[index]?.name ? "border-red-500" : ""} 
                          />
                          {errors.guardians?.[index]?.name && <p className="text-xs text-red-500">{errors.guardians[index]?.name?.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor={`guardians.${index}.cpf`}>CPF do Responsável *</Label>
                            <Controller
                              name={`guardians.${index}.cpf` as const}
                              control={control}
                              render={({ field }) => (
                                <Input 
                                  {...field}
                                  id={`guardians.${index}.cpf`} 
                                  placeholder="000.000.000-00" 
                                  maxLength={14}
                                  onChange={(e) => {
                                    handleCpfChange(e, `guardians.${index}.cpf`);
                                  }}
                                  className={errors.guardians?.[index]?.cpf ? "border-red-500" : ""} 
                                />
                              )}
                            />
                            {errors.guardians?.[index]?.cpf && <p className="text-xs text-red-500">{errors.guardians[index]?.cpf?.message}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor={`guardians.${index}.whatsapp`}>WhatsApp / Telefone *</Label>
                            <Controller
                              name={`guardians.${index}.whatsapp` as const}
                              control={control}
                              render={({ field }) => (
                                <Input 
                                  {...field}
                                  id={`guardians.${index}.whatsapp`} 
                                  placeholder="(00) 00000-0000" 
                                  maxLength={15}
                                  onChange={(e) => {
                                    handlePhoneChange(e, `guardians.${index}.whatsapp`);
                                  }}
                                  className={errors.guardians?.[index]?.whatsapp ? "border-red-500" : ""} 
                                />
                              )}
                            />
                            {errors.guardians?.[index]?.whatsapp && <p className="text-xs text-red-500">{errors.guardians[index]?.whatsapp?.message}</p>}
                          </div>
                        </div>

                        {respUploadErrors[index] && (
                          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mt-4 flex items-center">
                            <Info className="w-5 h-5 mr-2" />
                            {respUploadErrors[index]}
                          </div>
                        )}

                        <div className="pt-2">
                          <Label className="block mb-2 font-medium">Documento com foto do responsável {index + 1} *</Label>
                          <FileUploadCard 
                            title="Documento Oficial" 
                            description="RG, CNH, Passaporte etc." 
                            variant={respDocStates[index] || "idle"}
                            fileName={respDocFiles[index]?.name}
                            progress={100}
                            onFileSelect={(f) => simulateUpload(f, (state) => setRespDocStateAtIndex(index, state as UploadState), (file) => setRespDocFileAtIndex(index, file))}
                            onFileRemove={() => removeUpload((state) => setRespDocStateAtIndex(index, state as UploadState), (file) => setRespDocFileAtIndex(index, file))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" size="lg" onClick={handlePrevStep}>Voltar</Button>
                <Button type="button" size="lg" onClick={handleNextStep} className="bg-[#002855] hover:bg-[#003875] text-white">
                  Continuar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </section>
          )}

          {/* STEP 5: Estacionamento */}
          {currentStep === 5 && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold text-slate-800">Estacionamento</h2>
              <div className="flex flex-row items-center justify-between p-4 border rounded-xl border-slate-200 bg-slate-50">
                <div className="space-y-0.5">
                  <Label htmlFor="needsParkingToggle" className="text-base font-semibold text-slate-800 cursor-pointer">Vai usar o estacionamento?</Label>
                  <p className="text-sm text-muted-foreground">Adicione e cadastre até 3 veículos.</p>
                </div>
                <Controller
                  control={control}
                  name="needsParking"
                  render={({ field }) => (
                    <Switch id="needsParkingToggle" className={switchOverrideClasses} checked={field.value ?? false} onCheckedChange={(val) => {
                      field.onChange(val);
                      if (val && vehicles.length === 0) {
                        appendVehicle({ brand: "", model: "", plate: "" });
                      }
                    }} />
                  )}
                />
              </div>

              {needsParking && (
                <div className="space-y-6 mt-4">
                  {vehicles.map((field, index) => (
                    <div key={field.id} className="relative p-5 border rounded-xl bg-white space-y-4">
                       <div className="flex justify-between items-center border-b pb-2">
                         <h3 className="font-bold text-slate-700">Veículo {index + 1}</h3>
                         <button
                            type="button"
                            onClick={() => removeVehicle(index)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center text-sm ml-auto font-medium"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Remover
                          </button>
                       </div>
                       
                        <div className="space-y-3">
                         <div className="space-y-1">
                           <Label className="text-sm font-medium">Marca *</Label>
                           <select 
                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                             value={watch(`vehicles.${index}.brand`)}
                             onChange={(e) => handleBrandChange(e.target.value, index)}
                           >
                             <option value="">Selecione a marca...</option>
                             {marcas.map(m => (
                               <option key={m.codigo} value={m.nome}>{m.nome}</option>
                             ))}
                           </select>
                           {errors.vehicles?.[index]?.brand && <p className="text-xs text-red-500">{errors.vehicles[index]?.brand?.message}</p>}
                         </div>
                         <div className="space-y-1">
                           <Label className="text-sm font-medium">Modelo *</Label>
                           <select 
                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                             {...register(`vehicles.${index}.model` as const)}
                             disabled={!watch(`vehicles.${index}.brand`)}
                           >
                             <option value="">Selecione o modelo...</option>
                             {modelsByVehicle[index]?.map(m => (
                               <option key={m.codigo} value={m.nome}>{m.nome}</option>
                             ))}
                           </select>
                           {errors.vehicles?.[index]?.model && <p className="text-xs text-red-500">{errors.vehicles[index]?.model?.message}</p>}
                         </div>
                         <div className="space-y-1">
                           <Label className="text-sm font-medium">Placa *</Label>
                           <Input placeholder="ABC-1234 ou ABC1D23" {...register(`vehicles.${index}.plate` as const)} maxLength={8} className="uppercase" />
                           {errors.vehicles?.[index]?.plate && <p className="text-xs text-red-500">{errors.vehicles[index]?.plate?.message}</p>}
                         </div>
                       </div>
                    </div>
                  ))}

                  {errors.vehicles && !Array.isArray(errors.vehicles) && <p className="text-sm text-red-500 text-center font-medium">{errors.vehicles.message}</p>}

                  {vehicles.length < 3 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => appendVehicle({ brand: "", model: "", plate: "" })}
                      className="w-full border-dashed border-2 py-6 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Adicionar outro veículo
                    </Button>
                  )}
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" size="lg" onClick={handlePrevStep}>Voltar</Button>
                <Button type="button" size="lg" onClick={handleNextStep} className="bg-[#002855] hover:bg-[#003875] text-white">
                  Continuar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </section>
          )}

          {/* STEP 6: Documentos do Aluno */}
          {currentStep === 6 && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b pb-2">
                  <h2 className="text-xl font-bold text-slate-800">Documentos Obrigatórios do Aluno</h2>
                  <Info className="h-5 w-5 text-slate-400" />
                </div>
                
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    {uploadError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FileUploadCard 
                    title="Documento Oficial *" 
                    description="RG, CNH, Passaporte." 
                    variant={docState}
                    fileName={docFile?.name}
                    progress={65}
                    onFileSelect={(f) => simulateUpload(f, setDocState, setDocFile)}
                    onFileRemove={() => removeUpload(setDocState, setDocFile)}
                  />
                  <FileUploadCard 
                    title="Foto 3x4 *" 
                    description="Foto de rosto recente." 
                    variant={photoState}
                    fileName={photoFile?.name}
                    progress={100}
                    onFileSelect={handlePhotoSelect}
                    onFileRemove={() => removeUpload(setPhotoState, setPhotoFile)}
                  />
                  <FileUploadCard 
                    title="Comprovante de Escolaridade *" 
                    description="Declaração de matricula válida." 
                    variant={schoolState}
                    fileName={schoolFile?.name}
                    progress={88}
                    onFileSelect={(f) => simulateUpload(f, setSchoolState, setSchoolFile)}
                    onFileRemove={() => removeUpload(setSchoolState, setSchoolFile)}
                  />
                  <FileUploadCard 
                    title="Comprovante de Residência *" 
                    description="Conta de água, luz, etc." 
                    variant={addressState}
                    fileName={addressFile?.name}
                    progress={30}
                    onFileSelect={(f) => simulateUpload(f, setAddressState, setAddressFile)}
                    onFileRemove={() => removeUpload(setAddressState, setAddressFile)}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" size="lg" onClick={handlePrevStep}>Voltar</Button>
                <Button type="button" size="lg" onClick={handleNextStep} className="bg-[#002855] hover:bg-[#003875] text-white">
                  Continuar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </section>
          )}

          {/* STEP 7: Termos e Conclusão */}
          {currentStep === 7 && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Termos e Condições</h2>
                <div className="flex flex-row items-center space-x-3 text-base">
                  <Controller
                    control={control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <div className="flex flex-col">
                        <div className="flex flex-row items-center space-x-3">
                          <Checkbox id="termsBox" className={checkboxOverrideClasses} checked={field.value} onCheckedChange={field.onChange} />
                          <Label htmlFor="termsBox" className="font-normal text-slate-700 cursor-pointer pointer-events-auto leading-none">
                            Li e concordo com o{" "}
                            <Link href="#" className="font-bold text-blue-600 hover:underline">Termo de Isenção de Risco</Link>.
                          </Label>
                        </div>
                        {errors.acceptTerms && <p className="text-xs text-red-500 mt-1 pl-8">{errors.acceptTerms.message}</p>}
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-row items-center space-x-3 text-base">
                  <Controller
                    control={control}
                    name="acceptRules"
                    render={({ field }) => (
                      <div className="flex flex-col">
                        <div className="flex flex-row items-center space-x-3">
                          <Checkbox id="rulesBox" className={checkboxOverrideClasses} checked={field.value} onCheckedChange={field.onChange} />
                          <Label htmlFor="rulesBox" className="font-normal text-slate-700 cursor-pointer pointer-events-auto leading-none">
                            Estou ciente e concordo com as{" "}
                            <Link href="#" className="font-bold text-blue-600 hover:underline">Normas do Projeto</Link>.
                          </Label>
                        </div>
                        {errors.acceptRules && <p className="text-xs text-red-500 mt-1 pl-8">{errors.acceptRules.message}</p>}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-4">
                <Button type="submit" size="lg" className="w-full bg-[#002855] hover:bg-[#003875] text-white py-6 text-lg rounded-xl">
                  <CheckCircle2 className="mr-2 h-5 w-5" /> Finalizar Cadastro
                </Button>
                <div className="flex justify-center">
                  <Button type="button" variant="ghost" onClick={handlePrevStep} className="text-slate-500">Voltar ao passo anterior</Button>
                </div>
              </div>
            </section>
          )}

        </form>
      </div>

      <PhotoCropperModal 
        open={isCropperOpen}
        imageSrc={tempPhotoUrl}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handlePhotoCropComplete}
      />
    </div>
  );
}
