/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Search,
  Filter,
  Sparkles,
  Check,
  ArrowRight,
  Menu,
  X,
  SlidersHorizontal,
  RotateCcw,
  Star,
  Sun,
  Flame,
  Droplets,
  Moon,
  TrendingUp,
  User
} from 'lucide-react';

import { Product, CartItem, SkinType, SkinConcern } from './types';
import { PRODUCTS, SKIN_TYPES } from './data';

// Assets
import logoImg from '../assets/skin.png';

// Components
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';

export default function App() {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Search & Filter conditions
  const [searchQuery, setSearchQuery] = useState('');
  const [skinFilter, setSkinFilter] = useState<'all' | SkinType>('all');
  const [stepFilter, setStepFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [concernFilter, setConcernFilter] = useState<'all' | SkinConcern>('all');
  const [popularOnly, setPopularOnly] = useState(false);

  // Mobile menu drawer state for filters
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Expandable search bar state for mobile
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Main menu navigation tabs ('inicio', 'categorias', 'accesorios', 'kits')
  const [activeMenuTab, setActiveMenuTab] = useState<'inicio' | 'categorias' | 'accesorios' | 'kits'>('inicio');

  // Selected product logic (popup detail)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Simple custom notification alert toast
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  // User state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Initialize and retrieve storage values
  useEffect(() => {
    // Cart
    const localCart = localStorage.getItem('dermacare_cart');
    if (localCart) {
      try {
        setCart(JSON.parse(localCart));
      } catch (err) {
        console.warn('Error reading local cart', err);
      }
    }

    // User auth
    const storedUser = localStorage.getItem('skineli_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn('Error reading stored user', err);
      }
    }
  }, []);

  const handleAuthSuccess = (user: { name: string; email: string }, isRegister: boolean) => {
    setCurrentUser(user);
    localStorage.setItem('skineli_user', JSON.stringify(user));
    showToast(isRegister ? `Cuenta creada. ¡Bienvenido, ${user.name}!` : `Sesión iniciada. ¡Hola de nuevo, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skineli_user');
    setIsUserDropdownOpen(false);
    showToast('Sesión cerrada correctamente.');
  };

  // Save cart changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('dermacare_cart', JSON.stringify(newCart));
  };

  // Add individual product to cart
  const handleAddToCart = (product: Product) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    const updated = [...cart];

    if (existingIndex >= 0) {
      updated[existingIndex].quantity += 1;
    } else {
      updated.push({ product, quantity: 1 });
    }

    saveCart(updated);
    showToast(`"${product.name}" añadido a la cesta.`);
  };

  // Update quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updated = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId);
    saveCart(updated);
    showToast('Producto removido.');
  };

  // Clear cart
  const handleClearCart = () => {
    saveCart([]);
  };

  // Custom toast notification trigger
  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Total items in cart
  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSkinFilter('all');
    setStepFilter('all');
    setConcernFilter('all');
    setPopularOnly(false);
  };

  // Filter products algorithm
  const filteredProducts = PRODUCTS.filter(prod => {
    // Menu tab category match
    const prodCategory = prod.category || 'skincare';
    if (activeMenuTab === 'categorias' && prodCategory !== 'skincare') return false;
    if (activeMenuTab === 'accesorios' && prodCategory !== 'accesorios') return false;
    if (activeMenuTab === 'kits' && prodCategory !== 'kits') return false;

    // Search match
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Skin type match
    const matchesSkin = skinFilter === 'all' || prod.skinType.includes(skinFilter);

    // Routine step match
    const matchesStep = stepFilter === 'all' || prod.step === stepFilter;

    // Concern match
    const matchesConcern = concernFilter === 'all' || prod.concern.includes(concernFilter);

    // Popular match
    const matchesPopular = !popularOnly || !!prod.isPopular;

    return matchesSearch && matchesSkin && matchesStep && matchesConcern && matchesPopular;
  });

  const hasActiveFilters = searchQuery !== '' || skinFilter !== 'all' || stepFilter !== 'all' || concernFilter !== 'all' || popularOnly;

  // Render the actual filters block (shared between desktop sidebar and mobile drawer)
  const renderFiltersContent = (onItemClick?: () => void) => {
    const handleStepSelect = (step: 'all' | 1 | 2 | 3 | 4) => {
      setStepFilter(step);
      if (onItemClick) onItemClick();
    };

    const handleSkinSelect = (skin: 'all' | SkinType) => {
      setSkinFilter(skin);
      if (onItemClick) onItemClick();
    };

    const handleConcernSelect = (concern: 'all' | SkinConcern) => {
      setConcernFilter(concern);
      if (onItemClick) onItemClick();
    };

    const handlePopularToggle = (popular: boolean) => {
      setPopularOnly(popular);
      if (onItemClick) onItemClick();
    };

    // Calculate count within current active tab
    const currentCategoryProducts = PRODUCTS.filter(prod => {
      const prodCategory = prod.category || 'skincare';
      if (activeMenuTab === 'categorias' && prodCategory !== 'skincare') return false;
      if (activeMenuTab === 'accesorios' && prodCategory !== 'accesorios') return false;
      if (activeMenuTab === 'kits' && prodCategory !== 'kits') return false;
      return true;
    });

    return (
      <div className="space-y-6">
        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer group shadow-3xs"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
            <span>Limpiar Filtros</span>
          </button>
        )}

        {/* 1. Steps (Routine steps) - Hide for accessories and kits */}
        {activeMenuTab !== 'accesorios' && activeMenuTab !== 'kits' && (
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pasos de Rutina</span>
            <div className="space-y-1">
              <button
                onClick={() => handleStepSelect('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${stepFilter === 'all'
                  ? 'bg-indigo-55/75 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>Todos los Pasos</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                  {currentCategoryProducts.length}
                </span>
              </button>

              {([1, 2, 3, 4] as const).map(step => {
                const info = currentCategoryProducts.filter(p => p.step === step);
                const stepNames = { 1: 'Limpiar', 2: 'Tratar', 3: 'Hidratar', 4: 'Proteger' };
                const stepIcons = {
                  1: <span className="w-5 h-5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full flex items-center justify-center shrink-0">1</span>,
                  2: <span className="w-5 h-5 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded-full flex items-center justify-center shrink-0">2</span>,
                  3: <span className="w-5 h-5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center justify-center shrink-0">3</span>,
                  4: <span className="w-5 h-5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full flex items-center justify-center shrink-0">4</span>
                };

                return (
                  <button
                    key={step}
                    onClick={() => handleStepSelect(step)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${stepFilter === step
                      ? 'bg-indigo-55/75 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {stepIcons[step]}
                      <span>{stepNames[step]}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                      {info.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Skin Types */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tipo de Cutis</span>
          <div className="space-y-1">
            <button
              onClick={() => handleSkinSelect('all')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${skinFilter === 'all'
                ? 'bg-indigo-55/75 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Cualquier Cutis</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                {currentCategoryProducts.length}
              </span>
            </button>

            {SKIN_TYPES.map(type => {
              const count = currentCategoryProducts.filter(p => p.skinType.includes(type.id)).length;
              const typeColors = {
                seca: 'bg-sky-400',
                grasa: 'bg-emerald-400',
                mixta: 'bg-purple-400',
                sensible: 'bg-rose-400'
              };

              return (
                <button
                  key={type.id}
                  onClick={() => handleSkinSelect(type.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${skinFilter === type.id
                    ? 'bg-indigo-55/75 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${typeColors[type.id as keyof typeof typeColors] || 'bg-slate-400'}`} />
                    <span>{type.label}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Concerns */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Preocupaciones</span>
          <div className="space-y-1">
            <button
              onClick={() => handleConcernSelect('all')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${concernFilter === 'all'
                ? 'bg-indigo-55/75 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Cualquier Preocupación</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                {currentCategoryProducts.length}
              </span>
            </button>

            {[
              { id: 'acne', label: 'Acné y Poros', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> },
              { id: 'manchas', label: 'Manchas e Hiperpigmentación', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
              { id: 'envejecimiento', label: 'Líneas y Arrugas', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> },
              { id: 'deshidratacion', label: 'Deshidratación y Opacidad', icon: <Droplets className="w-3.5 h-3.5 text-sky-500" /> },
              { id: 'luminosidad', label: 'Tono Apagado', icon: <Moon className="w-3.5 h-3.5 text-purple-500" /> }
            ].map(concern => {
              const count = currentCategoryProducts.filter(p => p.concern.includes(concern.id as SkinConcern)).length;
              return (
                <button
                  key={concern.id}
                  onClick={() => handleConcernSelect(concern.id as SkinConcern)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${concernFilter === concern.id
                    ? 'bg-indigo-55/75 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {concern.icon}
                    <span>{concern.label}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Special Collections */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Colección</span>
          <div className="space-y-1">
            <button
              onClick={() => handlePopularToggle(false)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${!popularOnly
                ? 'bg-indigo-55/75 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Todo el Catálogo</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                {currentCategoryProducts.length}
              </span>
            </button>

            <button
              onClick={() => handlePopularToggle(true)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${popularOnly
                ? 'bg-indigo-55/75 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>Más Populares</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                {currentCategoryProducts.filter(p => p.isPopular).length}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render active tags above the product grid
  const renderActiveTags = () => {
    if (!hasActiveFilters) return null;

    const skinLabels = {
      seca: 'Seca',
      grasa: 'Grasa',
      mixta: 'Mixta',
      sensible: 'Sensible'
    };

    const stepLabels = {
      1: 'Paso 1: Limpiar',
      2: 'Paso 2: Tratar',
      3: 'Paso 3: Hidratar',
      4: 'Paso 4: Proteger'
    };

    const concernLabels = {
      acne: 'Acné',
      manchas: 'Manchas',
      envejecimiento: 'Antiedad',
      deshidratacion: 'Deshidratación',
      luminosidad: 'Luminosidad'
    };

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold">Activos:</span>

        {searchQuery !== '' && (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 text-xs font-medium px-2.5 py-0.75 rounded-lg border border-indigo-100">
            <span>"{searchQuery}"</span>
            <button onClick={() => setSearchQuery('')} className="hover:text-red-600 text-indigo-400 font-bold ml-1 cursor-pointer">✕</button>
          </span>
        )}

        {stepFilter !== 'all' && (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 text-xs font-medium px-2.5 py-0.75 rounded-lg border border-indigo-100">
            <span>{stepLabels[stepFilter]}</span>
            <button onClick={() => setStepFilter('all')} className="hover:text-red-600 text-indigo-400 font-bold ml-1 cursor-pointer">✕</button>
          </span>
        )}

        {skinFilter !== 'all' && (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 text-xs font-medium px-2.5 py-0.75 rounded-lg border border-indigo-100">
            <span>Cutis: {skinLabels[skinFilter]}</span>
            <button onClick={() => setSkinFilter('all')} className="hover:text-red-600 text-indigo-400 font-bold ml-1 cursor-pointer">✕</button>
          </span>
        )}

        {concernFilter !== 'all' && (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 text-xs font-medium px-2.5 py-0.75 rounded-lg border border-indigo-100">
            <span>Foco: {concernLabels[concernFilter]}</span>
            <button onClick={() => setConcernFilter('all')} className="hover:text-red-600 text-indigo-400 font-bold ml-1 cursor-pointer">✕</button>
          </span>
        )}

        {popularOnly && (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 text-xs font-medium px-2.5 py-0.75 rounded-lg border border-indigo-100">
            <span>Colección: Populares</span>
            <button onClick={() => setPopularOnly(false)} className="hover:text-red-600 text-indigo-400 font-bold ml-1 cursor-pointer">✕</button>
          </span>
        )}

        <button
          onClick={handleResetFilters}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline cursor-pointer ml-1"
        >
          Limpiar todo
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between" id="dermacare-root">

      {/* 1. HEADER (STORES NAVIGATION ONLY) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-3xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 flex items-center justify-between">

          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="SkinEli" className="w-8.5 h-8.5 sm:w-9 sm:h-9 object-contain shrink-0" />
            <div>
              <span className="font-sans font-semibold text-base sm:text-lg text-slate-900 tracking-tight block leading-none">SkinElii</span>
              <span className="text-[9px] sm:text-[10px] text-indigo-600 font-bold tracking-widest uppercase block mt-0.5 sm:mt-1">Tienda Skincare</span>
            </div>
          </div>

          {/* Desktop Navigation Menu (Inicio, Categorías, Accesorios, Kits) */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { id: 'inicio', label: 'Inicio' },
              { id: 'categorias', label: 'Categorías' },
              { id: 'accesorios', label: 'Accesorios' },
              { id: 'kits', label: 'Kits' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMenuTab(tab.id as any);
                  handleResetFilters();
                }}
                className={`text-sm font-semibold tracking-wide transition-all pb-1.5 border-b-2 cursor-pointer ${activeMenuTab === tab.id
                  ? 'border-indigo-600 text-indigo-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-indigo-600'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center relative max-w-xs w-full mx-4">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:shadow-3xs rounded-full pl-9 pr-8 py-2 text-slate-850 focus:outline-hidden transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-650 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">

            {/* Mobile Search Toggle (Visible on Mobile/Tablet) */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="lg:hidden p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
              title="Buscar"
            >
              {isSearchExpanded ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />}
            </button>

            {/* Mobile Filter Toggle (Visible on Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Filtros</span>
            </button>

            {/* Shopping cart floating trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-850 rounded-full transition-colors cursor-pointer shrink-0"
              id="header-cart-button"
            >
              <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5 text-slate-755" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-mono text-[9px] sm:text-[10px] font-black w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white animate-scale-in">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Account Section */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 bg-indigo-50 border border-indigo-105 hover:bg-indigo-100/70 text-indigo-900 rounded-xl transition-all cursor-pointer text-xs font-semibold"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-650 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline">{currentUser.name}</span>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <>
                    {/* Invisible click backdrop to close */}
                    <div
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="fixed inset-0 z-30"
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-40 animate-scale-in">
                      <div className="px-4 py-1.5 border-b border-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Tu Cuenta
                      </div>
                      <div className="px-4 py-2 text-xs text-slate-700 font-medium truncate">
                        {currentUser.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors font-semibold cursor-pointer border-t border-slate-50 mt-1"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer text-xs font-semibold"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline text-slate-700">Mi cuenta</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Search Bar Expansion Panel */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-slate-100 bg-slate-50/75 p-3 px-4"
            >
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar productos, ingredientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-white border border-slate-200 focus:border-indigo-600 rounded-xl pl-10 pr-8 py-2.5 text-slate-850 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Main Menu Sub-Navbar */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto px-3 py-2.5 bg-white border-t border-slate-100 scrollbar-none">
          {[
            { id: 'inicio', label: '🏠 Inicio' },
            { id: 'categorias', label: '🧴 Skincare' },
            { id: 'accesorios', label: '✨ Accesorios' },
            { id: 'kits', label: '🎁 Kits' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMenuTab(tab.id as any);
                handleResetFilters();
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeMenuTab === tab.id
                ? 'bg-indigo-600 text-white shadow-3xs'
                : 'bg-slate-100 text-slate-650 hover:bg-slate-250'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 2. CORE LAYOUT AND VIEWS */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Dynamic Navigation Banner based on activeMenuTab */}
        {activeMenuTab === 'accesorios' ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-xs mb-8">
            <div className="md:w-3/5 space-y-3 text-center md:text-left">
              <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Accesorios de Spa y Belleza
              </span>
              <h1 className="font-sans font-bold text-2xl md:text-3xl text-slate-900 tracking-tight leading-none">
                Optimiza y eleva tu rutina diaria
              </h1>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                Descubre herramientas premium como rodillos de cuarzo rosa para drenaje linfático, discos desmaquillantes ecológicos reutilizables y bandas elásticas para mantener el cabello recogido mientras cuidas tu rostro.
              </p>
            </div>
            <div className="md:w-2/5 flex items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl w-full">
              <div className="text-center space-y-2">
                <Sparkles className="w-8 h-8 text-indigo-600 mx-auto animate-pulse" />
                <span className="text-xs font-bold text-slate-700 block">Herramientas de Alta Calidad</span>
                <span className="text-[10px] text-slate-400 block">Diseñadas para durar y cuidar el planeta</span>
              </div>
            </div>
          </div>
        ) : activeMenuTab === 'kits' ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-xs mb-8">
            <div className="md:w-3/5 space-y-3 text-center md:text-left">
              <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Kits y Rutinas Completas
              </span>
              <h1 className="font-sans font-bold text-2xl md:text-3xl text-slate-900 tracking-tight leading-none">
                Tratamientos listos creados por expertos
              </h1>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                Ahorra hasta un 15% adquiriendo nuestros sets prediseñados. Cada kit contiene combinaciones de limpiadores, sérums e hidratantes balanceadas específicamente para tu tipo de cutis y necesidades de cuidado.
              </p>
            </div>
            <div className="md:w-2/5 flex items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl w-full">
              <div className="text-center space-y-2">
                <Flame className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                <span className="text-xs font-bold text-slate-700 block">Ahorro y Eficacia Garantizada</span>
                <span className="text-[10px] text-slate-400 block">El regalo perfecto para tu piel</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-xs mb-8">
            <div className="md:w-3/5 space-y-3 text-center md:text-left">
              <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Tu Catálogo de Skincare
              </span>
              <h1 className="font-sans font-bold text-2xl md:text-3xl text-slate-900 tracking-tight leading-none">
                Una rutina simplificada en 4 pasos esenciales
              </h1>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                Descubre productos premium formulados para cuidar, sanar y revitalizar tu rostro. Organiza tu rutina en cuatro pasos básicos: limpiar impurezas, tratar con sérums enriquecidos, hidratar tu barrera protectora y blindarte con filtro solar.
              </p>
            </div>

            <div className="md:w-2/5 grid grid-cols-2 gap-2 w-full">
              <div
                onClick={() => setStepFilter(stepFilter === 1 ? 'all' : 1)}
                className={`p-3 border rounded-2xl text-center cursor-pointer transition-all ${stepFilter === 1
                  ? 'bg-blue-50 border-blue-300 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                  }`}
              >
                <span className="w-6 h-6 bg-blue-100 text-blue-800 text-xs font-black rounded-full flex items-center justify-center mx-auto mb-1">1</span>
                <span className="text-xs font-bold text-slate-800 block">Limpiar</span>
              </div>
              <div
                onClick={() => setStepFilter(stepFilter === 2 ? 'all' : 2)}
                className={`p-3 border rounded-2xl text-center cursor-pointer transition-all ${stepFilter === 2
                  ? 'bg-purple-50 border-purple-300 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                  }`}
              >
                <span className="w-6 h-6 bg-purple-100 text-purple-800 text-xs font-black rounded-full flex items-center justify-center mx-auto mb-1">2</span>
                <span className="text-xs font-bold text-slate-800 block">Tratar</span>
              </div>
              <div
                onClick={() => setStepFilter(stepFilter === 3 ? 'all' : 3)}
                className={`p-3 border rounded-2xl text-center cursor-pointer transition-all ${stepFilter === 3
                  ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                  }`}
              >
                <span className="w-6 h-6 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full flex items-center justify-center mx-auto mb-1">3</span>
                <span className="text-xs font-bold text-slate-800 block">Hidratar</span>
              </div>
              <div
                onClick={() => setStepFilter(stepFilter === 4 ? 'all' : 4)}
                className={`p-3 border rounded-2xl text-center cursor-pointer transition-all ${stepFilter === 4
                  ? 'bg-amber-50 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                  }`}
              >
                <span className="w-6 h-6 bg-amber-100 text-amber-800 text-xs font-black rounded-full flex items-center justify-center mx-auto mb-1">4</span>
                <span className="text-xs font-bold text-slate-800 block">Proteger</span>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Catalog layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* COLUMN A: PERSISTENT SIDEBAR MENU (Desktop) */}
          <aside className="hidden lg:block bg-white border border-slate-100 rounded-3xl p-6 shadow-xs sticky top-24 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-indigo-650" />
              <h2 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider">Categorías</h2>
            </div>
            {renderFiltersContent()}
          </aside>

          {/* COLUMN B: PRODUCTS CATALOG GRID (Responsive) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Toolbar: Search and Filter Info */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-3xs">

              {/* Search Bar */}
              <div className="relative md:max-w-xs w-full">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar productos, ingredientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs md:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-slate-850 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Status information */}
              <div className="text-right text-xs text-slate-400 font-semibold font-mono">
                {filteredProducts.length === 1
                  ? '1 producto encontrado'
                  : `${filteredProducts.length} productos encontrados`}
              </div>

            </div>

            {/* Render active filter badges */}
            {hasActiveFilters && (
              <div className="bg-white border border-slate-100/70 rounded-2xl p-3.5 px-5 shadow-3xs">
                {renderActiveTags()}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 flex flex-col items-center justify-center space-y-4">
                <div className="p-3 bg-slate-50 rounded-full text-slate-400">
                  <Filter className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-lg">Ningún producto coincide</p>
                  <p className="text-slate-400 text-xs mt-0.5">Prueba a limpiar tus filtros o cambiar los términos de búsqueda.</p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="bg-indigo-600 hover:bg-indigo-700 font-medium text-xs text-white py-2 px-5 rounded-lg transition-colors cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* 3. BRANDING FOOTER */}
      <footer className="bg-slate-900 text-slate-450 border-t border-slate-800 py-10 mt-16 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="SkinEli" className="w-8 h-8 object-contain shrink-0" />
              <span className="font-sans font-semibold text-sm text-slate-100 tracking-tight">SkinEli Skincare Store</span>
            </div>

            <p className="text-slate-400 max-w-md text-center md:text-left leading-normal">
              Ofrecemos soluciones directas y honestas para el cuidado diario de tu piel. Compra con confianza y arma tu rutina personalizada de forma sencilla.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2 font-mono text-[10px]">
            <span>© 2026 SkinEli Store. Todos los derechos reservados.</span>
            <div className="flex gap-4">
              <span>1. Limpiar</span>
              <span>2. Tratar</span>
              <span>3. Hidratar</span>
              <span>4. Proteger</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. DETAILS POPUP MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 5. SHOPPING CART DRAWER */}
      <Cart
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* 6. MOBILE DRAWER FILTER MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" id="mobile-filter-drawer">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900"
            />

            {/* Sliding Panel */}
            <div className="absolute inset-y-0 left-0 max-w-xs w-full flex">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-650" />
                    <span className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider">Categorías</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Items */}
                {renderFiltersContent(() => setIsMobileMenuOpen(false))}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Modal popup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 7. TOAST ALERT REUSABLE NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white py-3 px-5 rounded-2xl shadow-xl text-xs md:text-sm font-medium flex items-center gap-2.5"
            id="global-toast-notification"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3px]" />
            </div>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
