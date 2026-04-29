"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Users, 
  BookOpen, 
  UserSquare2, 
  Car, 
  LayoutDashboard, 
  Menu,
  User as UserIcon,
  ChevronRight,
  LogOut
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Lista de Alunos",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Modalidades",
    href: "/admin/modalidades",
    icon: BookOpen,
  },
  {
    title: "Instrutores",
    href: "/admin/instrutores",
    icon: UserSquare2,
  },
  {
    title: "Veículos",
    href: "/admin/veiculos",
    icon: Car,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const NavContent = () => (
    <div className="flex flex-col h-full py-6 px-4 space-y-6">
      <div className="px-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Menu Administrativo
        </h2>
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[#003366] text-white shadow-md shadow-blue-900/20" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#003366]"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                {item.title}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto px-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50"
          asChild
        >
          <Link href="/">
            <LogOut className="h-5 w-5" />
            Sair
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-slate-200 shadow-sm fixed h-full z-30">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003366] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/20">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 leading-tight">PREVENINDO</span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-[0.2em] uppercase">Com Arte</span>
            </div>
          </div>
        </div>
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6 text-slate-600" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-0 h-[80vh]">
                <NavContent />
              </DrawerContent>
            </Drawer>
            
            <h1 className="text-lg font-semibold text-slate-900 hidden md:block">
              Área Administrativa
            </h1>
            <div className="md:hidden flex items-center gap-2">
               <div className="w-8 h-8 bg-[#003366] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="font-bold text-sm text-slate-900">PREVENINDO</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs">
                AD
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:inline">Administrador</span>
              <UserIcon className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
