"use client";

import React from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

interface ProductGridProps {
  products: Product[];
  types: string[];
  activeType: string;
  loading?: boolean;
  error?: string;
  onTypeChange: (type: string) => void;
  onProductClick: (id: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  types,
  activeType,
  loading = false,
  error,
  onTypeChange,
  onProductClick,
}) => {
  return (
    <section id="shop" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              The Harvest
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Curating the world&apos;s most exceptional heritage grains.
            </p>
          </div>

          {/* Filters */}
          <div className="flex bg-[#F3F1EB] p-1.5 rounded-2xl border border-[#EFECE5] overflow-x-auto max-w-full">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                  activeType === type
                    ? "bg-[#6D634C] text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-105 rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-400 font-medium">
            No products found.
          </p>
        )}

        {/* Product List */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
