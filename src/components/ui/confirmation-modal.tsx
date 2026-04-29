"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Info, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ConfirmationModalType = "info" | "success" | "warning" | "danger" | "question"

interface ConfirmationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
  type?: ConfirmationModalType
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  type = "question",
  isLoading = false,
}: ConfirmationModalProps) {
  
  const getIcon = () => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-6 w-6 text-green-600" />
      case "danger": return <AlertCircle className="h-6 w-6 text-red-600" />
      case "warning": return <AlertCircle className="h-6 w-6 text-amber-600" />
      case "info": return <Info className="h-6 w-6 text-blue-600" />
      default: return <HelpCircle className="h-6 w-6 text-slate-600" />
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="p-8"> {/* Increased padding from p-6 to p-8 */}
          <div className="flex items-start gap-5">
            <div className={cn(
              "p-3 rounded-2xl shrink-0",
              type === "danger" ? "bg-red-50" : 
              type === "success" ? "bg-green-50" :
              type === "warning" ? "bg-amber-50" :
              type === "info" ? "bg-blue-50" : "bg-slate-50"
            )}>
              {getIcon()}
            </div>
            <div className="space-y-1">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
                <DialogDescription className="text-slate-500 text-sm leading-relaxed">
                  {description}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-slate-50 p-6 flex flex-row items-center justify-between sm:justify-between gap-3">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-xl font-bold text-red-600 hover:bg-red-50 transition-colors px-6"
          >
            {cancelLabel}
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isLoading}
            className="rounded-xl font-bold px-8 shadow-lg bg-[#003366] hover:bg-[#002855] text-white shadow-blue-100 transition-all active:scale-95"
          >
            {isLoading ? "Processando..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
