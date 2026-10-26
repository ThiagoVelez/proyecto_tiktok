/**
 * Barra de Navegación Principal Superior de Follow.
 * Implementación 100% fiel al diseño de Stitch.
 * Cumple con la directiva de iconos Lucide y cero emojis.
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Send, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explorar');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c0d14]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* LOGO Y ENLACES PRINCIPALES */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Isotipo Follow con gradiente */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">Follow</span>
          </Link>

          {/* Menú de Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-white ${
                isActive('/') ? 'text-white font-semibold' : 'text-gray-400'
              }`}
            >
              Feed
            </Link>
            <Link
              to="/explorar"
              className={`transition-colors hover:text-white ${
                isActive('/explorar') ? 'text-white font-semibold' : 'text-gray-400'
              }`}
            >
              Explorar
            </Link>
            <Link
              to="/explorar?tab=tendencias"
              className={`transition-colors hover:text-white ${
                location.search.includes('tendencias') ? 'text-white font-semibold' : 'text-gray-400'
              }`}
            >
              Tendencias
            </Link>
            <Link
              to="/explorar?tab=en-vivo"
              className={`transition-colors hover:text-white ${
                location.search.includes('en-vivo') ? 'text-white font-semibold' : 'text-gray-400'
              }`}
            >
              En Vivo
            </Link>
          </nav>
        </div>

        {/* BARRA DE BÚSQUEDA CENTRAL */}
        <div className="flex-1 max-w-md hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar creadores, sonidos y hashtags..."
              className="w-full bg-[#181a27] border border-white/5 rounded-full pl-10 pr-10 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[10px] text-gray-400 bg-white/5 rounded border border-white/10 font-mono">
                /
              </kbd>
            </div>
          </form>
        </div>

        {/* ACCIONES Y PERFIL DE USUARIO */}
        <div className="flex items-center gap-3">
          {/* Botón + Crear */}
          <Link
            to="/estudio"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear</span>
          </Link>

          {/* Mensajes Directos */}
          <button
            type="button"
            aria-label="Mensajes directos"
            className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors relative"
          >
            <Send className="w-4 h-4" />
          </button>

          {/* Notificaciones */}
          <button
            type="button"
            aria-label="Notificaciones"
            className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#0c0d14]"></span>
          </button>

          {/* Avatar del usuario / Enlace a perfil */}
          <Link
            to="/perfil"
            className="relative flex items-center justify-center p-0.5 rounded-full ring-2 ring-pink-500/40 hover:ring-pink-500 transition-all ml-1"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt="Valeria Gómez"
              className="w-7 h-7 rounded-full object-cover"
            />
          </Link>
        </div>

      </div>
    </header>
  );
};
