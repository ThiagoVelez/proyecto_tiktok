/**
 * Modal Unificado de Reproduccion de Video (Estilo TikTok / Reels).
 * Soporta reproduccion con autoplay, control de volumen, likes interactivos,
 * guardado en coleccion, compartir con toast, navegacion anterior/siguiente
 * con teclado y tactil, y contraste optimizado.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Volume2, VolumeX, X, Heart, MessageSquare, 
  Bookmark, Share2, Music2, CheckCircle, ChevronLeft, 
  ChevronRight, Check, Plus 
} from 'lucide-react';

export interface VideoModalItem {
  id: string | number;
  title: string;
  author: string;
  authorAvatar: string;
  views?: string;
  likes?: string;
  image: string;
  videoUrl: string;
  description?: string;
  tags?: string[];
  soundTitle?: string;
}

interface VideoModalProps {
  video: VideoModalItem | null;
  videosList?: VideoModalItem[];
  onClose: () => void;
  onSelectVideo?: (video: VideoModalItem) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  videosList = [],
  onClose,
  onSelectVideo,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Reiniciar estado al cambiar de video
  useEffect(() => {
    if (video) {
      setIsPlaying(true);
      setProgress(0);
      setIsLiked(false);
      setIsBookmarked(false);
      setIsFollowing(false);
    }
  }, [video?.id]);

  // Manejo de eventos de teclado (Escape y flechas de navegacion)
  useEffect(() => {
    if (!video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && videosList.length > 0 && onSelectVideo) {
        const currentIndex = videosList.findIndex((v) => v.id === video.id);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % videosList.length;
          onSelectVideo(videosList[nextIndex]);
        }
      } else if (e.key === 'ArrowLeft' && videosList.length > 0 && onSelectVideo) {
        const currentIndex = videosList.findIndex((v) => v.id === video.id);
        if (currentIndex !== -1) {
          const prevIndex = (currentIndex - 1 + videosList.length) % videosList.length;
          onSelectVideo(videosList[prevIndex]);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [video, videosList, onSelectVideo, onClose]);

  // Prevenir scroll de fondo mientras el visor esta abierto
  useEffect(() => {
    if (video) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [video]);

  if (!video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || !onSelectVideo || videosList.length === 0) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const currentIndex = videosList.findIndex((v) => v.id === video.id);
      if (currentIndex !== -1) {
        if (diffX > 0) {
          // Deslizar izquierda -> siguiente
          const nextIndex = (currentIndex + 1) % videosList.length;
          onSelectVideo(videosList[nextIndex]);
        } else {
          // Deslizar derecha -> anterior
          const prevIndex = (currentIndex - 1 + videosList.length) % videosList.length;
          onSelectVideo(videosList[prevIndex]);
        }
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const currentIndex = videosList.findIndex((v) => v.id === video.id);
  const hasNavigation = videosList.length > 1 && onSelectVideo;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Botones de navegacion lateral en escritorio */}
      {hasNavigation && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const prevIndex = (currentIndex - 1 + videosList.length) % videosList.length;
              onSelectVideo(videosList[prevIndex]);
            }}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 z-20 shadow-xl hover:scale-105"
            title="Video anterior (Flecha izquierda)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextIndex = (currentIndex + 1) % videosList.length;
              onSelectVideo(videosList[nextIndex]);
            }}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 z-20 shadow-xl hover:scale-105"
            title="Siguiente video (Flecha derecha)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Contenedor principal del reproductor vertical 9:16 */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative max-w-sm w-full aspect-[9/16] h-[calc(100dvh-5rem)] max-h-[88dvh] rounded-2xl sm:rounded-[28px] overflow-hidden bg-black border border-white/15 shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video con fallback a poster */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.image}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={() => {
            if (videoRef.current && videoRef.current.duration) {
              const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
              setProgress(pct);
            }
          }}
        />

        {/* Icono de pausa flotante */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 cursor-pointer pointer-events-auto"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Gradientes cinematograficos */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/30 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10"></div>

        {/* Cabecera superior anclada */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider text-white border border-white/10 uppercase">
              4K HDR · Follow
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/10 flex items-center gap-1.5 px-2.5 text-[10px] font-medium"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-pink-400" />
                  <span>Silenciado</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sonido activo</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-gray-300 hover:text-white hover:bg-black/80 transition-all border border-white/10"
            title="Cerrar visor (Escape)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra lateral de acciones sociales (derecha) */}
        <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-3">
          {/* Avatar del creador */}
          <div className="relative mb-1">
            <img
              src={video.authorAvatar}
              alt={video.author}
              className="w-10 h-10 rounded-full object-cover border-2 border-pink-500 shadow-md"
            />
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow ${
                isFollowing ? 'bg-cyan-500 text-black' : 'bg-pink-600 text-white'
              }`}
            >
              {isFollowing ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
            </button>
          </div>

          {/* Me Gusta */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div
              className={`p-2.5 rounded-full backdrop-blur-md border transition-transform group-hover:scale-110 ${
                isLiked
                  ? 'bg-rose-500/30 text-rose-400 border-rose-500/40'
                  : 'bg-black/50 text-white border-white/10 hover:bg-black/70'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
            </div>
            <span className="text-[10px] font-bold text-white shadow-sm">
              {isLiked ? '420K' : video.likes || '180K'}
            </span>
          </button>

          {/* Comentarios */}
          <button className="flex flex-col items-center gap-0.5 group">
            <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-black/70 transition-transform group-hover:scale-110">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-white shadow-sm">1.8K</span>
          </button>

          {/* Guardar en coleccion */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div
              className={`p-2.5 rounded-full backdrop-blur-md border transition-transform group-hover:scale-110 ${
                isBookmarked
                  ? 'bg-yellow-500/30 text-yellow-400 border-yellow-500/40'
                  : 'bg-black/50 text-white border-white/10 hover:bg-black/70'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </div>
            <span className="text-[10px] font-bold text-white shadow-sm">Guardar</span>
          </button>

          {/* Compartir */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-black/70 transition-transform group-hover:scale-110">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-white shadow-sm">
              {copiedLink ? 'Copiado' : 'Compartir'}
            </span>
          </button>

          {/* Disco de musica girando */}
          <div className="w-8 h-8 rounded-full bg-black/80 border border-white/20 p-1 flex items-center justify-center animate-spin-slow">
            <Music2 className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        {/* Informacion del video anclada en la parte inferior */}
        <div className="absolute left-0 bottom-2.5 right-16 z-20 p-4 space-y-1.5 select-text pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="text-xs font-bold text-white drop-shadow">{video.author}</span>
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
            <span className="text-[9px] font-semibold text-gray-300 drop-shadow">· En tendencia</span>
          </div>

          <h3 className="text-xs font-bold text-white line-clamp-1 drop-shadow pointer-events-auto">
            {video.title}
          </h3>

          {video.description && (
            <p className="text-[11px] text-gray-200 line-clamp-2 leading-relaxed drop-shadow pointer-events-auto">
              {video.description}
            </p>
          )}

          {video.tags && video.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-0.5 pointer-events-auto">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold text-pink-400 hover:underline cursor-pointer drop-shadow"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-gray-200 pt-0.5 drop-shadow pointer-events-auto">
            <Music2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse flex-shrink-0" />
            <span className="truncate">{video.soundTitle || 'Original Sound - Follow Studio'}</span>
          </div>
        </div>

        {/* Barra de progreso inferior */}
        <div className="absolute bottom-0 inset-x-0 z-30 w-full h-1 bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
