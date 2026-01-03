"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductTable from "@/components/ProductTable";
import { Product } from "@/lib/types";
import { deleteImageFromSupabaseBucket } from "@/lib/supabaseUploadUtils";

export default function ProductsPage() {
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_BACKEND;

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${host}/api/products`, { credentials: "include" });
    const data = await res.json();
    setProducts(data);
    setFiltered(data);
  };

  useEffect(() => {
    const q = filter.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      )
    );
  }, [filter, products]);

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between gap-2 flex-col sm:flex-row">
        <Input
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-64"
        />

        <Button onClick={() => router.push("/products/new")}>
          Add Product
        </Button>
      </div>

      <ProductTable
        products={filtered}
        onEdit={(p) => router.push(`/products/${p.id}`)}
        onDelete={async (p) => {
          // console.log(p);
          const images = p.images;
          for (const img of images) {
            const path = img.split("/").pop();
            try {
              await deleteImageFromSupabaseBucket(path);
            } catch (err) {
              console.log("Failed to delete Supabase image:", err);
            }
          }
          await fetch(`${host}/api/products/${p.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          fetchProducts();
        }}
      />
    </div>
  );
}
