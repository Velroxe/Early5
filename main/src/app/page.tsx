"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

import HeroSection from "@/components/HeroSection";
import PhilosophyQuote from "@/components/PhilosophyQuote";
import FeaturesBar from "@/components/FeaturesBar";
import AgingStory from "@/components/AgingStory";
import ProductGrid from "@/components/ProductGrid";
import ReviewsGallery from "@/components/ReviewsGallery";

const HomePage: React.FC = () => {
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [activeType, setActiveType] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    if (!host) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${host}/api/products`);
        setProducts(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [host]);

  // Dynamic filter types
  const types = useMemo(() => {
    const uniqueTypes = new Set(products.map(p => p.type));
    return ["All", ...Array.from(uniqueTypes)];
  }, [products]);

  // Filtered products
  const filteredProducts =
    activeType === "All"
      ? products
      : products.filter(p => p.type === activeType);

  return (
    <>
      {/* HERO */}
      <HeroSection />

      {/* MANIFESTO */}
      <PhilosophyQuote />

      {/* FEATURES */}
      <FeaturesBar />

      {/* AGING STORY */}
      <AgingStory />

      {/* PRODUCTS */}
      <ProductGrid
        products={filteredProducts}
        types={types}
        activeType={activeType}
        loading={loading}
        error={error}
        onTypeChange={setActiveType}
        onProductClick={(id) => router.push(`/products/${id}`)}
      />

      {/* REVIEWS */}
      <ReviewsGallery />

    </>
  );
};

export default HomePage;
