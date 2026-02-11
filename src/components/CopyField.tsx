"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyFieldProps {
  label: string;
  value: string;
  multiline?: boolean;
}

export default function CopyField({ label, value, multiline = false }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`, { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2 group/field">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
          {label}
          {value && <span className="ml-2 text-zinc-300 font-medium">({value.length} chars)</span>}
        </label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all opacity-0 group-hover/field:opacity-100"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
          <span className="text-[10px] font-bold">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className={`relative rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:border-zinc-200 hover:shadow-md ${multiline ? "p-6" : "p-4"}`}>
        {multiline ? (
          <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{value || "No data generated"}</p>
        ) : (
          <p className="text-sm font-bold text-zinc-900 truncate">{value || "No data generated"}</p>
        )}
      </div>
    </div>
  );
}
