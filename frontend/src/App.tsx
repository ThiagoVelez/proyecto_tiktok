/**
 * Enrutador Principal de la Aplicación Follow.
 * Arquitectura SPA con React Router v6.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { FeedPage } from './pages/FeedPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import { StudioPage } from './pages/StudioPage';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';

  return (
    <div className="min-h-screen bg-[#0c0d14] text-white flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {!isAuthPage && <Navbar />}

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/estudio" element={<StudioPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/registro" element={<AuthPage />} />
        </Routes>
      </main>

      {!isAuthPage && <BottomNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
