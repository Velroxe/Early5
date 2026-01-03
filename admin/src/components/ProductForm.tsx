"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteImageFromSupabaseBucket,
  uploadImageToSupabaseBucket,
} from "@/lib/supabaseUploadUtils";
import { Product } from "@/lib/types";

import { ReactSortable } from "react-sortablejs";

type ImageItem = {
  id: string;
  url: string;
  isNew?: boolean;
  file?: File;
  supabasePath?: string;
  toDelete?: boolean;
};

interface Props {
  product: Product | null;
  host: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  host,
  loading,
  setLoading,
  onSuccess,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_inr: "",
    discounted_price_inr: "",
    type: "",
  });

  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ------------------------------------------------------
  // LOAD PRODUCT (EDIT MODE)
  // ------------------------------------------------------
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price_inr: String(product.price_inr),
        discounted_price_inr: product.discounted_price_inr
          ? String(product.discounted_price_inr)
          : "",
        type: product.type || "",
      });

      const loadedImages: ImageItem[] = product.images.map((imgObj: any) => {
        const path =
          imgObj.image_url.split("/storage/v1/object/public/")[1] || "";

        return {
          id: imgObj.id,
          url: imgObj.image_url,
          isNew: false,
          supabasePath: path,
          toDelete: false,
        };
      });

      setImages(loadedImages);
    } else {
      setFormData({
        title: "",
        description: "",
        price_inr: "",
        discounted_price_inr: "",
        type: "",
      });
      setImages([]);
    }
  }, [product]);

  // ------------------------------------------------------
  // ADD NEW IMAGES (PREVIEW ONLY)
  // ------------------------------------------------------
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newImgs = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
      isNew: true,
      toDelete: false,
    }));

    setImages((prev) => [...prev, ...newImgs]);
  };

  // ------------------------------------------------------
  // MARK IMAGE FOR REMOVAL
  // ------------------------------------------------------
  const markImageForRemoval = (img: ImageItem) => {
    setImages((prev) =>
      prev.map((i) =>
        i.id === img.id ? { ...i, toDelete: true } : i
      )
    );
  };

  // ------------------------------------------------------
  // SUBMIT FORM
  // ------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalUrls: string[] = [];

      // STEP 1 → BUILD ORDERED ARRAY BASED ON UI ORDER
      for (const img of images) {
        if (img.toDelete) continue;

        if (img.isNew && img.file) {
          // Upload new images
          const uploaded = await uploadImageToSupabaseBucket(img.file);
          finalUrls.push(uploaded.publicUrl);
        } else {
          // Keep existing images
          finalUrls.push(img.url);
        }
      }

      // STEP 2 → Delete removed existing images
      for (const img of images) {
        if (!img.isNew && img.toDelete && img.supabasePath) {
          try {
            await deleteImageFromSupabaseBucket(img.supabasePath);
          } catch (err) {
            console.log("Delete failed:", err);
          }
        }
      }

      // STEP 3 → Make payload (just array of URLs, ordered)
      const payload = {
        title: formData.title,
        description: formData.description,
        price_inr: Number(formData.price_inr),
        discounted_price_inr: formData.discounted_price_inr
          ? Number(formData.discounted_price_inr)
          : null,
        type: formData.type,
        images: finalUrls, // ORDERED ARRAY OF STRINGS
      };

      const method = product ? "PUT" : "POST";
      const url = product
        ? `${host}/api/products/${product.id}`
        : `${host}/api/products`;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed saving product");

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------
  // UI
  // ------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        rows={4}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Price (INR)"
          type="number"
          value={formData.price_inr}
          onChange={(e) =>
            setFormData({ ...formData, price_inr: e.target.value })
          }
        />

        <Input
          placeholder="Discounted Price (INR)"
          type="number"
          value={formData.discounted_price_inr}
          onChange={(e) =>
            setFormData({
              ...formData,
              discounted_price_inr: e.target.value,
            })
          }
        />

        <Input
          placeholder="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
      </div>

      {/* ADD IMAGES */}
      <Button type="button" onClick={() => fileInputRef.current?.click()}>
        Add Images
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* SORTABLE GRID */}
      <ReactSortable
        list={images}
        setList={setImages}
        animation={200}
        easing="ease-out"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3"
      >
        {images
          .filter((img) => !img.toDelete)
          .map((img) => (
            <div key={img.id} className="border p-2 rounded cursor-move">
              <img src={img.url} className="w-full h-40 object-cover rounded" />

              <Button
                size="sm"
                variant="destructive"
                className="mt-2 w-full cursor-pointer"
                onClick={() => markImageForRemoval(img)}
              >
                Remove
              </Button>
            </div>
          ))}
      </ReactSortable>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 pt-3">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
