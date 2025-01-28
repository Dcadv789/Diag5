import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Stethoscope, Building2, LineChart } from 'lucide-react';
import Diagnostico from './pages/Diagnostico';
import Backoffice from './pages/Backoffice';
import Resultados from './pages/Resultados';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login';
import UserNavbar from './components/UserNavbar';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';

function App() {
  const { user } = useAuth();
  const { settings } = useSettings();

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <nav className="bg-zinc-900 px-8 py-1">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="w-[240px] pl-8">
              {settings?.navbarLogo ? (
                <img
                  src={settings.navbarLogo}
                  alt="Logo"
                  className="h-14 w-auto object-contain"
                />
              ) : (
                <div className="w-8" />
              )}
            </div>
            <div className="flex-1 flex justify-center space-x-8">
              <NavLink
                to="/diagnostico"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                <Stethoscope size={18} />
                Diagnóstico
              </NavLink>
              <NavLink
                to="/backoffice"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                <Building2 size={18} />
                Backoffice
              </NavLink>
              <NavLink
                to="/resultados"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                <LineChart size={18} />
                Resultados
              </NavLink>
            </div>
            <div className="w-[240px] flex justify-end pr-8">
              <UserNavbar />
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/diagnostico" replace />} />
            <Route path="/diagnostico" element={<Diagnostico />} />
            <Route path="/backoffice" element={<Backoffice />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;