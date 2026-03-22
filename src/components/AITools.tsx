import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { Upload, Image as ImageIcon, Video, Wand2, Loader2, Key } from 'lucide-react';

export default function AITools() {
  const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(false);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoImage, setVideoImage] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState('');

  // Image State
  const [imagePrompt, setImagePrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const checkApiKey = async () => {
    setIsCheckingKey(true);
    try {
      // @ts-ignore
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setApiKeySelected(true);
      } else {
        // @ts-ignore
        if (window.aistudio) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
          setApiKeySelected(true);
        }
      }
    } catch (error) {
      console.error("Error checking API key:", error);
      // Reset state if error occurs (e.g. "Requested entity was not found")
      setApiKeySelected(false);
      // @ts-ignore
      if (window.aistudio) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setApiKeySelected(true);
      }
    } finally {
      setIsCheckingKey(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateVideo = async () => {
    if (!videoImage && !videoPrompt) return;
    
    await checkApiKey();
    if (!apiKeySelected && !process.env.API_KEY) return;

    setIsGeneratingVideo(true);
    setVideoStatus('Iniciando geração...');
    setGeneratedVideoUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      let operationParams: any = {
        model: 'veo-3.1-fast-generate-preview',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: videoAspectRatio
        }
      };

      if (videoPrompt) {
        operationParams.prompt = videoPrompt;
      }

      if (videoImage) {
        // Extract base64 data and mime type
        const match = videoImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (match) {
          operationParams.image = {
            mimeType: match[1],
            imageBytes: match[2]
          };
        }
      }

      let operation = await ai.models.generateVideos(operationParams);

      setVideoStatus('Processando vídeo (isso pode levar alguns minutos)...');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (downloadLink) {
        // Fetch the video with the API key header
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.API_KEY || '',
          },
        });
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedVideoUrl(url);
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setVideoStatus('Erro ao gerar vídeo. Tente novamente.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt) return;

    await checkApiKey();
    if (!apiKeySelected && !process.env.API_KEY) return;

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const parts: any[] = [];
      
      if (referenceImage) {
        const match = referenceImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }
      
      parts.push({ text: imagePrompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
          setGeneratedImageUrl(imageUrl);
          break;
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <section id="ai-tools" className="py-20 sm:py-32 bg-zinc-950 border-t border-zinc-900 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tighter mb-4">
            Sintagma <span className="text-sky-400">AI</span>
          </h2>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto font-light">
            Experimente o futuro da produção audiovisual. Crie vídeos e imagens cinematográficas usando inteligência artificial avançada.
          </p>
        </motion.div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-4 sm:py-6 px-4 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wider transition-colors ${activeTab === 'video' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              <Video className="w-5 h-5" />
              <span className="hidden sm:inline">Gerador de Vídeo (Veo)</span>
              <span className="sm:hidden">Vídeo</span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-4 sm:py-6 px-4 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wider transition-colors ${activeTab === 'image' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              <ImageIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Estúdio de Imagem</span>
              <span className="sm:hidden">Imagem</span>
            </button>
          </div>

          <div className="p-6 sm:p-10">
            {!apiKeySelected && (
              <div className="mb-8 p-6 bg-sky-950/30 border border-sky-900/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sky-200">
                  <Key className="w-8 h-8 flex-shrink-0 text-sky-400" />
                  <div>
                    <h4 className="font-display font-bold uppercase tracking-wider mb-1">Chave de API Necessária</h4>
                    <p className="text-sm text-sky-300/80">Para usar os modelos avançados Veo e Imagen, você precisa selecionar sua chave de API do Google Cloud.</p>
                  </div>
                </div>
                <button 
                  onClick={checkApiKey}
                  disabled={isCheckingKey}
                  className="whitespace-nowrap bg-sky-500 hover:bg-sky-400 text-black font-display font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCheckingKey ? 'Verificando...' : 'Configurar API Key'}
                </button>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Imagem Inicial (Opcional)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${videoImage ? 'border-sky-500/50 bg-black' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950'}`}
                    >
                      {videoImage ? (
                        <>
                          <img src={videoImage} alt="Reference" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-display font-bold uppercase tracking-wider">Trocar Imagem</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-zinc-500 mb-3" />
                          <span className="text-zinc-400 font-display text-sm">Clique para fazer upload</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFileUpload(e, setVideoImage)} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Prompt (Opcional se tiver imagem)</label>
                    <textarea 
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Ex: Um gato holográfico neon correndo em alta velocidade..."
                      className="w-full bg-black border border-zinc-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-sky-500 transition-colors font-display min-h-[100px] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Formato</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setVideoAspectRatio('16:9')}
                        className={`flex-1 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-sm transition-colors border ${videoAspectRatio === '16:9' ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                      >
                        16:9 (Paisagem)
                      </button>
                      <button 
                        onClick={() => setVideoAspectRatio('9:16')}
                        className={`flex-1 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-sm transition-colors border ${videoAspectRatio === '9:16' ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                      >
                        9:16 (Retrato)
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={generateVideo}
                    disabled={isGeneratingVideo || (!videoImage && !videoPrompt)}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-display font-bold uppercase tracking-wider py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Gerar Vídeo
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-black rounded-xl border border-zinc-800 flex flex-col items-center justify-center overflow-hidden min-h-[300px] relative">
                  {isGeneratingVideo ? (
                    <div className="text-center p-6">
                      <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
                      <p className="text-sky-400 font-display font-bold uppercase tracking-wider animate-pulse">{videoStatus}</p>
                    </div>
                  ) : generatedVideoUrl ? (
                    <video 
                      src={generatedVideoUrl} 
                      controls 
                      autoPlay 
                      loop 
                      className={`w-full h-full object-contain ${videoAspectRatio === '9:16' ? 'max-h-[600px]' : ''}`}
                    />
                  ) : (
                    <div className="text-center p-6 text-zinc-600">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-display uppercase tracking-widest text-sm">O vídeo gerado aparecerá aqui</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'image' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Prompt (Obrigatório)</label>
                    <textarea 
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Ex: Uma câmera de cinema em um set de filmagem cyberpunk, iluminação dramática..."
                      className="w-full bg-black border border-zinc-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-sky-500 transition-colors font-display min-h-[120px] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold text-zinc-500 uppercase tracking-widest mb-2">Imagem de Referência (Opcional - Para Edição)</label>
                    <div 
                      onClick={() => imageFileInputRef.current?.click()}
                      className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${referenceImage ? 'border-sky-500/50 bg-black' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950'}`}
                    >
                      {referenceImage ? (
                        <>
                          <img src={referenceImage} alt="Reference" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-display font-bold uppercase tracking-wider text-sm">Trocar Imagem</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                          <span className="text-zinc-400 font-display text-xs">Upload de imagem base</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={imageFileInputRef} 
                        onChange={(e) => handleFileUpload(e, setReferenceImage)} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={generateImage}
                    disabled={isGeneratingImage || !imagePrompt}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-display font-bold uppercase tracking-wider py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Gerar Imagem
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-black rounded-xl border border-zinc-800 flex flex-col items-center justify-center overflow-hidden min-h-[300px] aspect-video relative">
                  {isGeneratingImage ? (
                    <div className="text-center p-6">
                      <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
                      <p className="text-sky-400 font-display font-bold uppercase tracking-wider animate-pulse">Criando imagem...</p>
                    </div>
                  ) : generatedImageUrl ? (
                    <img 
                      src={generatedImageUrl} 
                      alt="Generated" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-6 text-zinc-600">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-display uppercase tracking-widest text-sm">A imagem gerada aparecerá aqui</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
