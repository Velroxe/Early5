"use client";

import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  const host = process.env.NEXT_PUBLIC_BACKEND;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Product</h1>

      <ProductForm
        product={null}
        host={host!}
        loading={false}
        setLoading={() => {}}
        onSuccess={() => window.location.href = "/products"}
        onCancel={() => window.location.href = "/products"}
      />
    </div>
  );
}
