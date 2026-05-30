/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  CreditCard,
  Truck,
  Package
} from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  isOpen, 
  onClose 
}: CartProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'success'>('cart');
  const [formFields, setFormFields] = useState({
    name: '',
    address: '',
    city: '',
    card: '4000 1234 5678 9010',
    expiry: '12/28',
    cvv: '123'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Math equations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = subtotal >= 50 ? subtotal * 0.1 : 0; // 10% discount on bundles
  const shipping = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 5.99;
  const total = subtotal - discount + shipping;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate payment API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCheckoutStep('success');
      onClearCart();
    }, 1500);
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-drawer">
      {/* Black ambient backdrop overlay */}
      <div 
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full border-l border-slate-100">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h3 className="font-sans font-semibold text-lg text-slate-900">Tu Cesta de Cuidado</h3>
            </div>
            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Core Body Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence mode="wait">
              
              {/* CART STATE */}
              {checkoutStep === 'cart' && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 h-full flex flex-col justify-between"
                >
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-slate-800">Tu cesta está vacía</p>
                        <p className="text-xs text-slate-400 max-w-[240px]">Comienza explorando los productos del menú e inicia tu rutina diaria.</p>
                      </div>
                      <button 
                        onClick={handleClose}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-5 rounded-lg transition-all shadow-xs cursor-pointer"
                      >
                        Descubrir Productos
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Bundle Promotion alert */}
                      {subtotal < 50 ? (
                        <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center gap-2.5 text-xs text-indigo-950">
                          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>¡Agrega <strong>${(50 - subtotal).toFixed(2)}</strong> más y obtén <strong>Envío Gratis + 10% Descuento</strong>!</span>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-950">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>¡Felicidades! Disfrutas de <strong>Envío Gratis y un 10% de Descuento</strong> por tu rutina.</span>
                        </div>
                      )}

                      {/* Items loop */}
                      <div className="divide-y divide-slate-50 max-h-[45vh] overflow-y-auto pr-1">
                        {items.map((item) => (
                          <div key={item.product.id} className="py-4 flex gap-4">
                            <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                                  <span>
                                    {item.product.category === 'accesorios'
                                      ? 'Accesorio'
                                      : item.product.category === 'kits'
                                      ? 'Kit Ahorro'
                                      : `Paso ${item.product.step}: ${item.product.stepName}`}
                                  </span>
                                </div>
                                <h4 className="font-medium text-xs md:text-sm text-slate-900 truncate">
                                  {item.product.name}
                                </h4>
                                <span className="text-xs text-slate-400 capitalize font-medium">{item.product.brand}</span>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-semibold text-slate-800">${item.product.price.toFixed(2)}</span>
                                
                                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg p-1">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-semibold font-mono w-4 text-center text-slate-850">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                    className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="text-slate-405 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                                  title="Quitar de la cesta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* PAYMENT CHECKOUT ADDRESS FORM */}
              {checkoutStep === 'address' && (
                <motion.form
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleCheckoutSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-1.5 pb-2 border-b border-slate-100">
                    <h4 className="font-semibold text-slate-800 text-sm">Detalles de Entrega y Pago</h4>
                    <p className="text-xs text-slate-500">Completa esta simulación para finiquitar tu pedido.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Sofía Rodríguez"
                        value={formFields.name}
                        onChange={e => setFormFields({...formFields, name: e.target.value})}
                        className="w-full text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-850 focus:outline-hidden focus:border-indigo-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Dirección de Envío</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Calle, Número, Apartamento"
                        value={formFields.address}
                        onChange={e => setFormFields({...formFields, address: e.target.value})}
                        className="w-full text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-850 focus:outline-hidden focus:border-indigo-600 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Ciudad</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Madrid / CDMX"
                          value={formFields.city}
                          onChange={e => setFormFields({...formFields, city: e.target.value})}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-850 focus:outline-hidden focus:border-indigo-600 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Tarjeta Simulada</label>
                        <input 
                          type="text" 
                          required
                          value={formFields.card}
                          onChange={e => setFormFields({...formFields, card: e.target.value})}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-850 focus:outline-hidden focus:border-indigo-600 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Vencimiento</label>
                        <input 
                          type="text" 
                          required
                          placeholder="MM/AA"
                          value={formFields.expiry}
                          onChange={e => setFormFields({...formFields, expiry: e.target.value})}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-850 focus:outline-hidden focus:border-indigo-600 transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">CVV</label>
                        <input 
                          type="password" 
                          required
                          maxLength={3}
                          value={formFields.cvv}
                          onChange={e => setFormFields({...formFields, cvv: e.target.value})}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-850 focus:outline-hidden focus:border-indigo-600 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed Safe checkout info */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2 text-[10px] md:text-xs text-slate-500 leading-normal">
                    <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Esta es una checkout de prueba seguro. No introduzcas tarjetas bancarias reales.</span>
                  </div>

                  <div className="flex gap-2.5 pt-4">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 text-white py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? 'Procesando...' : 'Confirmar Compra'}
                      <CreditCard className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* CHECKOUT SUCCESS STATE */}
              {checkoutStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-10 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                    <Check className="w-8 h-8 stroke-[3px]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-xl text-slate-900">¡Pedido Confirmado!</h4>
                    <p className="text-xs text-slate-500 px-6 leading-relaxed">
                      Muchas gracias por cuidar tu piel con Dermacare. Tu orden simulada se ha registrado exitosamente. Tu envío llegará pronto a tu dirección.
                    </p>
                  </div>
                  
                  {/* Delivery details display simulation */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full text-left text-xs text-slate-600 divide-y divide-slate-100 space-y-2">
                    <div className="flex justify-between pb-1 font-semibold text-slate-800">
                      <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-indigo-600" /> Detalle de Envío</span>
                      <span className="text-indigo-600">En preparación</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span>Destinatario:</span>
                      <span className="font-medium text-slate-800">{formFields.name || 'Sofía Rodríguez'}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span>Dirección:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[180px]">{formFields.address || 'Calle Gran Vía 12'}</span>
                    </div>
                    <div className="pt-2 flex justify-between pb-1">
                      <span>Tiempo Estimado:</span>
                      <span className="font-medium text-slate-800">2-4 días hábiles</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleClose}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-xs cursor-pointer w-full"
                  >
                    Seguir Comprando
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Checkout Totals Summary Card - Fixed at the bottom of the drawer */}
          {items.length > 0 && checkoutStep === 'cart' && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Descuento de Rutina (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="font-medium text-slate-800">
                    {shipping === 0 ? <strong className="text-emerald-600">GRATIS</strong> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200/80 pt-3 mt-1">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('address')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                Proceder al Checkout
                <Package className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
