import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Stethoscope, Building2, LineChart, Trophy } from 'lucide-react';
import Diagnostico from './pages/Diagnostico';
import Backoffice from './pages/Backoffice';
import Resultados from './pages/Resultados';
import Ranking from './pages/Ranking';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <nav className="bg-zinc-900 px-4 py-3">
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="flex space-x-8">
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
              <NavLink
                to="/ranking"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                <Trophy size={18} />
                Ranking
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Diagnostico />} />
            <Route path="/diagnostico" element={<Diagnostico />} />
            <Route path="/backoffice" element={<Backoffice />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/ranking" element={<Ranking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;