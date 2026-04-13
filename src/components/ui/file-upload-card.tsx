"use client";

import * as React from "react";
import { CheckCircle2, UploadCloud, File as FileIcon, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type FileUploadVariant = "idle" | "uploading" | "success";

interface FileUploadCardProps {
  title?: string;
  description?: string;
  variant?: FileUploadVariant;
  progress?: number;
  fileName?: string;
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  className?: string;
}

export function FileUploadCard({
  title = "Documento",
  description = "Faça upload",
  variant = "idle",
  progress = 0,
  fileName = "",
  onFileSelect,
  onFileRemove,
  className,
}: FileUploadCardProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    if (variant === "idle") {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    if (onFileRemove) onFileRemove();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all duration-200",
        variant === "idle" && "cursor-pointer border-dashed border-slate-300 bg-white hover:bg-slate-50",
        variant === "uploading" && "border-solid border-blue-500 bg-blue-50/50",
        variant === "success" && "border-solid border-green-500 bg-green-50/50",
        className
      )}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
      />

      {variant === "idle" && (
        <>
          <div className="mb-3 rounded-full bg-slate-100 p-3">
            <UploadCloud className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </>
      )}

      {variant === "uploading" && (
        <div className="w-full flex tracking-wide items-center gap-3">
          <div className="rounded bg-blue-100 p-2">
            <FileIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex w-full items-center justify-between text-sm">
              <span className="font-semibold text-slate-800 truncate pr-2">{fileName || "Enviando arquivo..."}</span>
              <span className="text-blue-600 font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 w-full bg-blue-100" />
          </div>
        </div>
      )}

      {variant === "success" && (
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3 w-full pr-12">
            <div className="rounded bg-green-100 p-2">
               <FileIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex flex-col overflow-hidden w-full">
              <p className="text-sm font-semibold text-slate-800 truncate">{fileName || title}</p>
              <p className="text-xs text-green-600 font-medium">Upload concluído</p>
            </div>
          </div>
          <div className="absolute right-4 flex items-center space-x-2">
            <button 
              onClick={handleRemove}
              className="p-1.5 rounded-full hover:bg-green-200 transition-colors text-slate-500 hover:text-red-500"
              title="Remover arquivo"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <CheckCircle2 className="h-6 w-6 text-green-500 hidden sm:block" />
          </div>
        </div>
      )}
    </div>
  );
}
