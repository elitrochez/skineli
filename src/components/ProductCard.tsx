/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ShoppingCart, Info, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onSelectProduct }: ProductCardProps) {
  return (
    <div 
      className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden shrink-0">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Step Badge Float */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-3xs border border-slate-100 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold font-mono text-indigo-700 shadow-2xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span>
            {product.category === 'accesorios'
              ? 'Accesorio'
              : product.category === 'kits'
              ? 'Kit Ahorro'
              : `Paso ${product.step}: ${product.stepName}`}
          </span>
        </div>

        {/* Popular Item Float */}
        {product.isPopular && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-[9px] md:text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-2xs tracking-wider">
            Popular
          </div>
        )}

        {/* Quick View Cover Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button 
            onClick={() => onSelectProduct(product)}
            className="p-3 bg-white hover:bg-indigo-50 border border-slate-100 rounded-full shadow-md text-slate-800 transition-all transform hover:scale-110 cursor-pointer"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Info Stage */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500 font-mono">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-sans font-semibold text-sm md:text-base text-slate-900 leading-snug cursor-pointer group-hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Skin Compatibility labels */}
          <div className="flex flex-wrap gap-1 pt-1">
            {product.skinType.map((type) => (
              <span 
                key={type}
                className="text-[9px] bg-slate-50 border border-slate-100 font-semibold px-2 py-0.5 rounded-md text-slate-600 capitalize font-mono"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Actions Stage */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50/80">
          <div>
            <div className="text-[9px] text-slate-400 font-medium uppercase font-mono">Vol: {product.volume}</div>
            <div className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
