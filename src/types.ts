/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SkinType = 'seca' | 'grasa' | 'mixta' | 'sensible';

export type SkinConcern = 'acne' | 'manchas' | 'envejecimiento' | 'deshidratacion' | 'luminosidad';

export type RoutineStepNum = 1 | 2 | 3 | 4;

export type RoutineStepName = 'Limpiar' | 'Tratar' | 'Hidratar' | 'Proteger';

export interface Product {
  id: string;
  brand: string;
  name: string;
  category?: 'skincare' | 'accesorios' | 'kits';
  step?: RoutineStepNum;
  stepName?: RoutineStepName;
  description: string;
  price: number;
  imageUrl: string;
  skinType: SkinType[];
  concern: SkinConcern[];
  ingredients: string[];
  volume: string;
  rating: number;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TrackerDay {
  date: string; // YYYY-MM-DD
  // Step completion status for morning (AM) and evening (PM)
  am: {
    1: boolean; // Cleanse
    2: boolean; // Treat
    3: boolean; // Hydrate
    4: boolean; // Protect
  };
  pm: {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean; // usually protect is not in PM, but can be configured, or AM/PM routines can be customized
  };
}

export interface SavedRoutine {
  userId?: string;
  id?: string;
  skinType: SkinType;
  concern: SkinConcern;
  recommendedProductIds: string[];
  createdAt?: string;
}
