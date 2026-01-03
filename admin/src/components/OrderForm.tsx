"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomModal } from "@/components/CustomModal";

type OrderType = "cod" | "online" | "whatsapp";

interface OrderItem {
  product_id: string;
  quantity: number;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  host: string;
  onSaved: () => void;
}

export default function OrderForm({
  open,
  onOpenChange,
  host,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [orderType, setOrderType] = useState<OrderType>("cod");

  const [buyer, setBuyer] = useState({
    buyer_name: "",
    buyer_address: "",
    buyer_phone: "",
    buyer_email: "",
  });

  const [items, setItems] = useState<OrderItem[]>([
    { product_id: "", quantity: 1 },
  ]);

  /* ---------------- ITEMS ---------------- */

  const addItem = () =>
    setItems((prev) => [...prev, { product_id: "", quantity: 1 }]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (
    index: number,
    field: keyof OrderItem,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderType !== "whatsapp" && items.length === 0) {
      return alert("Add at least one product");
    }

    setLoading(true);

    try {
      const payload: any = {
        buyer_name: buyer.buyer_name,
        buyer_phone: buyer.buyer_phone,
        order_type: orderType,
      };

      if (buyer.buyer_email) payload.buyer_email = buyer.buyer_email;

      if (orderType !== "whatsapp") {
        payload.buyer_address = buyer.buyer_address;
        payload.items = items.map((i) => ({
          product_id: i.product_id,
          quantity: Number(i.quantity) || 1,
        }));
      }

      const res = await fetch(`${host}/api/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create order");

      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Order"
      className="custom-scrollbar"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ORDER TYPE */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            className="w-full border rounded-md px-3 py-2 bg-background"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="online">Online Payment</option>
            <option value="whatsapp">WhatsApp Order</option>
          </select>
        </div>

        {/* BUYER INFO */}
        <Input
          placeholder="Buyer Name"
          value={buyer.buyer_name}
          onChange={(e) =>
            setBuyer({ ...buyer, buyer_name: e.target.value })
          }
          required
        />

        <Input
          placeholder="Phone Number"
          value={buyer.buyer_phone}
          onChange={(e) =>
            setBuyer({ ...buyer, buyer_phone: e.target.value })
          }
          required
        />

        <Input
          placeholder="Email (optional)"
          type="email"
          value={buyer.buyer_email}
          onChange={(e) =>
            setBuyer({ ...buyer, buyer_email: e.target.value })
          }
        />

        {orderType !== "whatsapp" && (
          <>
            <Textarea
              placeholder="Shipping Address"
              value={buyer.buyer_address}
              onChange={(e) =>
                setBuyer({ ...buyer, buyer_address: e.target.value })
              }
              required
            />

            {/* ITEMS */}
            <div className="space-y-3 pt-2">
              <div className="font-medium text-sm">Order Items</div>

              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center"
                >
                  <Input
                    className="sm:col-span-4"
                    placeholder="Product ID"
                    value={item.product_id}
                    onChange={(e) =>
                      updateItem(idx, "product_id", e.target.value)
                    }
                    required
                  />

                  <Input
                    type="number"
                    min={1}
                    className="sm:col-span-1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, "quantity", e.target.value)
                    }
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(idx)}
                    disabled={items.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                + Add Product
              </Button>
            </div>
          </>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
