import React, { useState, useCallback, useEffect } from 'react';
import { Play, ArrowRight, ArrowUpRight, X, ChevronLeft, ChevronRight, Instagram, Youtube, MessageCircle, Mail, ChevronDown } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';

// --- Types ---
type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  videoId: string;
};

// --- Data ---

// --- Components ---

const VideoModal = ({ isOpen, onClose, videoId }: { isOpen: boolean; onClose: () => void; videoId: string | null }) => {
  if (!isOpen || !videoId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-sky-400 transition-colors z-50"
      >
        <X className="w-10 h-10" strokeWidth={1.5} />
      </button>
      <div className="w-full max-w-6xl aspect-video bg-zinc-900 overflow-hidden shadow-2xl relative">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};

const CarouselSection = ({ 
  id,
  title, 
  videos, 
  isVertical = false,
  onPlay,
  socialLinks
}: { 
  id?: string;
  title: string; 
  videos: VideoItem[]; 
  isVertical?: boolean;
  onPlay: (id: string) => void;
  socialLinks?: React.ReactNode;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id={id} className="py-16 sm:py-24 bg-black border-t border-zinc-900 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white uppercase tracking-tighter mb-4">
              {title}
            </h2>
            {socialLinks && (
              <div className="flex flex-wrap gap-4">
                {socialLinks}
              </div>
            )}
          </div>
          <div className="flex gap-3 sm:gap-4 self-start md:self-auto">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-zinc-700 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-zinc-700 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-hidden -my-8 py-8" 
          ref={emblaRef}
        >
          <div className="flex -ml-4 sm:-ml-6">
            {videos.length > 0 ? videos.map((video, index) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={video.id} 
                className={`flex-none pl-4 sm:pl-6 ${isVertical ? 'w-[280px] sm:w-[360px]' : 'w-[85vw] sm:w-[600px] lg:w-[800px]'}`}
              >
                <div className="group relative overflow-hidden bg-zinc-900 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/20 hover:z-10" onClick={() => onPlay(video.videoId)}>
                  <div className={`relative w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center text-white transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="py-4 sm:py-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-white uppercase tracking-tight line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="pl-4 sm:pl-6 text-zinc-500 font-display uppercase tracking-widest text-sm sm:text-base">Carregando vídeos...</div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function App() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    // Fetch latest videos from YouTube Channel (SintagmaMidia)
    // Using rss2json as a free proxy to bypass CORS and API key requirements
    const fetchYouTubeVideos = async () => {
      try {
        const channelId = 'UCubalZ-AjWT_MaTpvE1DS5A';
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items) {
          const videos: VideoItem[] = data.items.map((item: any) => {
            // Extract video ID from guid (e.g., "yt:video:_Dq45eJKYXg")
            const videoId = item.guid.replace('yt:video:', '');
            return {
              id: videoId,
              title: item.title,
              thumbnail: item.thumbnail,
              videoId: videoId
            };
          });
          setYoutubeVideos(videos);
        }
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      }
    };

    fetchYouTubeVideos();
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-zinc-300 selection:bg-sky-500/30">
      <VideoModal 
        isOpen={!!activeVideo} 
        videoId={activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />

      {/* Section 1: Demoreel */}
      <section className="relative h-[100dvh] w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/jtjK7z_o-7A?autoplay=1&mute=1&loop=1&playlist=jtjK7z_o-7A&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100dvh] min-w-[177.77dvh] -translate-x-1/2 -translate-y-1/2 border-none max-w-none"
            allow="autoplay; encrypted-media"
            allowFullScreen
            tabIndex={-1}
          />
        </div>
        
        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-black text-white mb-4 sm:mb-6 tracking-tighter uppercase leading-[1.1] sm:leading-[0.9]"
          >
            Produção <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200">Audiovisual</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-2xl text-zinc-300 mb-8 sm:mb-12 max-w-3xl font-light tracking-wide px-2"
          >
            Conteúdo estratégico para campanhas políticas, comunicação institucional e presença digital.
          </motion.p>
          <motion.a 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            href="#contato"
            className="group flex items-center gap-3 sm:gap-4 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-display font-bold uppercase tracking-wider text-xs sm:text-sm md:text-base transition-all hover:bg-sky-400 hover:text-white"
          >
            Entrar em contato
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </motion.a>
        </div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          href="#sobre"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce z-20"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10" />
        </motion.a>
      </section>

      {/* Section 2: Breve descrição */}
      <section id="sobre" className="py-20 sm:py-32 bg-zinc-950 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white uppercase tracking-tighter leading-tight">
                Especialistas em <br/>
                <span className="text-sky-400">Imagem Pública</span>
              </h2>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 lg:pl-12 border-t border-zinc-800 pt-6 sm:pt-8 lg:border-t-0 lg:border-l lg:pt-0"
            >
              <p className="text-xl sm:text-2xl md:text-3xl text-zinc-400 leading-snug font-light">
                A <strong className="text-white font-medium">SintagmaFilms</strong> é uma produtora especializada em conteúdo audiovisual para campanhas políticas, comunicação pública e presença digital, desenvolvendo vídeos estratégicos para televisão, internet e redes sociais.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Geração de conteúdo (Dynamic from YouTube) */}
      <CarouselSection 
        id="portfolio"
        title="Conteúdo Digital" 
        videos={youtubeVideos} 
        isVertical={false}
        onPlay={setActiveVideo}
        socialLinks={
          <>
            <a 
              href="https://www.youtube.com/@SintagmaMidia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors font-display font-bold uppercase text-sm tracking-wider"
            >
              <Youtube className="w-5 h-5" />
              YouTube
            </a>
            <a 
              href="https://www.instagram.com/sintagmafilmes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-pink-500 transition-colors font-display font-bold uppercase text-sm tracking-wider"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
          </>
        }
      />

      {/* Section 6: Contato */}
      <section id="contato" className="py-20 sm:py-32 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl sm:text-6xl md:text-8xl font-display font-black text-white uppercase tracking-tighter mb-6 sm:mb-8 leading-none">
                Fale <br/>
                <span className="text-sky-400">Conosco</span>
              </h2>
              <p className="text-zinc-400 text-lg sm:text-xl md:text-2xl mb-10 sm:mb-16 max-w-md font-light">
                Pronto para elevar a comunicação da sua campanha ou mandato?
              </p>
              
              <div className="space-y-8 sm:space-y-10">
                <div>
                  <h4 className="text-xs sm:text-sm font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Telefone</h4>
                  <a href="tel:+5543999477677" className="text-white text-2xl sm:text-3xl md:text-4xl font-display font-medium hover:text-sky-400 transition-colors">
                    +55 43 99947-7677
                  </a>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Email</h4>
                  <a href="mailto:sintagmafilmes@gmail.com" className="text-white text-xl sm:text-2xl md:text-3xl font-display font-medium hover:text-sky-400 transition-colors break-all">
                    sintagmafilmes@gmail.com
                  </a>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Localização</h4>
                  <p className="text-white text-xl sm:text-2xl md:text-3xl font-display font-medium">
                    Londrina, PR
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Options */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pt-4 flex flex-col justify-center space-y-4 sm:space-y-6"
            >
              <a 
                href="https://wa.me/5543999477677?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20SintagmaFilms."
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-display font-bold uppercase tracking-wider py-4 sm:py-6 px-6 sm:px-8 rounded-none transition-all flex items-center justify-between text-base sm:text-lg md:text-xl"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-left">Falar pelo WhatsApp</span>
                </div>
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0" />
              </a>

              <a 
                href="mailto:sintagmafilmes@gmail.com?subject=Contato%20via%20Site"
                className="group w-full bg-white hover:bg-zinc-200 text-black font-display font-bold uppercase tracking-wider py-4 sm:py-6 px-6 sm:px-8 rounded-none transition-all flex items-center justify-between text-base sm:text-lg md:text-xl"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-left">Enviar um E-mail</span>
                </div>
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0" />
              </a>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 sm:py-12 border-t border-zinc-900">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <div className="text-xl sm:text-2xl font-display font-black text-white tracking-tighter uppercase">
            Sintagma<span className="text-sky-400">Films</span>
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm font-display uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
