"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Order } from "@/lib/types";

const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;
const ORDER_STATUSES = [
  "confirmed",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const host = process.env.NEXT_PUBLIC_BACKEND;
  const ecomHost = process.env.NEXT_PUBLIC_ECOM_HOST;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [statusForm, setStatusForm] = useState({
    payment_status: "unpaid" as Order["payment_status"],
    order_status: "pending" as Order["order_status"],
  });

  /* ---------------- FETCH ORDER ---------------- */

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/orders/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch order");

      const data = await res.json();
      setOrder(data);
      setStatusForm({
        payment_status: data.payment_status,
        order_status: data.order_status,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-6">Loading order…</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  /* ---------------- TOTAL ---------------- */

  const totalAmount = order.items.reduce((sum, item) => {
    const price = item.discounted_price_inr ?? item.price_inr;
    return sum + price * item.quantity;
  }, 0);

  /* ---------------- UPDATE STATUS ---------------- */

  const saveStatus = async () => {
    try {
      const res = await fetch(
        `${host}/api/orders/${order.id}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(statusForm),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      setEditing(false);
      fetchOrder();
    } catch (err) {
      console.error(err);
      alert("Error updating order status");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <Button variant="outline" onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </div>

      {/* STATUS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status</CardTitle>
          {!editing && (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              Edit Status
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {!editing ? (
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Payment:</span>{" "}
                <span className="font-medium capitalize">
                  {order.payment_status}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Order:</span>{" "}
                <span className="font-medium capitalize">
                  {order.order_status}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">

              {/* PAYMENT */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Payment Status
                </label>
                <select
                  value={statusForm.payment_status}
                  onChange={(e) =>
                    setStatusForm({
                      ...statusForm,
                      payment_status: e.target.value as any,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* ORDER */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Order Status
                </label>
                <select
                  value={statusForm.order_status}
                  onChange={(e) =>
                    setStatusForm({
                      ...statusForm,
                      order_status: e.target.value as any,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setStatusForm({
                      payment_status: order.payment_status,
                      order_status: order.order_status,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveStatus}>Save</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {order.items.map((item) => {
            const price = item.discounted_price_inr ?? item.price_inr;

            return (
              <div
                key={item.product_id}
                className="flex justify-between border-b pb-3 last:border-b-0"
              >
                <div>
                  <a
                    href={`${ecomHost}/products/${item.product_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    {item.product_title}
                  </a>
                  <div className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </div>
                </div>

                <div className="font-medium">
                  ₹{price * item.quantity}
                </div>
              </div>
            );
          })}

          <div className="flex justify-end text-lg font-semibold pt-2">
            Total: ₹{totalAmount}
          </div>
        </CardContent>
      </Card>

      {/* BUYER */}
      <Card>
        <CardHeader>
          <CardTitle>Buyer Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <p>Name: {order.buyer_name}</p>
          <p>Phone: {order.buyer_phone}</p>
          {order.buyer_email && <p>Email: {order.buyer_email}</p>}
          <p>Address: {order.buyer_address}</p>
        </CardContent>
      </Card>
    </div>
  );
}
