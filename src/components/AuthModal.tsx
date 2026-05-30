/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string }, isRegister: boolean) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validations
    if (!email || !password) {
      setError('Por favor, rellene todos los campos.');
      return;
    }

    if (!isLoginMode && !name) {
      setError('Por favor, ingrese su nombre.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    // Simulate backend auth latency for premium feel
    setTimeout(() => {
      setIsLoading(false);
      const user = {
        name: isLoginMode ? (email.split('@')[0]) : name,
        email: email,
      };
      
      // Capitalize first letter of name
      user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);

      onAuthSuccess(user, !isLoginMode);
      onClose();
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="auth-modal">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-10 border border-slate-100 animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 mx-auto">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-sans font-bold text-xl text-slate-900">
              {isLoginMode ? '¡Bienvenido a SkinEli!' : 'Crea tu Cuenta'}
            </h3>
            <p className="text-xs text-slate-500">
              {isLoginMode 
                ? 'Ingresa tus credenciales para acceder a tu perfil y compras.' 
                : 'Únete para guardar favoritos y agilizar tus compras de skincare.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {/* Name Input (Register Only) */}
            {!isLoginMode && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="w-full text-xs md:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-slate-850 focus:outline-hidden transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full text-xs md:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-slate-850 focus:outline-hidden transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full text-xs md:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl pl-10 pr-10 py-2.5 text-slate-850 focus:outline-hidden transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs md:text-sm font-semibold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
              )}
            </button>

          </form>

          {/* Mode Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs">
            <span className="text-slate-500">
              {isLoginMode ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </span>{' '}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
              disabled={isLoading}
              className="text-indigo-650 hover:text-indigo-850 font-bold hover:underline cursor-pointer disabled:opacity-50"
            >
              {isLoginMode ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
