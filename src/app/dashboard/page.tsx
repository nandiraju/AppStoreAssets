import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Plus, Smartphone, Calendar, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function getProjects() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*, assets(*)')
    .order('created_at', { ascending: false });
  
  return projects || [];
}

export default async function Dashboard() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col selection:bg-black selection:text-white">
      {/* Subtle Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <header className="px-6 lg:px-12 h-24 flex items-center justify-between border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-black tracking-tight">AppStoreForge</span>
        </div>
        <Link href="/new">
          <Button className="rounded-2xl bg-black hover:bg-zinc-800 text-white font-bold h-12 px-6 shadow-xl shadow-zinc-200 transition-all active:scale-95">
            <Plus className="w-5 h-5 mr-2" /> New Project
          </Button>
        </Link>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight">My Projects</h1>
          <p className="text-zinc-500 mt-2 text-lg">Manage your storefront assets and generative metadata.</p>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-zinc-100 shadow-xl shadow-zinc-200/50">
            <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-8">
              <Plus className="w-10 h-10 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900">Start your first build</h2>
            <p className="text-zinc-500 max-w-sm text-center mt-3 leading-relaxed">
              Upload your app icon and let AI craft your metadata in seconds.
            </p>
            <Link href="/new" className="mt-8">
              <Button size="lg" className="rounded-2xl bg-black hover:bg-zinc-800 text-white font-bold px-10 h-14 shadow-xl shadow-zinc-200">
                Create Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => {
              const icon = project.assets?.find((a: any) => a.type === 'icon');
              return (
                <Link key={project.id} href={`/project/${project.id}`} className="group">
                  <Card className="rounded-[2.5rem] border-none shadow-xl shadow-zinc-200/50 overflow-hidden bg-white transition-all hover:shadow-2xl hover:shadow-zinc-300/50 hover:-translate-y-1 h-full flex flex-col">
                    <div className="p-8 pb-4 flex items-start justify-between">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500 overflow-hidden"
                        style={{ backgroundColor: project.brand_color || '#000' }}
                      >
                        {icon ? (
                          <img src={icon.file_url} alt={project.app_name} className="w-full h-full object-cover" />
                        ) : (
                          <Smartphone className="w-8 h-8" />
                        )}
                      </div>
                      <div className="bg-zinc-50 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {project.category || 'App'}
                      </div>
                    </div>
                    <CardHeader className="p-8 pt-4 pb-0 flex-1">
                      <CardTitle className="text-2xl font-black text-zinc-900 leading-tight group-hover:text-black transition-colors">{project.app_name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-3 text-sm font-medium leading-relaxed group-hover:text-zinc-600 transition-colors">
                        {project.description || "No description provided."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-6 mt-auto">
                      <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {new Date(project.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
