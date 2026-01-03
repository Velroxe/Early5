"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DashboardResponse = {
  orders: {
    summary: {
      total_orders: number;
      paid_orders: number;
      unpaid_orders: number;
      failed_orders: number;
      total_revenue: number;
    };
    byType: { order_type: "cod" | "online" | "whatsapp"; count: number }[];
    byStatus: { order_status: string; count: number }[];
    recent: {
      id: string;
      buyer_name: string;
      order_type: string;
      payment_status: string;
      order_status: string;
      total_amount: number;
      created_at: string;
    }[];
  };
  products: {
    total_products: number;
    discounted_products: number;
  };
};

export default function DashboardPage() {
  const host = process.env.NEXT_PUBLIC_BACKEND;

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DASHBOARD ---------------- */

  useEffect(() => {
    fetch(`${host}/api/dashboard`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard");
        return res.json();
      })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading dashboard…</div>;
  if (!data) return <div className="p-6">Failed to load dashboard</div>;

  const { orders, products } = data;

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button variant="outline" onClick={() => location.reload()}>
          Refresh
        </Button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Orders" value={orders.summary.total_orders} />
        <StatCard title="Paid Orders" value={orders.summary.paid_orders} />
        <StatCard title="Unpaid Orders" value={orders.summary.unpaid_orders} />
        <StatCard title="Failed Orders" value={orders.summary.failed_orders} />
        <StatCard
          title="Total Revenue"
          value={`₹${orders.summary.total_revenue}`}
        />
      </div>

      {/* PRODUCTS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Products"
          value={products.total_products}
        />
        <StatCard
          title="Discounted Products"
          value={products.discounted_products}
        />
      </div>

      {/* ORDER BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BY TYPE */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {orders.byType.map((o) => (
              <Row
                key={o.order_type}
                label={o.order_type.toUpperCase()}
                value={o.count}
              />
            ))}
          </CardContent>
        </Card>

        {/* BY STATUS */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {orders.byStatus.map((s) => (
              <Row
                key={s.order_status}
                label={capitalize(s.order_status)}
                value={s.count}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* RECENT ORDERS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.recent.length > 0 ? (
            orders.recent.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between border-b pb-2 last:border-b-0"
              >
                <div>
                  <div className="font-medium">{o.buyer_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.order_type.toUpperCase()} •{" "}
                    {capitalize(o.order_status)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">₹{o.total_amount}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No recent orders
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
