// Alternative API configuration for Vercel deployment
// This file will be used when switching to Vercel API

// Use relative URLs since everything is on same Vercel domain
const API_BASE_URL_VERCEL = '/api';

// Keep original Railway URL as fallback
const API_BASE_URL_RAILWAY = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const API_BASE_URL = API_BASE_URL_RAILWAY; // Currently using Railway
export const API_BASE_URL_VERCEL_READY = API_BASE_URL_VERCEL; // Ready for Vercel switch

export default API_BASE_URL;
