"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowLeft, Loader2, Image as ImageIcon, CheckCircle2, Plus, Library, Type, FileText, Tag, Palette, Megaphone, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/actions";
import { toast } from "sonner";
import IconSearch from "@/components/IconSearch";

const categories = [
  "Business", "Education", "Entertainment", "Finance", "Food & Drink", 
  "Games", "Health & Fitness", "Lifestyle", "Medical", "Music", 
  "Navigation", "News", "Photo & Video", "Productivity", "Reference", 
  "Shopping", "Social Networking", "Sports", "Travel", "Utilities"
];

const tones = [
  "Professional", "Friendly", "Minimalist", "Bold", "Playful", "Elegant"
];

export default function NewProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<any | null>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedIcon(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSearchIcon = (icon: any) => {
    setSelectedIcon(icon);
    setPreview(icon.thumbnail_url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    if (selectedIcon) {
        formData.append("iconId", selectedIcon.id);
        formData.append("iconUrl", selectedIcon.thumbnail_url);
    }

    try {
      const result = await createProject(formData);
      toast.success("Build Complete!", {
          description: "Your assets and metadata are ready.",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      });
      if (result?.id) {
        router.push(`/project/${result.id}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create project");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col selection:bg-black selection:text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <header className="px-6 lg:px-12 h-24 flex items-center border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/dashboard" className="mr-6">
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-zinc-100 h-12 w-12 transition-all active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight">New Build</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12 relative z-10">
        <div className="mb-12 space-y-4 text-center lg:text-left">
          <h1 className="text-5xl font-black text-zinc-900 tracking-tight leading-tight">Start the <br className="hidden md:block" /> <span className="text-zinc-300">Magic Build.</span></h1>
          <p className="text-zinc-500 text-lg">Upload your vision or search the global icon library.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3 space-y-10">
              <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-zinc-200/50 overflow-hidden bg-white">
                <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black text-zinc-900 leading-none">App Intelligence</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1 uppercase tracking-widest text-zinc-400">Basic Configuration</CardDescription>
                  </div>
                  <Sparkles className="w-6 h-6 text-zinc-100" />
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-2 group/field">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-focus-within/field:text-black transition-colors flex items-center gap-2">
                      <Type className="w-3 h-3" /> App Name
                    </label>
                    <Input name="appName" placeholder="e.g. ZenList" required className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-black focus:border-zinc-900 transition-all font-bold" />
                  </div>
                  <div className="space-y-2 group/field">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-focus-within/field:text-black transition-colors flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Short Description
                    </label>
                    <Textarea name="description" placeholder="Describe your app vision in a few sentences..." className="rounded-2xl min-h-[120px] border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-black focus:border-zinc-900 transition-all font-medium py-4 px-4" />
                  </div>
                  <div className="space-y-2 group/field">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-focus-within/field:text-black transition-colors flex items-center gap-2">
                      <Rocket className="w-3 h-3" /> What's New (Optional)
                    </label>
                    <Textarea name="whatsNew" placeholder="e.g. Added dark mode, improved performance, new sharing features..." className="rounded-2xl min-h-[100px] border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-black focus:border-zinc-900 transition-all font-medium py-4 px-4" />
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">For version updates - AI will craft creative release notes</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 group/field">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-focus-within/field:text-black transition-colors flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Market Category
                      </label>
                      <Select name="category" defaultValue="Productivity">
                        <SelectTrigger className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white font-bold px-4"><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100 p-2">
                          {categories.map(c => <SelectItem key={c} value={c} className="rounded-xl font-bold py-3">{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 group/field">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-focus-within/field:text-black transition-colors flex items-center gap-2">
                        <Megaphone className="w-3 h-3" /> Brand Tone
                      </label>
                      <Select name="tone" defaultValue="Minimalist">
                        <SelectTrigger className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white font-bold px-4"><SelectValue placeholder="Select Tone" /></SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100 p-2">
                          {tones.map(t => <SelectItem key={t} value={t} className="rounded-xl font-bold py-3">{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                      <Palette className="w-3 h-3" /> Primary Brand Color
                    </label>
                    <div className="flex gap-6 items-center bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
                      <Input type="color" name="brandColor" defaultValue="#000000" className="w-16 h-12 p-1.5 rounded-xl cursor-pointer border-none bg-transparent" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-zinc-900">Brand Identity</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Sets splash and icon background</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-10 lg:sticky lg:top-36">
              <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-zinc-200/50 overflow-hidden bg-white">
                <Tabs defaultValue="upload" className="w-full">
                  <header className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-zinc-50">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-black text-zinc-900 leading-none">Icon Asset</CardTitle>
                        <CardDescription className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Master 1024x1024</CardDescription>
                    </div>
                    <TabsList className="bg-zinc-50 rounded-xl p-1 h-10">
                        <TabsTrigger value="upload" className="rounded-lg h-full px-4 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <ImageIcon className="w-3.5 h-3.5 mr-2" /> Upload
                        </TabsTrigger>
                        <TabsTrigger value="search" className="rounded-lg h-full px-4 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Library className="w-3.5 h-3.5 mr-2" /> Library
                        </TabsTrigger>
                    </TabsList>
                  </header>

                  <CardContent className="p-10 pt-8">
                    <TabsContent value="upload" className="mt-0 focus-visible:outline-none">
                        <div className="flex flex-col items-center justify-center border-4 border-dashed border-zinc-50 rounded-[2rem] p-12 transition-all hover:border-zinc-100 hover:bg-zinc-50/30 relative group bg-zinc-50/30">
                        {preview && !selectedIcon ? (
                            <div className="relative w-full aspect-square max-w-[160px] animate-in zoom-in duration-300">
                            <img src={preview} alt="Icon Preview" className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl" />
                            <Button type="button" variant="destructive" size="sm" className="absolute -top-3 -right-3 rounded-2xl h-10 w-10 p-0 shadow-lg" onClick={() => setPreview(null)}>×</Button>
                            </div>
                        ) : (
                            <>
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                                <ImageIcon className="w-8 h-8 text-zinc-300 group-hover:text-white" />
                            </div>
                            <p className="text-sm font-black text-zinc-900 text-center">Drop icon here</p>
                            <p className="text-[10px] font-black text-zinc-300 mt-2 uppercase tracking-[0.2em]">PNG / JPG</p>
                            </>
                        )}
                        <input type="file" name="icon" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleIconChange} required={!preview && !selectedIcon} />
                        </div>
                    </TabsContent>

                    <TabsContent value="search" className="mt-0 focus-visible:outline-none">
                        <IconSearch onSelect={handleSelectSearchIcon} selectedId={selectedIcon?.id} />
                        {selectedIcon && (
                            <div className="mt-6 flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 animate-in slide-in-from-bottom-2">
                                <img src={selectedIcon.thumbnail_url} className="w-12 h-12 rounded-xl shadow-md bg-white p-1" alt="Selected" />
                                <div>
                                    <p className="text-sm font-black">Library Icon Selected</p>
                                    <button type="button" onClick={() => {setSelectedIcon(null); setPreview(null);}} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Remove</button>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-18 mt-10 text-lg font-black rounded-[2rem] bg-black hover:bg-zinc-800 text-white shadow-2xl shadow-zinc-400/30 transition-all hover:-translate-y-1 active:scale-[0.98] group"
                    >
                      {loading ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Orchestrating...</> : <><Sparkles className="mr-3 h-6 w-6 text-yellow-400 group-hover:animate-pulse" /> Initiate Build</>}
                    </Button>
                  </CardContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <footer className="py-20 mt-20 border-t border-zinc-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-zinc-300 text-xs font-black uppercase tracking-[0.5em]">Standard Build Protocol v1.0</p>
        </div>
      </footer>
    </div>
  );
}
