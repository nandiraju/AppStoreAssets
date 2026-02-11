import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Smartphone, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-6">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">AppStoreForge</span>
        </Link>
        <nav className="flex gap-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="font-medium text-muted-foreground hover:text-black">Dashboard</Button>
          </Link>
          <Link href="/new">
            <Button className="font-semibold rounded-xl bg-black hover:bg-zinc-800 text-white px-6">
              Create Project
            </Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-24 text-center">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-sm font-medium text-zinc-600 mb-4">
            <Zap className="w-4 h-4 fill-zinc-600" />
            <span>AI-Powered Asset Generation</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
            Generate Store-Ready <br />
            <span className="text-zinc-400">App Assets in Minutes</span>
          </h1>
          
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Upload one icon. Get everything you need for iOS, Android, and Expo. 
            AI-generated metadata, perfectly sized assets, and app.json snippets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/new">
              <Button size="lg" className="h-16 px-10 text-lg font-semibold rounded-2xl bg-black hover:bg-zinc-800 text-white shadow-xl shadow-zinc-200 transition-all hover:scale-[1.02]">
                Start Generating <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-semibold rounded-2xl border-2 hover:bg-zinc-50 transition-all">
                View Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            {[
              { icon: Sparkles, title: "AI Metadata", desc: "Instantly generate localized titles and descriptions." },
              { icon: Smartphone, title: "Expo Ready", desc: "Get all required icons and splash screens automatically." },
              { icon: Zap, title: "Bullet Speed", desc: "Go from icon to store submission in under 60 seconds." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="py-12 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold">AppStoreForge</span>
          </div>
          <p className="text-sm text-zinc-400">© 2026 AppStoreForge. Built with AntiGravity.</p>
        </div>
      </footer>
    </div>
  );
}
