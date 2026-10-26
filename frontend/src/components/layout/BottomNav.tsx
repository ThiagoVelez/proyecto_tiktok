/**
 * Barra de Navegacion Flotante Inferior de Follow (Mobile / Floating Dock).
 * Conexiones completas a Para Ti (/), Explorar (/explorar), Crear (/estudio), Actividad (/actividad) y Perfil (/perfil).
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, Heart, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <nav className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-[#181926]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80">
        
        {/* Para ti */}
        <Link
          to="/"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all ${
            isCurrent('/')
              ? 'text-white bg-white/10 font-medium'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[11px]">Para ti</span>
        </Link>

        {/* Explorar */}
        <Link
          to="/explorar"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all ${
            isCurrent('/explorar')
              ? 'text-white bg-white/10 font-medium'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[11px]">Explorar</span>
        </Link>

        {/* Boton Central + Crear */}
        <Link
          to="/estudio"
          aria-label="Crear publicacion"
          className="mx-1 w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 hover:scale-110 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </Link>

        {/* Actividad */}
        <Link
          to="/actividad"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all ${
            isCurrent('/actividad')
              ? 'text-white bg-white/10 font-medium'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isCurrent('/actividad') ? 'fill-pink-500 text-pink-500' : ''}`} />
          <span className="text-[11px]">Actividad</span>
        </Link>

        {/* Perfil */}
        <Link
          to="/perfil"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all ${
            isCurrent('/perfil')
              ? 'text-white bg-white/10 font-medium'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[11px]">Perfil</span>
        </Link>

      </nav>
    </div>
  );
};
