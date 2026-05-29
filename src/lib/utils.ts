import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const UTILITY_NAV_SEGMENTS = new Set([
  'cart', 'panier', 'checkout', 'paiement', 'payment',
  'commande', 'order', 'orders', 'wishlist', 'favoris', 'favorites',
  'login', 'register', 'signup', 'signin', 'connexion', 'inscription',
  'account', 'compte', 'profile', 'profil', 'settings', 'parametres',
  'admin', 'administration', 'dashboard', 'tableau-de-bord',
]);

const UTILITY_NAV_PATH_REGEX = /^\/(cart|panier|checkout|paiement|payment|commande|order|orders|wishlist|favoris|favorites|login|register|signup|signin|connexion|inscription|account|compte|profile|profil|settings|parametres|admin|administration|dashboard|tableau-de-bord)(?:\/|$)/i;

export function isUtilityNavigationPath(path?: string): boolean {
  if (!path) return false;
  const normalizedPath = path.toLowerCase().replace(/\/+$/, '') || '/';
  const segment = normalizedPath.split('/').pop() || '';
  return UTILITY_NAV_PATH_REGEX.test(normalizedPath) || UTILITY_NAV_SEGMENTS.has(segment);
}

export function filterNavigationItems<T extends { hidden?: boolean; to?: string }>(
  items: T[],
  options?: { showUtilityPagesInNav?: boolean }
): T[] {
  return items.filter((item) => {
    if (item.hidden) return false;
    if (options?.showUtilityPagesInNav) return true;
    return !isUtilityNavigationPath(item.to);
  });
}

// ============================================================================
// FONCTIONS UTILITAIRES COURANTES
// Ces fonctions sont souvent utilisées par le LLM dans les pages générées
// ============================================================================

/**
 * Formate un nombre en devise (EUR par défaut)
 */
export function formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Formate une date en format localisé
 */
export function formatDate(date: Date | string, locale: string = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
}

/**
 * Formate une date courte (01/01/2024)
 */
export function formatShortDate(date: Date | string, locale: string = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(num: number, locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Formate un pourcentage
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Tronque un texte avec ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalise la première lettre
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Génère un ID unique simple
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Délai async (pour simulations)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calcule le total TTC à partir du HT et du taux de TVA
 */
export function calculateTTC(ht: number, tvaRate: number = 0.20): number {
  return ht * (1 + tvaRate);
}

/**
 * Calcule la TVA à partir du HT
 */
export function calculateTVA(ht: number, tvaRate: number = 0.20): number {
  return ht * tvaRate;
}
