
import React from 'react';
import { Product } from '@/lib/types';
import { Icons } from '@/lib/constants';

interface Props {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onClick }) => {
  const hasDiscount = product.discounted_price_inr < product.price_inr;

  return (
    <div 
      onClick={() => onClick(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.images[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#6D634C]">
            {product.type}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col mb-2">
          <h3 className="text-xl font-bold leading-tight line-clamp-1 group-hover:text-[#6D634C] transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-[#6D634C] text-lg">₹{product.discounted_price_inr}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">₹{product.price_inr}</span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-10">
          {product.description}
        </p>
        <button className="w-full py-3 bg-[#2D2926] text-white rounded-xl flex items-center justify-center gap-2 hover:bg-[#44403C] transition-colors font-semibold text-sm">
          <Icons.ShoppingBag />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
