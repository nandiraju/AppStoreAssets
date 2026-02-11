"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export default function ConfigSnippet({ snippet }: { snippet: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(snippet, null, 2));
    setCopied(true);
    toast.success("Snippet copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre 
        className="p-8 bg-zinc-900 rounded-3xl text-zinc-300 text-sm overflow-x-auto leading-relaxed border border-zinc-800"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        {JSON.stringify(snippet, null, 2)}
      </pre>
      <Button 
        variant="secondary" 
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-xl border-none font-bold backdrop-blur-sm transition-all"
        onClick={handleCopy}
      >
        {copied ? (
          <><Check className="w-4 h-4 mr-2" /> Copied</>
        ) : (
          <><Copy className="w-4 h-4 mr-2" /> Copy Snippet</>
        )}
      </Button>
    </div>
  );
}
