"use client";

import { Icons } from "@/lib/constants";
import { useCart } from "@/lib/context/CartContext";
import { Product } from "@/lib/types";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 👀 Sticky logic
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // ✅ Fetch product
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${host}/api/products/${id}`);
      const images = res.data.images.map((i: any) => i.image_url);
      setProduct({ ...res.data, images });
      setSelectedImage(images[0]);
    } catch {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // 👁 Intersection Observer for sticky CTA
  useEffect(() => {
    if (!buttonRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCTA(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(buttonRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return <div className="pt-32 text-center text-gray-500">Loading product…</div>;
  }

  if (error || !product) {
    return <div className="pt-32 text-center text-red-500">{error}</div>;
  }

  const hasDiscount = product.discounted_price_inr < product.price_inr;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <>
      <div className="pt-24 sm:pt-32 pb-32 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#6D634C] mb-8 group"
          >
            <div className="rotate-180 group-hover:-translate-x-1 transition-transform">
              <Icons.ArrowRight />
            </div>
            Back to Collection
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border shadow-sm">
                <img src={selectedImage} className="w-full h-full object-cover" />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 ${
                        selectedImage === img
                          ? "border-[#6D634C]"
                          : "border-transparent opacity-60"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <span className="bg-[#EFECE5] text-[#6D634C] px-3 py-1 rounded-full text-xs font-bold w-fit mb-4">
                {product.type}
              </span>

              <h1 className="text-3xl sm:text-4xl font-black mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-[#6D634C]">
                  ₹{product.discounted_price_inr}
                </span>
                {hasDiscount && (
                  <>
                    <span className="line-through text-gray-400">
                      ₹{product.price_inr}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
                      Save{" "}
                      {Math.round(
                        ((product.price_inr - product.discounted_price_inr) /
                          product.price_inr) *
                          100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-10">{product.description}</p>

              {/* Quantity */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex border rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3">-</button>
                  <span className="px-6 py-3 font-bold border-x">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3">+</button>
                </div>
              </div>

              {/* Normal Button (sentinel here) */}
              <div ref={buttonRef}>
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    isAdded
                      ? "bg-green-600 text-white"
                      : "bg-[#6D634C] text-white hover:bg-[#5A513E]"
                  }`}
                >
                  {isAdded
                    ? "Added to Bag!"
                    : `Add to Bag — ₹${product.discounted_price_inr * quantity}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔒 Sticky CTA (only when original not visible) */}
      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-4 sm:hidden">
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              isAdded
                ? "bg-green-600 text-white"
                : "bg-[#6D634C] text-white"
            }`}
          >
            {isAdded
              ? "Added to Bag!"
              : `Add to Bag — ₹${product.discounted_price_inr * quantity}`}
          </button>
        </div>
      )}
    </>
  );
};

export default ProductPage;
