import React from 'react';
import { Play } from 'lucide-react';

export default function Demoreel() {
  return (
    <section className="relative py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">Demoreel 2026</h2>
            <p className="text-zinc-400 mt-4 max-w-xl">A showcase of our most impactful governmental campaigns and institutional documentaries.</p>
          </div>
        </div>
        
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden group cursor-pointer bg-zinc-900">
          <img 
            src="https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2071&auto=format&fit=crop" 
            alt="Demoreel Thumbnail"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
