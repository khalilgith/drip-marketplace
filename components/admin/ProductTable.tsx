"use client"

import { useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Pencil, Trash2 } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  featured: boolean
  brands: { name: string } | null
}

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.brands?.name || "-"}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{formatPrice(product.price)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Badge variant={product.featured ? "default" : "secondary"}>
                {product.featured ? "Featured" : "Standard"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
