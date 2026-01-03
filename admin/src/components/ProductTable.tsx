"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { slicedText } from "@/lib/textUtils";
import { Product } from "@/lib/types";

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="table-container custom-scrollbar rounded-lg border bg-card shadow-sm">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="bg-muted/20 text-muted-foreground">
            <TableHead className="w-[150px] sticky top-0 z-10 bg-muted/20 backdrop-blur-sm">
              Preview
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted/20 backdrop-blur-sm">
              Title
            </TableHead>
            <TableHead className="w-40 sticky top-0 z-10 bg-muted/20 backdrop-blur-sm">
              Price (INR)
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted/20 backdrop-blur-sm">
              Type
            </TableHead>
            <TableHead className="w-[180px] text-right sticky top-0 z-10 bg-muted/20 backdrop-blur-sm">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length > 0 ? (
            products.map((p) => (
              <TableRow
                key={p.id}
                className="hover:bg-muted/10 transition-colors"
              >
                <TableCell>
                  <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 border shadow-sm">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  <a
                    href={`${process.env.NEXT_PUBLIC_ECOM_HOST}/products/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4 cursor-pointer hover:opacity-80"
                  >
                    {slicedText(p.title)}
                  </a>
                </TableCell>
                <TableCell>₹{p.price_inr}</TableCell>
                <TableCell>{p.type || "-"}</TableCell>

                <TableCell className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(p)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(p)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-sm text-muted-foreground"
              >
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
