import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Play, ArrowRight, ArrowUpRight, X, ChevronLeft, ChevronRight, Instagram, Youtube, MessageCircle, Mail, ChevronDown } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import CustomCursor from './components/CustomCursor';
import { getOptimizedImageUrl } from './utils/cdn';

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

const VideoCard = ({ video, isVertical, onPlay, index }: { video: VideoItem, isVertical?: boolean, onPlay: (id: string) => void, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Delay loading the iframe to prevent accidental loads while scrolling/moving mouse quickly
    hoverTimeoutRef.current = setTimeout(() => {
      setShowIframe(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowIframe(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className={`flex-none pl-4 sm:pl-6 ${isVertical ? 'w-[240px] sm:w-[300px]' : 'w-[80vw] sm:w-[450px] lg:w-[600px]'}`}
    >
      <article 
        className="group relative overflow-hidden bg-zinc-900 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/20 hover:z-10" 
        onClick={() => onPlay(video.videoId)} 
        data-video-hover="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`relative w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden`}>
          <img 
            src={getOptimizedImageUrl(video.thumbnail, isVertical ? 300 : 600)} 
            alt={`Thumbnail do vídeo: ${video.title} - SintagmaMidia Produtora Audiovisual`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${showIframe ? 'opacity-0' : 'opacity-80 group-hover:opacity-100'}`}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          
          {showIframe && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }} // Fade in after iframe has some time to load
              className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${video.videoId}`}
                className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 border-none max-w-none pointer-events-none scale-[1.35]"
                allow="autoplay; encrypted-media"
                allowFullScreen
                tabIndex={-1}
                loading="lazy"
              />
            </motion.div>
          )}

          <div className={`absolute inset-0 transition-colors duration-500 z-10 ${showIframe ? 'bg-transparent' : 'bg-black/40 group-hover:bg-black/10'}`} />
          
          <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-500 ${showIframe ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center text-white transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="py-4 sm:py-6 relative z-20 bg-zinc-900">
          <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-white uppercase tracking-tight line-clamp-2">
            {video.title}
          </h3>
        </div>
      </article>
    </motion.div>
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
              <VideoCard 
                key={video.id} 
                video={video} 
                isVertical={isVertical} 
                onPlay={onPlay} 
                index={index} 
              />
            )) : (
              <div className="pl-4 sm:pl-6 text-zinc-500 font-display uppercase tracking-widest text-sm sm:text-base">Carregando vídeos...</div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const BriefingForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    objetivo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate network request
    setTimeout(() => {
      // Construct email body
      const subject = encodeURIComponent(`Novo Briefing: ${formData.empresa} - ${formData.nome}`);
      const body = encodeURIComponent(
        `Nome: ${formData.nome}\nEmpresa: ${formData.empresa}\nObjetivo do Projeto: ${formData.objetivo}`
      );
      
      // Open default email client
      window.location.href = `mailto:sintagmamidia@gmail.com?subject=${subject}&body=${body}`;
      
      setStatus('success');
      setFormData({ nome: '', empresa: '', objetivo: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (status === 'success') {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-tighter mb-2">Briefing Enviado!</h3>
        <p className="text-zinc-400 font-display">Obrigado pelo interesse. Seu cliente de e-mail foi aberto com os dados do projeto. Entraremos em contato em breve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 flex flex-col space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-tighter mb-2">Iniciar Projeto</h3>
        <p className="text-zinc-400 text-sm sm:text-base font-display mb-4">Preencha o briefing rápido e enviaremos uma proposta.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-xs font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Nome Completo</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            required
            value={formData.nome}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors font-display"
            placeholder="Seu nome"
          />
        </div>
        
        <div>
          <label htmlFor="empresa" className="block text-xs font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Empresa</label>
          <input 
            type="text" 
            id="empresa" 
            name="empresa" 
            required
            value={formData.empresa}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors font-display"
            placeholder="Nome da sua empresa"
          />
        </div>
        
        <div>
          <label htmlFor="objetivo" className="block text-xs font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Objetivo do Projeto</label>
          <select 
            id="objetivo" 
            name="objetivo" 
            required
            value={formData.objetivo}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors font-display appearance-none"
          >
            <option value="" disabled>Selecione uma opção</option>
            <option value="Vídeo Institucional">Vídeo Institucional</option>
            <option value="Comercial / Publicidade">Comercial / Publicidade</option>
            <option value="Cobertura de Evento">Cobertura de Evento</option>
            <option value="Conteúdo para Redes Sociais">Conteúdo para Redes Sociais</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full bg-white hover:bg-zinc-200 text-black font-display font-bold uppercase tracking-wider py-4 px-6 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
      >
        {status === 'submitting' ? 'Enviando...' : 'Enviar Briefing'}
        {status !== 'submitting' && <ArrowRight className="w-5 h-5" />}
      </button>
    </form>
  );
};

const FALLBACK_PLAYLIST_VIDEOS: VideoItem[] = [
  {
    id: "wMysbzl1f2A",
    title: "Doc. Cambé Vigilância Sanitaria",
    thumbnail: "https://i.ytimg.com/vi/wMysbzl1f2A/hqdefault.jpg",
    videoId: "wMysbzl1f2A"
  },
  {
    id: "-W_zXjsJ4-g",
    title: "Projeto New Look   final",
    thumbnail: "https://i.ytimg.com/vi/-W_zXjsJ4-g/hqdefault.jpg",
    videoId: "-W_zXjsJ4-g"
  },
  {
    id: "972uDmv0JDY",
    title: "Henrique de Aragão – Um Artista Transcendente   FHD 1080p",
    thumbnail: "https://i.ytimg.com/vi/972uDmv0JDY/hqdefault.jpg",
    videoId: "972uDmv0JDY"
  },
  {
    id: "daBfvAD7660",
    title: "O Agro Nos Move   Piloto Programa TV",
    thumbnail: "https://i.ytimg.com/vi/daBfvAD7660/hqdefault.jpg",
    videoId: "daBfvAD7660"
  },
  {
    id: "hnhO5tvLseM",
    title: "DOC IBIAFRO 2024   MESTRE CLAUDIO   c legend E GC",
    thumbnail: "https://i.ytimg.com/vi/hnhO5tvLseM/hqdefault.jpg",
    videoId: "hnhO5tvLseM"
  }
];

const FALLBACK_EVENTS_VIDEOS: VideoItem[] = [
  {
    id: "4T6NXlSAGxk",
    title: "Quadra   Inauguracao Predio",
    thumbnail: "https://i.ytimg.com/vi/4T6NXlSAGxk/hqdefault.jpg",
    videoId: "4T6NXlSAGxk"
  },
  {
    id: "JdLkdhoI50E",
    title: "Sicoob 15 anos   compacto",
    thumbnail: "https://i.ytimg.com/vi/JdLkdhoI50E/hqdefault.jpg",
    videoId: "JdLkdhoI50E"
  },
  {
    id: "ZDsVp5FVpSo",
    title: "Superagro Evento Geral",
    thumbnail: "https://i.ytimg.com/vi/ZDsVp5FVpSo/hqdefault.jpg",
    videoId: "ZDsVp5FVpSo"
  },
  {
    id: "bifnj3Ztz_g",
    title: "Sicoob   Cantata de Natal   Trailer",
    thumbnail: "https://i.ytimg.com/vi/bifnj3Ztz_g/hqdefault.jpg",
    videoId: "bifnj3Ztz_g"
  }
];

const FALLBACK_REELS_VIDEOS: VideoItem[] = [
  {
    "id": "2x4vs7StSto",
    "title": "reels011 ibip obras prefeitura",
    "thumbnail": "https://i.ytimg.com/vi/2x4vs7StSto/hqdefault.jpg",
    "videoId": "2x4vs7StSto"
  },
  {
    "id": "3l8ald-AJK8",
    "title": "Londrina CARTELA 1080x1920 F",
    "thumbnail": "https://i.ytimg.com/vi/3l8ald-AJK8/hqdefault.jpg",
    "videoId": "3l8ald-AJK8"
  },
  {
    "id": "6BoN3vDkxk8",
    "title": "amepar reels",
    "thumbnail": "https://i.ytimg.com/vi/6BoN3vDkxk8/hqdefault.jpg",
    "videoId": "6BoN3vDkxk8"
  },
  {
    "id": "VpYR4HGZnxY",
    "title": "gleba set   02 crescimento londrina",
    "thumbnail": "https://i.ytimg.com/vi/VpYR4HGZnxY/hqdefault.jpg",
    "videoId": "VpYR4HGZnxY"
  },
  {
    "id": "Vwyt7YrsR44",
    "title": "Camara Apucarana Cafés   02",
    "thumbnail": "https://i.ytimg.com/vi/Vwyt7YrsR44/hqdefault.jpg",
    "videoId": "Vwyt7YrsR44"
  },
  {
    "id": "jAagznuOtwc",
    "title": "BR Coins 01   Instagram",
    "thumbnail": "https://i.ytimg.com/vi/jAagznuOtwc/hqdefault.jpg",
    "videoId": "jAagznuOtwc"
  },
  {
    "id": "lIVlhauiyCc",
    "title": "Ibipora reels 1 transito",
    "thumbnail": "https://i.ytimg.com/vi/lIVlhauiyCc/hqdefault.jpg",
    "videoId": "lIVlhauiyCc"
  },
  {
    "id": "onpWbJc-99I",
    "title": "reels12 escorpiao",
    "thumbnail": "https://i.ytimg.com/vi/onpWbJc-99I/hqdefault.jpg",
    "videoId": "onpWbJc-99I"
  },
  {
    "id": "um2tZ7O2c-A",
    "title": "teaser barretao 70tao",
    "thumbnail": "https://i.ytimg.com/vi/um2tZ7O2c-A/hqdefault.jpg",
    "videoId": "um2tZ7O2c-A"
  }
];

const FALLBACK_INSTITUTIONAL_VIDEOS: VideoItem[] = [
  {
    id: "foSgpqZjFrI",
    title: "Institucional Grupo Rossetto",
    thumbnail: "https://i.ytimg.com/vi/foSgpqZjFrI/hqdefault.jpg",
    videoId: "foSgpqZjFrI"
  },
  {
    id: "Syq3pa9ix8g",
    title: "Institucional Forquimica",
    thumbnail: "https://i.ytimg.com/vi/Syq3pa9ix8g/hqdefault.jpg",
    videoId: "Syq3pa9ix8g"
  },
  {
    id: "PS3VGSZb_9E",
    title: "Institucional Ceramica Cidade Nova",
    thumbnail: "https://i.ytimg.com/vi/PS3VGSZb_9E/hqdefault.jpg",
    videoId: "PS3VGSZb_9E"
  },
  {
    id: "0v6ys4xxdYY",
    title: "AMEPAR Instittucional",
    thumbnail: "https://i.ytimg.com/vi/0v6ys4xxdYY/hqdefault.jpg",
    videoId: "0v6ys4xxdYY"
  },
  {
    id: "PcVzKS69m18",
    title: "Institucional Stevia Natus",
    thumbnail: "https://i.ytimg.com/vi/PcVzKS69m18/hqdefault.jpg",
    videoId: "PcVzKS69m18"
  }
];

const FALLBACK_POLITICS_VIDEOS: VideoItem[] = [
  {
    "id": "F4XunaSaGgI",
    "title": "Hauly   Programa Arapongas",
    "thumbnail": "https://i.ytimg.com/vi/F4XunaSaGgI/hqdefault.jpg",
    "videoId": "F4XunaSaGgI"
  },
  {
    "id": "MJS-aAE-b_8",
    "title": "Hauly   Programa Paraná",
    "thumbnail": "https://i.ytimg.com/vi/MJS-aAE-b_8/hqdefault.jpg",
    "videoId": "MJS-aAE-b_8"
  },
  {
    "id": "UczFKlx0fz8",
    "title": "Paulinho Vilela   PROG 06   propostas",
    "thumbnail": "https://i.ytimg.com/vi/UczFKlx0fz8/hqdefault.jpg",
    "videoId": "UczFKlx0fz8"
  },
  {
    "id": "_yVTPx7m2Ak",
    "title": "VT   70 anos Ibipora 30s",
    "thumbnail": "https://i.ytimg.com/vi/_yVTPx7m2Ak/hqdefault.jpg",
    "videoId": "_yVTPx7m2Ak"
  },
  {
    "id": "aSvGUy2uvEo",
    "title": "POLITICA   lancamento campanha juninho",
    "thumbnail": "https://i.ytimg.com/vi/aSvGUy2uvEo/hqdefault.jpg",
    "videoId": "aSvGUy2uvEo"
  },
  {
    "id": "cd4zsVr8jHE",
    "title": "VT 74 Anos Ibipora   Internet",
    "thumbnail": "https://i.ytimg.com/vi/cd4zsVr8jHE/hqdefault.jpg",
    "videoId": "cd4zsVr8jHE"
  },
  {
    "id": "k1eBzNzIE8Q",
    "title": "Paulinho Vilela   PROG 01   intro",
    "thumbnail": "https://i.ytimg.com/vi/k1eBzNzIE8Q/hqdefault.jpg",
    "videoId": "k1eBzNzIE8Q"
  },
  {
    "id": "krgxqtlZw_o",
    "title": "VT Pref Ibipora   IPTU 2018",
    "thumbnail": "https://i.ytimg.com/vi/krgxqtlZw_o/hqdefault.jpg",
    "videoId": "krgxqtlZw_o"
  },
  {
    "id": "l-QxPYCPFMI",
    "title": "VT IBIPORA ROÇAGEM 2024   Internet",
    "thumbnail": "https://i.ytimg.com/vi/l-QxPYCPFMI/hqdefault.jpg",
    "videoId": "l-QxPYCPFMI"
  },
  {
    "id": "rkm2iAzRWEg",
    "title": "VT CAMBÉ 75 ANOS   FHD 1080p",
    "thumbnail": "https://i.ytimg.com/vi/rkm2iAzRWEg/hqdefault.jpg",
    "videoId": "rkm2iAzRWEg"
  },
  {
    "id": "suqQUK21y7I",
    "title": "VT Cambe Asfalto 2022   FHD",
    "thumbnail": "https://i.ytimg.com/vi/suqQUK21y7I/hqdefault.jpg",
    "videoId": "suqQUK21y7I"
  },
  {
    "id": "71RbtCip5o4",
    "title": "PAULINHO INSTAGRAM 01   stories",
    "thumbnail": "https://i.ytimg.com/vi/71RbtCip5o4/hqdefault.jpg",
    "videoId": "71RbtCip5o4"
  },
  {
    "id": "Hw7TK1N9qes",
    "title": "Candidato Hariel podcast   educação   legendado",
    "thumbnail": "https://i.ytimg.com/vi/Hw7TK1N9qes/hqdefault.jpg",
    "videoId": "Hw7TK1N9qes"
  },
  {
    "id": "HyYi1TnyZUE",
    "title": "Candidato Djalma comicio",
    "thumbnail": "https://i.ytimg.com/vi/HyYi1TnyZUE/hqdefault.jpg",
    "videoId": "HyYi1TnyZUE"
  },
  {
    "id": "qVracTqcGEo",
    "title": "Candidato Ney reels lancamento campanha 01 08   com legenda",
    "thumbnail": "https://i.ytimg.com/vi/qVracTqcGEo/hqdefault.jpg",
    "videoId": "qVracTqcGEo"
  },
  {
    "id": "vUreveV_b78",
    "title": "POLITICA   PROJETO PROPOSTA MEME   Juninho",
    "thumbnail": "https://i.ytimg.com/vi/vUreveV_b78/hqdefault.jpg",
    "videoId": "vUreveV_b78"
  }
];

export default function App() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [documentaryVideos, setDocumentaryVideos] = useState<VideoItem[]>(FALLBACK_PLAYLIST_VIDEOS);
  const [eventsVideos, setEventsVideos] = useState<VideoItem[]>(FALLBACK_EVENTS_VIDEOS);
  const [reelsVideos, setReelsVideos] = useState<VideoItem[]>(FALLBACK_REELS_VIDEOS);
  const [institutionalVideos, setInstitutionalVideos] = useState<VideoItem[]>(FALLBACK_INSTITUTIONAL_VIDEOS);
  const [politicsVideos, setPoliticsVideos] = useState<VideoItem[]>(FALLBACK_POLITICS_VIDEOS);

  useEffect(() => {
    // Videos are now loaded from the fallback arrays directly
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-zinc-300 selection:bg-sky-500/30">
      <CustomCursor />
      <VideoModal 
        isOpen={!!activeVideo} 
        videoId={activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />

      {/* Section 1: Demoreel */}
      <header className="relative h-[100dvh] w-full overflow-hidden bg-black flex items-center justify-center" data-video-hover="true">
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/ULFBrcmWjH4?autoplay=1&mute=1&loop=1&playlist=ULFBrcmWjH4&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100dvh] min-w-[177.77dvh] -translate-x-1/2 -translate-y-1/2 border-none max-w-none"
            allow="autoplay; encrypted-media"
            allowFullScreen
            tabIndex={-1}
          />
        </div>
        
        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <motion.h1 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.2,
                }
              }
            }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-black text-white mb-4 sm:mb-6 tracking-tighter uppercase leading-[1.1] sm:leading-[0.9] perspective-[1000px]"
          >
            <span className="inline-block">
              {"Produção".split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={{
                    hidden: { opacity: 0, y: 40, rotateX: -40 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                    }
                  }} 
                  className="inline-block origin-bottom"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <br className="hidden sm:block" />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200">
              {"Audiovisual".split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={{
                    hidden: { opacity: 0, y: 40, rotateX: -40 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                    }
                  }} 
                  className="inline-block origin-bottom"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <br className="hidden sm:block" />
            <span className="inline-block">
              {"e Marketing".split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={{
                    hidden: { opacity: 0, y: 40, rotateX: -40 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                    }
                  }} 
                  className="inline-block origin-bottom"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-base sm:text-lg md:text-2xl text-zinc-300 mb-8 sm:mb-12 max-w-3xl font-light tracking-wide px-2"
          >
            Conteúdo estratégia, conteúdo para campanhas políticas, comunicação institucional, TV e presença digital
          </motion.p>
          <motion.a 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
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
          transition={{ delay: 1.8, duration: 1 }}
          href="#sobre"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce z-20"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10" />
        </motion.a>
      </header>

      <main>
        {/* Section 2: Breve descrição */}
      <section id="sobre" className="py-20 sm:py-32 bg-zinc-950 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-5"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white uppercase tracking-tighter leading-tight">
                Especialistas em <br/>
                <span className="text-sky-400">Imagem Pública</span>
              </h2>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="lg:col-span-7 lg:pl-12 border-t border-zinc-800 pt-6 sm:pt-8 lg:border-t-0 lg:border-l lg:pt-0"
            >
              <p className="text-xl sm:text-2xl md:text-3xl text-zinc-400 leading-snug font-light mb-6">
                A <strong className="text-white font-medium">SintagmaMidia</strong> é uma <strong className="text-white font-medium">produtora audiovisual em Londrina</strong> especializada em conteúdo para campanhas políticas, comunicação pública e presença digital.
              </p>
              <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed font-light">
                Desenvolvemos vídeos estratégicos de alta qualidade para televisão, internet e redes sociais, conectando sua mensagem ao público certo com impacto e criatividade.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5: Documentário e Cultura */}
      <CarouselSection 
        id="documentario"
        title="Documentário e Cultura" 
        videos={documentaryVideos} 
        isVertical={false}
        onPlay={setActiveVideo}
      />

      {/* Section: Eventos */}
      <CarouselSection 
        id="eventos"
        title="Eventos" 
        videos={eventsVideos} 
        isVertical={false}
        onPlay={setActiveVideo}
      />

      {/* Section: Geração de conteúdos/reels */}
      <CarouselSection 
        id="reels"
        title="Geração de conteúdos/reels" 
        videos={reelsVideos} 
        isVertical={true}
        onPlay={setActiveVideo}
      />

      {/* Section: Institucional */}
      <CarouselSection 
        id="institucional"
        title="Institucional" 
        videos={institutionalVideos} 
        isVertical={false}
        onPlay={setActiveVideo}
      />

      {/* Section: Políticas contas públicas */}
      <CarouselSection 
        id="politicas"
        title="Políticas contas públicas" 
        videos={politicsVideos} 
        isVertical={false}
        onPlay={setActiveVideo}
      />

      {/* Section 6: Contato */}
      <section id="contato" className="py-20 sm:py-32 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
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
                  <h3 className="text-xs sm:text-sm font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Telefone</h3>
                  <a href="tel:+5543999477677" className="text-white text-2xl sm:text-3xl md:text-4xl font-display font-medium hover:text-sky-400 transition-colors">
                    +55 43 99947-7677
                  </a>
                </div>
                
                <div>
                  <h3 className="text-xs sm:text-sm font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Email</h3>
                  <a href="mailto:sintagmamidia@gmail.com" className="text-white text-xl sm:text-2xl md:text-3xl font-display font-medium hover:text-sky-400 transition-colors break-all">
                    sintagmamidia@gmail.com
                  </a>
                </div>
                
                <div>
                  <h3 className="text-xs sm:text-sm font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Localização</h3>
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
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:pt-4 flex flex-col justify-center space-y-4 sm:space-y-6"
            >
              <a 
                href="https://wa.me/5543999477677?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20SintagmaMidia."
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

              <BriefingForm />
            </motion.div>
            
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-black py-8 sm:py-12 border-t border-zinc-900 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left"
        >
          <div className="text-xl sm:text-2xl font-display font-black text-white tracking-tighter uppercase">
            Sintagma<span className="text-sky-400">Midia</span>
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm font-display uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
