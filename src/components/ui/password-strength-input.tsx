"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordStrengthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onStrengthChange?: (score: number) => void;
}

export const PasswordStrengthInput = React.forwardRef<HTMLInputElement, PasswordStrengthInputProps>(
  ({ className, onChange, onStrengthChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strengthScore, setStrengthScore] = React.useState(0);
    const [value, setValue] = React.useState(props.value || props.defaultValue || "");

    const calculateStrength = (password: string) => {
      let score = 0;
      if (!password) return 0;
      if (password.length > 5) score += 1;
      if (password.length > 8) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      return Math.min(score, 4);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);
      const score = calculateStrength(val);
      setStrengthScore(score);
      if (onStrengthChange) onStrengthChange(score);
      if (onChange) onChange(e);
    };

    const getStrengthColor = (index: number) => {
      if (strengthScore === 0) return "bg-slate-200";
      if (strengthScore <= 1 && index === 0) return "bg-red-500";
      if (strengthScore === 2 && index < 2) return "bg-orange-500";
      if (strengthScore === 3 && index < 3) return "bg-yellow-500";
      if (strengthScore >= 4) return "bg-green-500";
      return "bg-slate-200";
    };

    const getStrengthText = () => {
      if (strengthScore === 0) return "";
      if (strengthScore <= 1) return "Muito fraca";
      if (strengthScore === 2) return "Fraca";
      if (strengthScore === 3) return "Boa";
      return "Forte";
    };

    return (
      <div className="w-full relative">
        <div className="relative flex items-center">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">Toggle password visibility</span>
          </button>
        </div>
        
        {value && (
          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex gap-1 h-1.5 w-full">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 rounded-full transition-colors duration-300",
                    getStrengthColor(index)
                  )}
                />
              ))}
            </div>
            <div className="text-xs text-slate-500 text-right font-medium">
              {getStrengthText()}
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordStrengthInput.displayName = "PasswordStrengthInput";
