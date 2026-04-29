"use client"

import * as React from "react"
import Link from "next/link"
import { Home, Clock, Users, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Category = "LUTA" | "ARTE" | "MÚSICA" | "LAZER"

interface Activity {
  title: string
  category: Category
  time: string
  spots: number | "Livre" | "ESGOTADO"
  instructor?: string
}

interface DaySchedule {
  day: string
  activities: Activity[]
}

const scheduleData: DaySchedule[] = [
  {
    day: "Segunda",
    activities: [
      { category: "LUTA", title: "Muay Thai", time: "08:00", spots: 12 },
      { category: "ARTE", title: "Pintura em Tela", time: "10:00", spots: 3, instructor: "Bruna Mariana" },
    ]
  },
  {
    day: "Terça",
    activities: [
      { category: "LUTA", title: "Jiu-Jitsu", time: "15:00", spots: 8, instructor: "Mestre Carlos" },
    ]
  },
  {
    day: "Quarta",
    activities: [
      { category: "LUTA", title: "Boxe Inglês", time: "08:00", spots: 15, instructor: "Prof. Silva" },
    ]
  },
  {
    day: "Quinta",
    activities: [
      { category: "LUTA", title: "Karatê-Dô", time: "14:00", spots: 2, instructor: "Sensei Nakamura" },
      { category: "MÚSICA", title: "Violão Clássico", time: "15:30", spots: "ESGOTADO", instructor: "Cabo Mendes" },
    ]
  },
  {
    day: "Sexta",
    activities: [
      { category: "LUTA", title: "Muay Thai", time: "19:00", spots: 20, instructor: "Prof. Douglas" },
    ]
  },
  {
    day: "Sábado",
    activities: []
  },
  {
    day: "Domingo",
    activities: [
      { category: "LAZER", title: "Futebol Comunitário", time: "10:00", spots: "Livre", instructor: "Quadra Central" },
    ]
  }
]

const categoryStyles: Record<Category, string> = {
  LUTA: "border-l-[#f59e0b] bg-[#fefce8] text-[#92400e]",
  ARTE: "border-l-[#3b82f6] bg-[#eff6ff] text-[#1e40af]",
  MÚSICA: "border-l-[#06b6d4] bg-[#ecfeff] text-[#155e75]",
  LAZER: "border-l-[#6366f1] bg-[#eef2ff] text-[#3730a3]",
}

const categoryTagStyles: Record<Category, string> = {
  LUTA: "bg-[#fef3c7] text-[#92400e]",
  ARTE: "bg-[#dbeafe] text-[#1e40af]",
  MÚSICA: "bg-[#cffafe] text-[#155e75]",
  LAZER: "bg-[#e0e7ff] text-[#3730a3]",
}

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/login" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft className="h-6 w-6 text-slate-600" />
            </Link>
            <div className="font-bold text-[#003366] text-lg flex items-center gap-1">
              <span className="text-green-600">▲</span> PREVENINDO COM ARTE
            </div>
          </div>
          <Link href="/login">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Home className="h-5 w-5 text-slate-600" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Hero Section */}
        <div className="mb-10">
          <h2 className="text-[#92400e] font-semibold text-sm tracking-wider uppercase mb-1">Grade Semanal</h2>
          <h1 className="text-3xl font-extrabold text-[#003366] mb-3">Modalidades Esportivas</h1>
          <p className="text-slate-600 leading-relaxed max-w-xl">
            Explore as atividades disponíveis para a comunidade. Garanta sua vaga nos projetos sociais da PMDF.
          </p>
        </div>

        {/* Schedule Grid */}
        <div className="space-y-10">
          {scheduleData.map((dayData) => (
            <section key={dayData.day} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-xl font-bold text-slate-800">{dayData.day}</h3>
              </div>

              <div className="grid gap-4">
                {dayData.activities.length > 0 ? (
                  dayData.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 border-l-4 transition-all hover:shadow-md hover:-translate-y-0.5",
                        categoryStyles[activity.category]
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                          categoryTagStyles[activity.category]
                        )}>
                          {activity.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
                          <Clock className="h-3.5 w-3.5" />
                          {activity.time}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#003366] transition-colors">
                          {activity.title}
                        </h4>
                        {activity.instructor && (
                          <p className="text-sm text-slate-500 mt-0.5">{activity.instructor}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          activity.spots === "ESGOTADO"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-green-50 text-green-600 border border-green-100"
                        )}>
                          {typeof activity.spots === "number" ? `${activity.spots.toString().padStart(2, '0')} Vagas` : activity.spots}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-10 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                      <Clock className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-medium">Nenhuma atividade agendada</p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Floating Action Button (Optional, purely aesthetic) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Link href="/login">
          <Button className="rounded-full h-14 w-14 shadow-2xl bg-[#003366] hover:bg-[#002244]">
            <Home className="h-6 w-6 text-white" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
