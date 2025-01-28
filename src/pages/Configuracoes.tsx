import React, { useState, useEffect } from 'react';
import { Settings, User, Shield, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStorage } from '../hooks/useStorage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

interface UserProfile {
  fullName: string;
  phone: string;
  position: string;
  photoURL: string;
}

function Configuracoes() {
  const { user } = useAuth();
  const { uploadFile } = useStorage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    phone: '',
    position: '',
    photoURL: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (user) {
      loadUserProfile();
      setNewEmail(user.email || '');
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);
      const path = `profile-photos/${user.uid}/${file.name}`;
      const photoURL = await uploadFile(file, path);
      
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        photoURL
      }, { merge: true });

      setProfile(prev => ({ ...prev, photoURL }));
      setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar foto.' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar senha. Verifique sua senha atual.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      
      setMessage({ type: 'success', text: 'E-mail atualizado com sucesso!' });
      setCurrentPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar e-mail. Verifique sua senha atual.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-zinc-900 rounded-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-3">Configurações</h1>
        <p className="text-gray-400">Gerencie suas preferências e configurações do sistema.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <User size={24} className="text-blue-500" />
            <h2 className="text-2xl font-semibold text-white">Perfil</h2>
          </div>
          
          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-zinc-800 overflow-hidden">
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-zinc-600" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={20} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Clique no ícone da câmera para alterar
              </p>
            </div>

            <form onSubmit={handleProfileUpdate} className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cargo
                </label>
                <input
                  type="text"
                  value={profile.position}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700"
                  placeholder="Digite seu cargo"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-blue-500" />
            <h2 className="text-2xl font-semibold text-white">Segurança</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="text-lg font-medium text-white">Alterar Senha</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700"
                  placeholder="Digite sua senha atual"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700"
                  placeholder="Digite a nova senha"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !currentPassword || !newPassword}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                Alterar Senha
              </button>
            </form>

            <form onSubmit={handleEmailChange} className="space-y-4">
              <h3 className="text-lg font-medium text-white">Alterar E-mail</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Novo E-mail
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700"
                  placeholder="Digite o novo e-mail"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700"
                  placeholder="Digite sua senha atual"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !currentPassword || !newEmail || newEmail === user?.email}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                Alterar E-mail
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;