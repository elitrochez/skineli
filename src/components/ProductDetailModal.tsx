/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ShoppingBag, CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { ROUTINE_STEPS_INFO } from '../data';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!product) return null;

  const stepInfo = product.step ? ROUTINE_STEPS_INFO[product.step] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="product-detail-modal">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-slate-100 flex flex-col md:flex-row">
        
        {/* Close Button Float */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-900/80 text-white hover:bg-slate-900 p-2 rounded-full transition-colors z-20 cursor-pointer"
        >
          ✕
        </button>

        {/* Visual half */}
        <div className="md:w-1/2 bg-slate-50 relative min-h-[250px] md:min-h-full">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover absolute inset-0"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 z-10 text-white space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-600/90 text-indigo-50 border border-indigo-400/25 px-2.5 py-1 rounded-full">
              {product.category === 'accesorios'
                ? 'Accesorio de Belleza'
                : product.category === 'kits'
                ? 'Kit Skincare Completo'
                : `Paso ${product.step} de Skincare`}
            </span>
            <div className="text-xl font-bold font-mono">{product.volume}</div>
          </div>
        </div>

        {/* Info half */}
        <div className="md:w-1/2 p-6 md:p-8 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
              <h3 className="font-sans font-semibold text-lg md:text-xl text-slate-900 mt-0.5 leading-snug">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold font-mono text-slate-700">{product.rating} / 5</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Descripción del Producto</h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Routine Connection Details */}
            {product.category !== 'accesorios' && product.category !== 'kits' ? (
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
                <div className="text-xs font-bold text-indigo-800 flex items-center gap-1">
                  <span>¿Por qué este es el Paso {product.step}?</span>
                </div>
                <p className="text-[11px] text-slate-650 leading-relaxed">
                  El paso <strong>{stepInfo?.name}</strong> es esencial por lo siguiente: {stepInfo?.desc}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
                <div className="text-xs font-bold text-indigo-800 flex items-center gap-1">
                  <span>Información de la Colección</span>
                </div>
                <p className="text-[11px] text-slate-650 leading-relaxed">
                  {product.category === 'accesorios'
                    ? 'Herramienta de cuidado personal seleccionada para optimizar la salud facial de tu cutis.'
                    : 'Ahorra comprando tus productos favoritos combinados en este kit curado.'}
                </p>
              </div>
            )}

            {/* Skin Compatibility list */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Compatibilidad de Cutis</h4>
              <div className="flex flex-wrap gap-1.5">
                {product.skinType.map((t) => (
                  <span 
                    key={t} 
                    className="text-[10px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md capitalize font-mono flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Formulation / Ingredients */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Ingredientes Activos</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {product.ingredients.join(', ')}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Precio online</span>
              <div className="text-2xl font-black text-indigo-950">${product.price.toFixed(2)}</div>
            </div>
            
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs md:text-sm py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 fill-indigo-200/45" />
              <span>Añadir a la Cesta</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
