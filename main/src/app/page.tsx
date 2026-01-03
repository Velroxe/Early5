"use client";

import ProductCard from "@/components/ProductCard";
import { Icons, REVIEWS } from "@/lib/constants";
import { Product } from "@/lib/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const Home = () => {
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("All");

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${host}/api/products`);
      setProducts(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Dynamic product types from API
  const types = useMemo(() => {
    const uniqueTypes = new Set(products.map(p => p.type));
    return ["All", ...Array.from(uniqueTypes)];
  }, [products]);

  // ✅ Filter products from API
  const filteredProducts =
    activeType === "All"
      ? products
      : products.filter(p => p.type === activeType);

  return (
    <>
      {/* HERO + FEATURES (unchanged) */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFECE5] text-[#6D634C] text-xs font-bold mb-6">
                <Icons.Leaf />
                ETHICALLY SOURCED HERITAGE GRAINS
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-8 tracking-tight">
                The Foundation of <span className="text-[#6D634C] italic serif font-normal">Every</span> Meal.
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                Early5 brings you premium, hand-selected rice varieties aged to perfection. Elevate your culinary experience with grains that define quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#shop" className="px-8 py-4 bg-[#6D634C] text-white rounded-xl font-bold hover:bg-[#5A513E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6D634C]/20">
                  Browse Collections
                  <Icons.ArrowRight />
                </a>
                <button className="px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-xl font-bold hover:border-gray-400 transition-all">
                  Our Sourcing Story
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 scale-95 transition-transform hover:rotate-0 duration-700">
                <img
                  src="/hero.webp"
                  alt="Premium Rice Grains"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <Icons.Shield />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Purity Certified</div>
                  <div className="font-black text-sm">100% Organic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section id="shop" className="py-24 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                The Heritage Selection
              </h2>
              <p className="text-gray-500 max-w-md">
                Each grain tells a story of the soil it was grown in.
              </p>
            </div>

            {/* ✅ Dynamic filters */}
            <div className="flex bg-[#EFECE5] p-1 rounded-xl overflow-x-auto">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeType === type
                      ? "bg-[#6D634C] text-white shadow-md"
                      : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Products from API */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => router.push(`/products/${product.id}`)}
              />
            ))}
          </div>

          {/* Error State */}
          {error && (
            <p className="text-red-500 text-center mt-8">{error}</p>
          )}
        </div>
      </section>

      {/* Testimonials (unchanged) */}
    </>
  );
};

export default Home;
