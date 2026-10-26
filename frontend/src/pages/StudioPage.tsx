/**
 * Pantalla 5: Estudio de Publicación y Edición Avanzada (Creator Studio V2.4).
 * Replicación exacta del diseño de Stitch con editor de video interactivo,
 * gestión de metadatos, miniaturas, privacidad y llamada al backend FastAPI.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Pause, Maximize2, Radio, Music, Wand2, Type, 
  Smile, Gauge, Scissors, Cloud, Upload, Globe, 
  Users, Lock, X, Check, ArrowRight, Sparkles, MessageSquare, 
  Share2, Download, Film, Sliders
} from 'lucide-react';
import { publishVideo } from '../services/api';

export const StudioPage: React.FC = () => {
  const navigate = useNavigate();

  // Estados del Formulario
  const [title, setTitle] = useState('Mi nuevo setup nocturno 2025 ✨');
  const [description, setDescription] = useState(
    'Armé por fin el espacio de trabajo definitivo para diseño, código y streaming de madrugada. Todos los periféricos sincronizados con el ecosistema Follow y paleta cyberpunk. Déjame en comentarios qué gadget te gustó más.'
  );
  const [selectedFilter, setSelectedFilter] = useState('Neo Glow');
  const [tags, setTags] = useState<string[]>(['follow', 'tech', 'setup', 'creator', 'viral', 'aesthetic']);
  const [collaborators, setCollaborators] = useState<string[]>(['@alex_neon', '@cyberluna']);
  const [newCollabInput, setNewCollabInput] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [allowDownloads, setAllowDownloads] = useState(false);

  // Estados del reproductor en vivo
  const [isPlaying, setIsPlaying] = useState(false);
  const [clipVolume, setClipVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(75);
  const [isPublishing, setIsPublishing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Miniaturas del diseño
  const thumbnails = [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300'
  ];

  const handleAddTag = (t: string) => {
    if (!tags.includes(t)) {
      setTags([...tags, t]);
      setDescription((prev) => `${prev} #${t}`);
    }
  };

  const handleRemoveCollaborator = (c: string) => {
    setCollaborators(collaborators.filter(item => item !== c));
  };

  const handleAddCollaborator = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCollabInput.trim()) {
      e.preventDefault();
      const formatted = newCollabInput.startsWith('@') ? newCollabInput.trim() : `@${newCollabInput.trim()}`;
      if (!collaborators.includes(formatted)) {
        setCollaborators([...collaborators, formatted]);
      }
      setNewCollabInput('');
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setFeedbackMsg('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('visibility', visibility);
      formData.append('allow_comments', String(allowComments));
      formData.append('allow_duet', String(allowDuet));

      const res = await publishVideo(formData);
      if (res.success) {
        setFeedbackMsg('Publicación exitosa. Redirigiendo al perfil...');
        setTimeout(() => navigate('/perfil'), 1500);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setFeedbackMsg(`Error: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d14] text-white pb-28 pt-4 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-6">
      
      {/* CABECERA: TÍTULO DEL ESTUDIO Y STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-pink-400 uppercase block">
            • CREATOR STUDIO V2.4 • EDICIÓN AVANZADA
          </span>
          <div className="flex items-center gap-3 pt-0.5">
            <h1 className="text-2xl font-black tracking-tight text-white font-sans">
              Estudio de Publicación
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-purple-900/50 text-purple-300 border border-purple-500/30 text-[10px] font-bold tracking-wider">
              4K HDR READY
            </span>
          </div>
        </div>

        {/* Indicador de Autoguardado */}
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#141524] px-3.5 py-1.5 rounded-full border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Borrador autoguardado a las 02:41 AM</span>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-pink-500/40 text-xs font-semibold text-white">
          {feedbackMsg}
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL: 2 COLUMNAS (PREVISUALIZACIÓN Y DETALLES) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA (5 COLUMNAS): PREVIEW DEL VIDEO Y CONTROLES DE EDICIÓN */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Smart Container de Video Vertical */}
          <div className="relative aspect-[9/16] w-full max-w-[380px] mx-auto rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-between p-4">
            
            {/* Imagen simulada del video en edición */}
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800"
              alt="Setup de trabajo"
              className={`absolute inset-0 w-full h-full object-cover ${
                selectedFilter === 'Neo Glow' ? 'contrast-125 saturate-125' : ''
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

            {/* Cabecera interna: REC timer y Expand */}
            <div className="relative z-10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono border border-white/10">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>REC • 00:32 / 00:45</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Píldora de Audio insertado */}
            <div className="relative z-10 self-center bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 text-xs text-cyan-300">
              <Music className="w-3.5 h-3.5 text-pink-400" />
              <span className="truncate max-w-[200px] text-[11px]">Midnight Synthwave • Neon Drift (Original M...</span>
            </div>

            {/* Botón Central Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-xl"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
            </button>

            {/* Paleta vertical de herramientas a la derecha del video */}
            <div className="absolute right-3 top-24 z-10 flex flex-col items-center gap-3 bg-black/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-white">
              <button className="p-2 rounded-xl hover:bg-white/10 flex flex-col items-center gap-0.5">
                <Music className="w-4 h-4 text-cyan-400" />
                <span className="text-[8px] font-bold">Audio</span>
              </button>
              <button className="p-2 rounded-xl hover:bg-white/10 flex flex-col items-center gap-0.5">
                <Wand2 className="w-4 h-4 text-pink-400" />
                <span className="text-[8px] font-bold">Filtros</span>
              </button>
              <button className="p-2 rounded-xl hover:bg-white/10 flex flex-col items-center gap-0.5">
                <Type className="w-4 h-4 text-purple-400" />
                <span className="text-[8px] font-bold">Texto</span>
              </button>
              <button className="p-2 rounded-xl hover:bg-white/10 flex flex-col items-center gap-0.5">
                <Smile className="w-4 h-4 text-amber-400" />
                <span className="text-[8px] font-bold">Stickers</span>
              </button>
              <button className="p-2 rounded-xl hover:bg-white/10 flex flex-col items-center gap-0.5">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span className="text-[8px] font-bold">1.0x</span>
              </button>
              <button className="p-2 rounded-xl hover:bg-white/10 flex flex-col items-center gap-0.5">
                <Scissors className="w-4 h-4 text-rose-400" />
                <span className="text-[8px] font-bold">Split</span>
              </button>
            </div>

            {/* Texto de subtítulo overlay */}
            <div className="relative z-10 text-center pb-2">
              <span className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-lg">
                "Este es el mejor ángulo para programar..."
              </span>
            </div>

          </div>

          {/* Filtros Rápidos */}
          <div className="space-y-2">
            <span className="text-xs text-gray-400 font-medium">Filtros rápidos aplicados:</span>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {['Neo Glow', 'Cyber Cyan', 'Vintage 90s', '4K Crisp Enhance'].map((filterName) => (
                <button
                  key={filterName}
                  onClick={() => setSelectedFilter(filterName)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                    selectedFilter === filterName
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-500/25'
                      : 'bg-[#151624] text-gray-300 hover:text-white border border-white/5'
                  }`}
                >
                  {selectedFilter === filterName && '• '}
                  {filterName}
                </button>
              ))}
            </div>
          </div>

          {/* Línea de Tiempo / Scrubber de Corte */}
          <div className="p-4 rounded-3xl bg-[#141524] border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300 font-mono">Puntos de corte: [00:03.20 - 00:35.80]</span>
              <span className="text-pink-400 font-mono font-bold">Duración: 32.6s</span>
            </div>

            {/* Timeline track interactivo */}
            <div className="relative h-10 rounded-xl bg-[#0e0f19] border border-white/10 flex items-center px-4 overflow-hidden">
              <div className="absolute left-6 right-8 h-full bg-pink-500/20 border-y border-pink-500/50"></div>
              <div className="absolute left-6 w-2 h-full bg-pink-500 cursor-ew-resize rounded-l"></div>
              <div className="absolute right-8 w-2 h-full bg-pink-500 cursor-ew-resize rounded-r"></div>
              <div className="w-full flex items-center justify-between opacity-30 text-[9px] font-mono">
                <span>00:00</span>
                <span>00:15</span>
                <span>00:30</span>
                <span>00:45</span>
              </div>
            </div>

            {/* Controles de Balance de Audio */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>Volumen clip: {clipVolume}%</span>
              <span>Música: {musicVolume}%</span>
              <button className="text-cyan-400 hover:underline flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Mezclador de audio</span>
              </button>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA (7 COLUMNAS): DETALLES, METADATOS Y PUBLICACIÓN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TARJETA 1: DETALLES DEL CONTENIDO */}
          <div className="p-6 rounded-3xl bg-[#141524] border border-white/5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-cyan-400" />
                <span>Detalles del Contenido</span>
              </h2>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full">
                Paso 2 de 2
              </span>
            </div>

            {/* Título del video */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-gray-300 font-semibold">Título del video</label>
                <span className="text-[10px] text-gray-500 font-mono">{title.length} / 100</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full bg-[#1b1c2e] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50"
              />
            </div>

            {/* Descripción detallada */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-gray-300 font-semibold">Descripción detallada</label>
                <span className="text-[10px] text-gray-500 font-mono">{description.length} / 2200</span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2200}
                className="w-full bg-[#1b1c2e] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 leading-relaxed resize-none"
              />
            </div>

            {/* Hashtags sugeridos */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium block">
                # Hashtags inteligentes sugeridos (clic para insertar)
              </label>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {['follow', 'tech', 'setup', 'creator', 'viral', 'aesthetic'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="px-3 py-1 rounded-xl bg-[#1b1c2e] hover:bg-pink-600/30 text-gray-300 hover:text-pink-300 border border-white/5 transition-colors font-mono text-[11px]"
                  >
                    #{tag}
                  </button>
                ))}
                <button className="px-3 py-1 rounded-xl border border-dashed border-gray-600 text-gray-400 hover:text-white text-[11px]">
                  + Nuevo tag
                </button>
              </div>
            </div>

            {/* Colaboradores / Menciones */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium block">
                Mencionar Creadores • Colaboradores
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {collaborators.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-900/40 text-purple-200 border border-purple-500/30 text-xs font-semibold"
                  >
                    <span>{c}</span>
                    <button onClick={() => handleRemoveCollaborator(c)} className="hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newCollabInput}
                  onChange={(e) => setNewCollabInput(e.target.value)}
                  onKeyDown={handleAddCollaborator}
                  placeholder="Escribe @usuario para invitar..."
                  className="flex-1 min-w-[200px] bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none py-1"
                />
              </div>
            </div>

          </div>

          {/* TARJETA 2: PORTADA & MINIATURA */}
          <div className="p-6 rounded-3xl bg-[#141524] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Portada & Miniatura</h3>
                <p className="text-[11px] text-gray-400">
                  Selecciona el fotograma clave que cautivará en el feed de Explorar
                </p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b1c2e] hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-pink-400" />
                <span>Subir propia</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {thumbnails.map((thumbUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedThumbnail(idx)}
                  className={`relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedThumbnail === idx
                      ? 'border-pink-500 shadow-lg shadow-pink-500/20'
                      : 'border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                  {selectedThumbnail === idx && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-pink-600 text-[9px] font-bold uppercase tracking-wider text-white">
                      Activa
                    </span>
                  )}
                  {idx === 2 && (
                    <span className="absolute bottom-1.5 right-1.5 px-1 py-0.5 rounded bg-black/70 text-[8px] font-mono text-gray-300">
                      00:22
                    </span>
                  )}
                </div>
              ))}

              <div className="aspect-[9/16] rounded-2xl border border-dashed border-gray-600 flex flex-col items-center justify-center p-2 text-center text-gray-400 hover:border-pink-500 cursor-pointer transition-colors">
                <Scissors className="w-5 h-5 text-gray-500 mb-1" />
                <span className="text-[9px] font-medium leading-tight">Elegir otro fotograma</span>
              </div>
            </div>
          </div>

          {/* TARJETA 3: PRIVACIDAD Y OPCIONES DE AUDIENCIA */}
          <div className="p-6 rounded-3xl bg-[#141524] border border-white/5 space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Privacidad y Opciones de Audiencia
            </h3>

            {/* Selector Segmentado de Audiencia */}
            <div className="space-y-2">
              <span className="text-xs text-gray-300 font-semibold block">Quién puede ver este video</span>
              <p className="text-[11px] text-gray-500 -mt-1">
                Controla la distribución en feeds globales y algoritmos
              </p>
              <div className="grid grid-cols-3 p-1 bg-[#1b1c2e] rounded-2xl border border-white/5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    visibility === 'public' ? 'bg-[#292c45] text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Público</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('friends')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    visibility === 'friends' ? 'bg-[#292c45] text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-pink-400" />
                  <span>Amigos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    visibility === 'private' ? 'bg-[#292c45] text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Solo yo</span>
                </button>
              </div>
            </div>

            {/* Switches de interacción */}
            <div className="space-y-3 pt-2">
              {/* Permitir comentarios */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Permitir comentarios</span>
                  <span className="text-[11px] text-gray-400">Tus seguidores podrán debatir en tu publicación</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowComments(!allowComments)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    allowComments ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    allowComments ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {/* Permitir Dúos y Remix */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Permitir Dúos y Remix (Pegar)</span>
                  <span className="text-[11px] text-gray-400">Impulsa tu alcance permitiendo reacciones a tu clip</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowDuet(!allowDuet)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    allowDuet ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    allowDuet ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {/* Permitir descargas del video */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Permitir descargas del video</span>
                  <span className="text-[11px] text-gray-400">Los espectadores podrán guardar el video con marca de agua</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowDownloads(!allowDownloads)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    allowDownloads ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    allowDownloads ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>

          </div>

          {/* BARRA INFERIOR DE ACCIONES */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-2xl bg-[#1b1c2e] hover:bg-[#252740] text-gray-300 text-xs font-bold transition-all"
            >
              Cancelar
            </button>

            <button
              onClick={() => setFeedbackMsg('Borrador guardado localmente.')}
              className="px-6 py-3 rounded-2xl bg-[#1b1c2e] hover:bg-[#252740] text-gray-300 text-xs font-bold transition-all"
            >
              Guardar en borrador
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white text-xs font-bold shadow-xl shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPublishing ? 'Publicando...' : 'Publicar Video'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
