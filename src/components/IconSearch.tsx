"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Check } from "lucide-react";
import { searchIcons } from "@/app/actions";

interface IconSearchProps {
  onSelect: (icon: any) => void;
  selectedId: string | null;
}

export default function IconSearch({ onSelect, selectedId }: IconSearchProps) {
  const [query, setQuery] = useState("");
  const [icons, setIcons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const results = await searchIcons(query);
      setIcons(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input 
          placeholder="Search for an icon (e.g. coffee, rocket)..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
          className="rounded-xl border-zinc-100 bg-zinc-50/50 h-12"
        />
        <Button 
          type="button" 
          onClick={handleSearch} 
          disabled={loading}
          className="rounded-xl bg-zinc-900 text-white h-12 px-6"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
        {icons.map((icon) => (
          <button
            key={icon.id}
            type="button"
            onClick={() => onSelect(icon)}
            className={`aspect-square rounded-2xl border flex items-center justify-center p-2 transition-all relative group bg-white ${
              selectedId === icon.id 
              ? "border-black ring-2 ring-black/5 shadow-md" 
              : "border-zinc-100 hover:border-zinc-300 hover:shadow-sm"
            }`}
          >
            <div className="w-full h-full rounded-xl bg-zinc-50 flex items-center justify-center p-2 group-hover:bg-zinc-100/50 transition-colors">
                <img 
                src={icon.thumbnail_url} 
                alt={icon.term} 
                className="w-full h-full object-contain"
                />
            </div>
            {selectedId === icon.id && (
              <div className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5 shadow-sm">
                <Check className="w-3 h-3" />
              </div>
            )}
          </button>
        ))}
        {icons.length === 0 && !loading && query && (
          <div className="col-span-full py-10 text-center text-zinc-400 text-sm">
            No icons found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
