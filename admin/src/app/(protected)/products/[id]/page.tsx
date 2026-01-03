"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import { Product } from "@/lib/types";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const host = process.env.NEXT_PUBLIC_BACKEND;

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`${host}/api/products/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

      <ProductForm
        product={product}
        host={host!}
        loading={false}
        setLoading={() => {}}
        onSuccess={() => (window.location.href = "/products")}
        onCancel={() => (window.location.href = "/products")}
      />
    </div>
  );
}
