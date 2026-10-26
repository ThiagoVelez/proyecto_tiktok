/**
 * Pantalla 1: Perfil de Usuario y Contenido (Valeria Gomez).
 * Incluye visor interactivo de Historias Destacadas (Stories 24h) y modal para crear nuevas historias.
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Headphones, MapPin, Music2, Video as VideoIcon, 
  Pencil, Share2, TrendingUp, Settings, Plus, Film, Bookmark, 
  Archive, Heart, Lock, Grid, List, Play, ChevronRight, X, 
  ChevronLeft, Send, Sparkles, Upload
} from 'lucide-react';

interface HighlightStory {
  id: string;
  title: string;
  image: string;
  date?: string;
}

interface ProfileVideo {
  id: number;
  title: string;
  views: string;
  likes: string;
  image: string;
  isPinned?: boolean;
  hasAudioNote?: boolean;
}

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reels' | 'saved' | 'drafts' | 'liked'>('reels');
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ProfileVideo | null>(null);

  // Estados del Visor de Historias Destacadas
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  // Estado del Modal para Crear Nueva Historia (+ Nuevo)
  const [showNewStoryModal, setShowNewStoryModal] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryImage, setNewStoryImage] = useState('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600');

  // Historias destacadas del diseno
  const [highlights, setHighlights] = useState<HighlightStory[]>([
    { id: '1', title: "Tokyo '24", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600", date: "Julio 2024" },
    { id: '2', title: "Setup 4.0", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", date: "Agosto 2024" },
    { id: '3', title: "Outfits", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600", date: "Septiembre 2024" },
    { id: '4', title: "Festivales", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600", date: "Octubre 2024" },
  ]);

  // Cuadricula de videos
  const videos: ProfileVideo[] = [
    {
      id: 1,
      title: "Cyberpunk Street Wear 2025",
      views: "2.4M",
      likes: "410K",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600",
      isPinned: true
    },
    {
      id: 2,
      title: "Mi proceso de diseno inmersivo",
      views: "1.2M",
      likes: "180K",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600",
      hasAudioNote: true
    },
    {
      id: 3,
      title: "Morning ritual en Madrid",
      views: "890K",
      likes: "95K",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600"
    },
    {
      id: 4,
      title: "Akihabara a las 3 AM",
      views: "540K",
      likes: "78K",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600"
    },
    {
      id: 5,
      title: "ASMR Custom Keyboard Build",
      views: "520K",
      likes: "63K",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"
    },
    {
      id: 6,
      title: "3 Hacks de luz con el movil",
      views: "450K",
      likes: "42K",
      image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600"
    },
    {
      id: 7,
      title: "Mi nueva camara principal?",
      views: "398K",
      likes: "37K",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
    },
    {
      id: 8,
      title: "Sampleando sonidos del metro",
      views: "312K",
      likes: "29K",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600"
    }
  ];

  // Temporizador para el visor de historias
  useEffect(() => {
    if (activeStoryIndex === null || isStoryPaused) return;

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < highlights.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, isStoryPaused, highlights.length]);

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
    setIsStoryPaused(false);
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
    }
  };

  const handleNextStory = () => {
    if (activeStoryIndex !== null) {
      if (activeStoryIndex < highlights.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
        setStoryProgress(0);
      } else {
        setActiveStoryIndex(null);
      }
    }
  };

  const handleCreateNewStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle.trim()) return;

    const created: HighlightStory = {
      id: Date.now().toString(),
      title: newStoryTitle.trim(),
      image: newStoryImage,
      date: "Hoy"
    };

    setHighlights([...highlights, created]);
    setNewStoryTitle('');
    setShowNewStoryModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0d14] text-white pb-28 pt-4 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      
      {/* SECCION CABECERA DEL PERFIL */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pt-4 pb-8">
        
        {/* AVATAR E INFORMACION DE VALERIA */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 shadow-lg shadow-pink-500/20">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                alt="Valeria Gomez"
                className="w-full h-full rounded-full object-cover border-2 border-[#0c0d14]"
              />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-pink-600 text-[10px] font-bold tracking-wider rounded-full uppercase border border-[#0c0d14] shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              EN VIVO
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Valeria Gomez</h1>
              <CheckCircle className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-purple-900/60 text-purple-300 border border-purple-500/30 rounded-md tracking-wider">
                PRO CREATOR
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">@valeria_creatrix</p>

            <div className="text-xs text-gray-300 space-y-1 pt-1">
              <p className="flex items-center gap-1.5 flex-wrap">
                <span className="text-pink-400 font-bold">#</span>
                <span>Directora de arte & creadora digital</span>
                <span className="text-gray-600">|</span>
                <Headphones className="w-3.5 h-3.5 text-gray-400 inline" />
                <span>Tech & Urban Lifestyle</span>
                <span className="text-gray-600">|</span>
                <span>Collabs: <a href="mailto:valeria@follow.io" className="text-cyan-400 hover:underline">valeria@follow.io</a></span>
                <span className="text-gray-600">|</span>
                <MapPin className="w-3.5 h-3.5 text-rose-400 inline" />
                <span>Madrid / Tokyo</span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-400">
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                <Music2 className="w-3 h-3 text-cyan-400" />
                Sonido original #CyberVibe
              </span>
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                <VideoIcon className="w-3 h-3 text-pink-400" />
                1.4K Shorts creados
              </span>
            </div>
          </div>
        </div>

        {/* CONTADORES (SIGUIENDO, SEGUIDORES, ME GUSTA) */}
        <div className="flex items-center gap-3 bg-[#131522] p-3 rounded-2xl border border-white/5 shadow-inner">
          <div className="text-center px-4">
            <span className="block text-lg font-bold text-white">348</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Siguiendo</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center px-4">
            <span className="block text-lg font-bold text-white">2.4M</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Seguidores</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center px-4">
            <span className="block text-lg font-bold text-white">18.9M</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Me Gusta</span>
          </div>
        </div>

      </div>

      {/* BOTONES DE ACCION */}
      <div className="flex items-center gap-3 pb-8 flex-wrap">
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-pink-500/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Editar perfil</span>
        </button>

        <button 
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171926] hover:bg-[#202334] text-gray-300 hover:text-white text-xs font-semibold border border-white/5 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartir perfil</span>
        </button>

        <button 
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171926] hover:bg-[#202334] text-gray-300 hover:text-white text-xs font-semibold border border-white/5 transition-all"
        >
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>Estadisticas de creador</span>
        </button>

        <button 
          type="button"
          aria-label="Configuracion"
          className="p-2 rounded-xl bg-[#171926] hover:bg-[#202334] text-gray-400 hover:text-white border border-white/5 transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* HISTORIAS DESTACADAS INTERACTIVAS */}
      <div className="pb-8">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300">Historias Destacadas</h2>
          </div>
          <button className="text-xs text-gray-400 hover:text-white flex items-center gap-0.5">
            <span>Ver archivo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-5 overflow-x-auto pb-2 scrollbar-none">
          {highlights.map((h, index) => (
            <div
              key={h.id}
              onClick={() => handleOpenStory(index)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer flex-shrink-0"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500 group-hover:scale-105 transition-transform shadow-md">
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-full h-full rounded-full object-cover border border-[#0c0d14]"
                />
              </div>
              <span className="text-[11px] text-gray-300 group-hover:text-white transition-colors">{h.title}</span>
            </div>
          ))}

          {/* Boton + Nuevo (Abre Modal de Creacion) */}
          <div
            onClick={() => setShowNewStoryModal(true)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer flex-shrink-0"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-dashed border-gray-600 flex items-center justify-center bg-white/5 group-hover:border-pink-500 transition-colors">
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-pink-400" />
            </div>
            <span className="text-[11px] text-gray-400 group-hover:text-white">Nuevo</span>
          </div>
        </div>
      </div>

      {/* PESTANAS DE CONTENIDO */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
        <div className="flex items-center gap-4 sm:gap-8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-2 pb-1 relative transition-colors ${
              activeTab === 'reels' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Reels</span>
            <span className="px-1.5 py-0.2 bg-white/10 text-[10px] rounded-full">84</span>
            {activeTab === 'reels' && (
              <span className="absolute -bottom-3 left-0 w-full h-0.5 bg-pink-500 shadow-sm shadow-pink-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 pb-1 relative transition-colors ${
              activeTab === 'saved' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Guardados</span>
            <span className="px-1.5 py-0.2 bg-white/10 text-[10px] rounded-full">3 colecciones</span>
            {activeTab === 'saved' && (
              <span className="absolute -bottom-3 left-0 w-full h-0.5 bg-pink-500 shadow-sm shadow-pink-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex items-center gap-2 pb-1 relative transition-colors ${
              activeTab === 'drafts' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Borradores</span>
            <span className="px-1.5 py-0.2 bg-pink-600/30 text-pink-300 text-[10px] rounded-full">4 activos</span>
            {activeTab === 'drafts' && (
              <span className="absolute -bottom-3 left-0 w-full h-0.5 bg-pink-500 shadow-sm shadow-pink-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-1.5 pb-1 relative transition-colors ${
              activeTab === 'liked' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Me Gusta</span>
            <Lock className="w-3 h-3 text-gray-500" />
            {activeTab === 'liked' && (
              <span className="absolute -bottom-3 left-0 w-full h-0.5 bg-pink-500 shadow-sm shadow-pink-500"></span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <button className="p-1.5 rounded hover:text-white hover:bg-white/5 transition-colors text-white">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:text-white hover:bg-white/5 transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CUADRICULA DE VIDEOS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {videos.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelectedVideo(v)}
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#131522] border border-white/5 hover:border-pink-500/40 cursor-pointer shadow-lg transition-all hover:scale-[1.02]"
          >
            <img
              src={v.image}
              alt={v.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

            {v.isPinned && (
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-pink-600/90 text-white text-[9px] font-bold tracking-wider flex items-center gap-1 backdrop-blur-sm shadow">
                <span>Fijado</span>
                <span className="text-pink-200">· Perfil de Usuario y Contenido</span>
              </div>
            )}

            {v.hasAudioNote && (
              <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white backdrop-blur-sm">
                <Music2 className="w-3 h-3 text-cyan-400" />
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="text-xs font-semibold line-clamp-2 leading-tight group-hover:text-pink-300 transition-colors">
                {v.title}
              </h3>
              <div className="flex items-center justify-between mt-2 text-[10px] text-gray-300">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3 fill-white text-white" />
                  {v.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  {v.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VISOR MODAL DE HISTORIAS DESTACADAS (STORIES VIEWER) */}
      {activeStoryIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveStoryIndex(null)}
        >
          <div
            className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden bg-[#12131e] border border-white/10 shadow-2xl flex flex-col justify-between p-4"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => setIsStoryPaused(true)}
            onMouseUp={() => setIsStoryPaused(false)}
            onTouchStart={() => setIsStoryPaused(true)}
            onTouchEnd={() => setIsStoryPaused(false)}
          >
            <img
              src={highlights[activeStoryIndex].image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/80 pointer-events-none"></div>

            {/* Barras de Progreso Segmentadas */}
            <div className="relative z-10 flex items-center gap-1.5 w-full pt-1">
              {highlights.map((_, idx) => (
                <div key={idx} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 rounded-full"
                    style={{
                      width:
                        idx < activeStoryIndex
                          ? '100%'
                          : idx === activeStoryIndex
                          ? `${storyProgress}%`
                          : '0%',
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Cabecera de la Historia */}
            <div className="relative z-10 flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt="Valeria Gomez"
                  className="w-9 h-9 rounded-full border border-pink-500 object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">valeria_creatrix</span>
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                  </div>
                  <span className="text-[10px] text-pink-300 font-medium">
                    {highlights[activeStoryIndex].title} • {highlights[activeStoryIndex].date}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryIndex(null)}
                className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Controles de Navegacion Lateral */}
            <button
              onClick={handlePrevStory}
              disabled={activeStoryIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-0 transition-opacity z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextStory}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pie de la Historia */}
            <div className="relative z-10 flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Enviar mensaje a Valeria..."
                className="flex-1 bg-black/50 border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
              <button className="p-2 rounded-full bg-rose-500/30 text-rose-400 border border-rose-500/40">
                <Heart className="w-4 h-4 fill-rose-400" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL PARA CREAR NUEVA HISTORIA DESTACADA (+ NUEVO) */}
      {showNewStoryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowNewStoryModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-[#141524] border border-white/10 shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white">Nueva Historia Destacada</h3>
              </div>
              <button
                onClick={() => setShowNewStoryModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewStory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">Titulo del album / coleccion</label>
                <input
                  type="text"
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  placeholder="Ej: Setup 2026, Tokyo Street, etc."
                  className="w-full bg-[#1b1c2e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-medium block">Foto de portada</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
                    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300',
                    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300'
                  ].map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt=""
                      onClick={() => setNewStoryImage(imgUrl)}
                      className={`aspect-square rounded-xl object-cover cursor-pointer border-2 transition-all ${
                        newStoryImage === imgUrl ? 'border-pink-500 scale-105' : 'border-white/5 opacity-60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewStoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/20"
                >
                  Crear Historia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE PREVISUALIZACION DE VIDEO */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative max-w-sm w-full aspect-[9/16] rounded-2xl overflow-hidden bg-[#12131e] border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white drop-shadow">
              <span className="text-xs font-bold">{selectedVideo.title}</span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-2 py-1 rounded bg-white/20 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
