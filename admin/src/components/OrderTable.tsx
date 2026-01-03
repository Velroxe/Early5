"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { slicedText } from "@/lib/textUtils";
import { Order } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
  orders: Order[];
  onDelete: (order: Order) => void;
}

export default function OrderTable({ orders, onDelete }: Props) {
  const router = useRouter();

  return (
    <div className="table-container custom-scrollbar rounded-lg border bg-card shadow-sm">
      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow className="bg-muted/20 text-muted-foreground">
            <TableHead>Buyer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[140px] text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => {
              const totalQty = order.items.reduce(
                (sum, i) => sum + i.quantity,
                0
              );

              const totalAmount = order.items.reduce((sum, i) => {
                const price = i.discounted_price_inr ?? i.price_inr;
                return sum + price * i.quantity;
              }, 0);

              return (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/10 transition"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  {/* BUYER */}
                  <TableCell className="font-medium">
                    <div>{order.buyer_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.buyer_phone}
                    </div>
                  </TableCell>

                  {/* ITEMS */}
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <div
                          key={item.product_id}
                          className="text-sm"
                        >
                          {slicedText(item.product_title)} × {item.quantity}
                        </div>
                      ))}

                      {order.items.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* ORDER STATUS */}
                  <TableCell>
                    <StatusBadge value={order.order_status} />
                  </TableCell>

                  {/* PAYMENT STATUS */}
                  <TableCell>
                    <PaymentBadge value={order.payment_status} />
                  </TableCell>

                  {/* TOTAL */}
                  <TableCell className="font-medium">
                    ₹{totalAmount}
                    <div className="text-xs text-muted-foreground">
                      {totalQty} item{totalQty > 1 ? "s" : ""}
                    </div>
                  </TableCell>

                  {/* DATE */}
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(order);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------------- STATUS BADGES ---------------- */

function StatusBadge({ value }: { value: Order["order_status"] }) {
  const map: Record<string, string> = {
    confirmed: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${map[value]}`}>
      {value}
    </span>
  );
}

function PaymentBadge({ value }: { value: Order["payment_status"] }) {
  const map: Record<string, string> = {
    unpaid: "bg-gray-100 text-gray-800",
    paid: "bg-green-100 text-green-800",
    refunded: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${map[value]}`}>
      {value}
    </span>
  );
}
