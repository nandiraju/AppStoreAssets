import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Smartphone, Layout, FileJson, Trash2, ExternalLink, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { deleteProject } from "@/app/actions";
import DownloadPackage from "@/components/DownloadPackage";
import ConfigSnippet from "@/components/ConfigSnippet";
import CopyField from "@/components/CopyField";

async function getProjectData(id: string) {
  const { data: project } = await supabase
    .from('projects')
    .select('*, metadata(*), assets(*)')
    .eq('id', id)
    .single();
  
  return project;
}

export default async function ProjectDetails({ params }: { params: { id: string } }) {
  const { id } = await params;
  const project = await getProjectData(id);

  if (!project) {
    notFound();
  }

  const metadata = project.metadata?.[0]; // Usually just one
  
  const appConfigSnippet = {
    expo: {
      icon: "./assets/icon.png",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: project.brand_color || "#FFFFFF"
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: project.brand_color || "#FFFFFF"
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col selection:bg-black selection:text-white">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <header className="px-6 lg:px-12 h-24 flex items-center justify-between border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-zinc-100 h-12 w-12 transition-all active:scale-95">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: project.brand_color || '#000' }}
            >
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-black text-zinc-900 leading-none">{project.app_name}</h1>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">{project.category || 'App'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <form action={deleteProject.bind(null, project.id)}>
            <Button variant="ghost" size="icon" className="rounded-2xl text-zinc-300 hover:text-red-500 hover:bg-red-50 h-12 w-12 transition-all">
              <Trash2 className="w-5 h-5" />
            </Button>
          </form>
          <DownloadPackage project={project} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12 relative z-10">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-black text-emerald-600 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Magic Complete
            </div>
            <h2 className="text-5xl font-black text-zinc-900 tracking-tight leading-[1.1]">
                Store-ready <br className="hidden md:block" /> 
                <span className="text-zinc-300">in record time.</span>
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="pr-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">AI Optimized</p>
                    <p className="text-sm font-bold text-zinc-900 mt-1">ASO Engine Active</p>
                </div>
             </div>
          </div>
        </div>

        <Tabs defaultValue="metadata" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white/50 backdrop-blur-md p-1.5 border border-zinc-200/50 rounded-[2rem] h-16 shadow-lg inline-flex">
                <TabsTrigger value="metadata" className="rounded-[1.5rem] px-10 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                <Sparkles className="w-4 h-4 mr-2" /> Metadata
                </TabsTrigger>
                <TabsTrigger value="assets" className="rounded-[1.5rem] px-10 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                <Layout className="w-4 h-4 mr-2" /> Assets
                </TabsTrigger>
                <TabsTrigger value="config" className="rounded-[1.5rem] px-10 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                <FileJson className="w-4 h-4 mr-2" /> Config
                </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="metadata" className="focus-visible:outline-none animate-in fade-in duration-500">
            {!metadata ? (
                <Card className="rounded-[3rem] border-dashed border-2 border-zinc-200 bg-white shadow-none p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-6">
                        <Info className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900">Metadata is still brewing...</h3>
                    <p className="text-zinc-500 max-w-sm mt-2">The AI is currently crafting high-converting descriptions for your app. Please refresh in a moment. </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* iOS Metadata */}
                <Card className="rounded-[3rem] border-none shadow-2xl shadow-zinc-200/50 overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-0">
                    <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-600 text-white border-none font-black text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-full">Apple App Store</Badge>
                        <Smartphone className="w-5 h-5 text-zinc-200" />
                    </div>
                    <CardTitle className="text-3xl font-black text-zinc-900">iOS Metadata</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">Optimized for Apple's search algorithms</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <CopyField label="App Title" value={metadata.ios_data.title} />
                        <CopyField label="Subtitle" value={metadata.ios_data.subtitle} />
                        <CopyField label="Promotional Text" value={metadata.ios_data.promotional_text} />
                        <CopyField label="What's New" value={metadata.ios_data.whats_new} multiline />
                        <CopyField label="Keywords" value={metadata.ios_data.keywords} multiline />
                        <CopyField label="Description" value={metadata.ios_data.description} multiline />
                    </CardContent>
                </Card>

                {/* Android Metadata */}
                <Card className="rounded-[3rem] border-none shadow-2xl shadow-zinc-200/50 overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-0">
                    <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-green-600 text-white border-none font-black text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-full">Google Play Store</Badge>
                        <Smartphone className="w-5 h-5 text-zinc-200" />
                    </div>
                    <CardTitle className="text-3xl font-black text-zinc-900">Android Metadata</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">Optimized for Google Play search signals</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <CopyField label="App Title" value={metadata.android_data.title} />
                        <CopyField label="Short Description" value={metadata.android_data.short_desc} />
                        <CopyField label="What's New" value={metadata.android_data.whats_new} multiline />
                        <CopyField label="Long Description" value={metadata.android_data.long_desc} multiline />
                    </CardContent>
                </Card>
                </div>
            )}
          </TabsContent>

          <TabsContent value="assets" className="focus-visible:outline-none animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {project.assets?.map((asset: any) => (
                <Card key={asset.id} className="rounded-[2.5rem] border-none shadow-xl shadow-zinc-200/50 overflow-hidden bg-white group transition-all hover:-translate-y-2">
                  <div className="aspect-[4/5] bg-zinc-50 relative flex items-center justify-center p-10">
                    <img 
                      src={asset.file_url} 
                      alt={asset.type} 
                      className={`object-contain ${asset.type === 'splash' ? 'h-full max-h-[80%]' : 'w-full'} shadow-2xl transition-transform group-hover:scale-110 duration-500`} 
                    />
                    <a 
                      href={asset.file_url} 
                      target="_blank" 
                      className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                    >
                      <Button variant="secondary" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-xl hover:bg-zinc-900 hover:text-white transition-all">
                        <ExternalLink className="w-5 h-5" />
                      </Button>
                    </a>
                  </div>
                  <div className="p-8 space-y-2 border-t border-zinc-50">
                    <h3 className="text-lg font-black text-zinc-900 capitalize leading-none">{asset.type.replace('-', ' ')}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                      {asset.type === 'splash' ? '1284 x 2778 px' : asset.type === 'favicon' ? '48 x 48 px' : '1024 x 1024 px'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="config" className="focus-visible:outline-none animate-in fade-in duration-500">
            <Card className="rounded-[3rem] border-none shadow-2xl shadow-zinc-200/50 overflow-hidden bg-white">
              <CardHeader className="p-10 pb-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                        <FileJson className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black text-zinc-900 leading-none">Configuration</CardTitle>
                        <CardDescription className="text-sm font-medium mt-1 uppercase tracking-widest text-zinc-400">app.json Snippet</CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                <ConfigSnippet snippet={appConfigSnippet} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-20 mt-20 border-t border-zinc-100 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-zinc-300 text-xs font-black uppercase tracking-[0.5em]">End of Build</p>
        </div>
      </footer>
    </div>
  );
}
