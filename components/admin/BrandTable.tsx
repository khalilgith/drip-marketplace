"use client"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface Brand {
  id: string
  name: string
  slug: string
  approved: boolean
  featured: boolean
}

interface BrandTableProps {
  brands: Brand[]
  onEdit: (brand: Brand) => void
  onDelete: (id: string) => void
}

export function BrandTable({ brands, onEdit, onDelete }: BrandTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Approved</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brands.map((brand) => (
          <TableRow key={brand.id}>
            <TableCell className="font-medium">{brand.name}</TableCell>
            <TableCell>{brand.slug}</TableCell>
            <TableCell>
              <Badge variant={brand.approved ? "success" : "warning"}>
                {brand.approved ? "Approved" : "Pending"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={brand.featured ? "default" : "secondary"}>
                {brand.featured ? "Featured" : "Standard"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(brand)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(brand.id)}>
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
