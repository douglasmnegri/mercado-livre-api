"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

// Color mapping from names to hex codes
const colorMap = {
  Vermelho: "#FF0000",
  "Verde Militar": "#4B5320",
  Marrom: "#8B4513",
  Laranja: "#FFA500",
  "Azul Bebê": "#00BFFF",
  "Cinza Mescla": "#9F9F9F",
  "Rosa Bebê": "#FF69B4",
  Rosa: "#FF69B4",
  "Amarelo Canário": "#FFFF00",
  "Azul-marinho": "#051057",
  "Azul-turquesa": "#40E0D0",
  Salmão: "#FA8072",
  "Cinza Chumbo": "#5A5A5A",
  Lilás: "#C8A2C8",
  Preto: "#000000",
  "Amarelo Ouro": "#FFD700",
  "Verde Bandeira": "#009E60",
  "Azul Royal": "#4169E1",
  "Rosa Pink": "#FF1493",
  Branco: "#f0ece8",
  "Verde-limão": "#ADFF2F",
  Roxo: "#800080",
  Bordô: "#800000",
  "Cinza Claro": "#D8D7D7",
  "Amarelo Bebê": "#F8F0CB",
  "Verde-claro": "#90EE90",
  "Azul-celeste": "#87CEEB",
  Verde: "#008000",
  "Verde-escuro": "#006400",
  Cinza: "#808080",
  // Add English color names for the sample data
  White: "#f0ece8",
  Black: "#000000",
  Red: "#FF0000",
  Navy: "#051057",
};

// Function to determine restock status
function getRestockStatus(stock) {
  if (stock <= 5) {
    return { status: "Urgent", variant: "destructive" };
  } else if (stock <= 15) {
    return { status: "Low", variant: "secondary" };
  } else {
    return { status: "Good", variant: "outline" };
  }
}

// Function to get color hex code from name
function getColorHex(colorName) {
  return colorMap[colorName] || "#CCCCCC"; // Default gray if color not found
}

export function ProductInventoryTable() {
  // Sample data - in a real app, this would come from your API
  const [products] = React.useState([
    { id: "1", name: "Cotton T-Shirt", color: "White", size: "S", stock: 3 },
    { id: "2", name: "Cotton T-Shirt", color: "White", size: "M", stock: 12 },
    { id: "3", name: "Cotton T-Shirt", color: "White", size: "L", stock: 25 },
    { id: "4", name: "Cotton T-Shirt", color: "Black", size: "S", stock: 8 },
    { id: "5", name: "Cotton T-Shirt", color: "Black", size: "M", stock: 20 },
    { id: "6", name: "Cotton T-Shirt", color: "Black", size: "L", stock: 15 },
    { id: "7", name: "Polyester T-Shirt", color: "Red", size: "S", stock: 5 },
    { id: "8", name: "Polyester T-Shirt", color: "Red", size: "M", stock: 18 },
    { id: "9", name: "Polyester T-Shirt", color: "Red", size: "L", stock: 22 },
    { id: "10", name: "Polo Shirt", color: "Navy", size: "S", stock: 7 },
    { id: "11", name: "Polo Shirt", color: "Navy", size: "M", stock: 14 },
    { id: "12", name: "Polo Shirt", color: "Navy", size: "L", stock: 30 },
  ]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Color Preview</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const restockInfo = getRestockStatus(product.stock);
            const colorHex = getColorHex(product.color);

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell>
                  <div
                    className="h-6 w-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: colorHex }}
                    title={`${product.color} (${colorHex})`}
                  />
                </TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell className="text-right">
                  {product.stock <= 5 ? (
                    <span className="flex items-center justify-end gap-1 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {product.stock}
                    </span>
                  ) : (
                    product.stock
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={restockInfo.variant}>
                    {restockInfo.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
