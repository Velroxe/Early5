
import React from 'react';
import { Product, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Vintage Aged Basmati',
    type: 'Heritage',
    description: 'Long-grain rice aged for 24 months to achieve the perfect aroma and fluffiness.',
    price_inr: 1599,
    discounted_price_inr: 1299,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Organic Black Forbidden Rice',
    type: 'Nutrient-Rich',
    description: 'Ancient grain with deep purple hues and powerful antioxidants.',
    price_inr: 1200,
    discounted_price_inr: 950,
    images: ['https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-05-10T00:00:00Z'
  },
  {
    id: '3',
    title: 'Golden Thai Jasmine',
    type: 'Essential',
    description: 'Fragrant and slightly sticky, perfect for authentic Southeast Asian cuisine.',
    price_inr: 999,
    discounted_price_inr: 799,
    images: ['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800'],
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-05-12T00:00:00Z'
  },
  {
    id: '4',
    title: 'Wild Red Cargo Rice',
    type: 'Wholesome',
    description: 'Nutty flavor and chewy texture, unpolished for maximum health benefits.',
    price_inr: 1100,
    discounted_price_inr: 899,
    images: ['https://images.unsplash.com/photo-1512058560366-cd2429555e54?auto=format&fit=crop&q=80&w=800'],
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-05-15T00:00:00Z'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Sarah Jenkins',
    rating: 5,
    comment: 'The Basmati rice from Early5 is truly exceptional. Every grain stays separate and fluffy.',
    date: '2 days ago'
  },
  {
    id: 'r2',
    author: 'Chef Marco D.',
    rating: 5,
    comment: 'I use the Forbidden Rice for my signature risotto. The quality is unmatched in the retail market.',
    date: '1 week ago'
  }
];

export const Icons = {
  Leaf: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.1.8 13.5A10 10 0 0 1 11 20z"/><path d="M7 20c-1.38 0-2.5-1.12-2.5-2.5 0-1.66 1.34-3 3-3 1.33 0 2.5 1.12 2.5 2.5 0 1.66-1.34 3-3 3z"/></svg>
  ),
  Truck: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v6h2"/><path d="M13 9h4"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  ShoppingBag: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  )
};
