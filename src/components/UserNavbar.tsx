import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
          {user?.email?.[0].toUpperCase() || 'U'}
        </div>
        <div className="text-left">
          <p className="text-white text-sm font-medium line-clamp-1">
            {user?.email?.split('@')[0] || 'Usuário'}
          </p>
          <p className="text-gray-400 text-xs line-clamp-1">
            {user?.email || 'usuario@email.com'}
          </p>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-1 z-20">
            <button
              onClick={() => {
                navigate('/configuracoes');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 flex items-center gap-2"
            >
              <Settings size={16} />
              Configurações
            </button>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserNavbar;