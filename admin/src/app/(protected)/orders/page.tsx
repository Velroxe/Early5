"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import OrderTable from "@/components/OrderTable";
import OrderForm from "@/components/OrderForm";
import { Order } from "@/lib/types";

export default function OrdersPage() {
  const host = process.env.NEXT_PUBLIC_BACKEND;

  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ORDERS ---------------- */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/orders`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();

    return (
      order.id.toLowerCase().includes(q) ||
      order.buyer_name.toLowerCase().includes(q) ||
      order.buyer_phone.toLowerCase().includes(q) ||
      (order.buyer_email || "").toLowerCase().includes(q) ||
      order.items.some((item) =>
        item.product_title.toLowerCase().includes(q)
      )
    );
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <Button onClick={() => setOpenForm(true)}>
          Create Order
        </Button>
      </div>

      {/* SEARCH */}
      <div>
        <input
          type="text"
          placeholder="Search by orderID, buyer, phone, email, or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 rounded-md border bg-background"
        />
      </div>

      {/* TABLE */}
      <OrderTable
        orders={filteredOrders}
        onDelete={async (order) => {
          if (!confirm("Delete this order?")) return;

          try {
            const res = await fetch(
              `${host}/api/orders/${order.id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

            if (!res.ok) throw new Error("Delete failed");

            fetchOrders();
          } catch (err) {
            console.error(err);
            alert("Failed to delete order");
          }
        }}
      />

      {/* CREATE ORDER MODAL */}
      <OrderForm
        open={openForm}
        onOpenChange={setOpenForm}
        host={host!}
        onSaved={() => {
          setOpenForm(false);
          fetchOrders();
        }}
      />
    </div>
  );
}
