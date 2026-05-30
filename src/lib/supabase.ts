/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Product, TrackerDay, SavedRoutine } from '../types';
import { PRODUCTS } from '../data';

// Read env variables
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL;
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY;

// Check if configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Guard client initialization to avoid crashes on startup if keys are partially or missing
let supabaseClient: any = null;
if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

/**
 * Global database interface.
 * Fallbacks to localStorage if Supabase is not configured yet.
 * This guarantees a fully working prototype out of the box and 
 * switches to a live backend as soon as the keys are set.
 */
export const db = {
  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('products')
          .select('*')
          .order('step', { ascending: true });
        
        if (error) throw error;
        if (data && data.length > 0) {
          return data as Product[];
        }
      } catch (err) {
        console.warn('Supabase product fetch failed, using local fallback:', err);
      }
    }
    
    // Seed products into localStorage for high fidelity
    const local = localStorage.getItem('dermacare_products');
    if (!local) {
      localStorage.setItem('dermacare_products', JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    return JSON.parse(local);
  },

  // --- SAVE CUSTOMIZED ROUTINE DISCOVERY ---
  async saveRoutine(routine: SavedRoutine): Promise<SavedRoutine> {
    const defaultId = 'local-routine-id';
    const routineWithMeta = {
      ...routine,
      id: routine.id || defaultId,
      createdAt: routine.createdAt || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('routines')
          .upsert([routineWithMeta])
          .select();
        
        if (error) throw error;
        if (data && data[0]) return data[0] as SavedRoutine;
      } catch (err) {
        console.warn('Supabase routine save failed, saving locally:', err);
      }
    }

    localStorage.setItem('dermacare_saved_routine', JSON.stringify(routineWithMeta));
    return routineWithMeta;
  },

  async getSavedRoutine(): Promise<SavedRoutine | null> {
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('routines')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        if (data && data[0]) return data[0] as SavedRoutine;
      } catch (err) {
        console.warn('Supabase routine get failed, reading locally:', err);
      }
    }

    const local = localStorage.getItem('dermacare_saved_routine');
    return local ? JSON.parse(local) : null;
  },

  // --- ROUTINE TRACKER LOGS ---
  async getTrackerDays(): Promise<TrackerDay[]> {
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('tracker_days')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        if (data) return data as TrackerDay[];
      } catch (err) {
        console.warn('Supabase tracker fetch failed, loading from local:', err);
      }
    }

    const local = localStorage.getItem('dermacare_tracker_days');
    return local ? JSON.parse(local) : [];
  },

  async saveTrackerDay(day: TrackerDay): Promise<TrackerDay> {
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('tracker_days')
          .upsert([day], { onConflict: 'date' })
          .select();
        
        if (error) throw error;
        if (data && data[0]) return data[0] as TrackerDay;
      } catch (err) {
        console.warn('Supabase tracker upsert failed, saving locally:', err);
      }
    }

    // Save locally
    const currentLogs = await this.getTrackerDays();
    const existingIndex = currentLogs.findIndex(l => l.date === day.date);
    if (existingIndex >= 0) {
      currentLogs[existingIndex] = day;
    } else {
      currentLogs.push(day);
    }
    localStorage.setItem('dermacare_tracker_days', JSON.stringify(currentLogs));
    return day;
  }
};
