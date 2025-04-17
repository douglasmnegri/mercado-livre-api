"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
};

function getColorHex(colorName) {
  return colorMap[colorName] || "#CCCCCC";
}

export function ProductInventoryTable({ orderedProducts, minStock }) {
  function getRestockStatus(size, stock) {
    const item = minStock.find((entry) => entry.size === size);

    if (!item) return null;

    const { min } = item;

    if (stock <= min * 0.2) {
      return { status: "Urgente", variant: "destructive" };
    } else if (stock <= min * 0.6) {
      return { status: "Atenção", variant: "secondary" };
    } else {
      return { status: "Estável", variant: "outline" };
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30);
  const tableRef = useRef(null);

  // Estado para inputs personalizados
  const [stockInputs, setStockInputs] = useState({});
  // Estado para controlar edição individual de inputs
  const [editStates, setEditStates] = useState({});

  const totalPages = Math.ceil(orderedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = orderedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const scrollToTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToTable();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTable();
    }
  };

  const handleStockInputChange = (productId, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setStockInputs((prev) => ({
      ...prev,
      [productId]: numericValue,
    }));
  };

  const toggleEditState = (productId) => {
    setEditStates((prev) => ({
      ...prev,
      [productId]: !prev[productId], // Alterna apenas o estado desse produto
    }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border" ref={tableRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Color Preview</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Add Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => {
              const restockInfo = getRestockStatus(product.size, product.stock);
              const colorHex = getColorHex(product.color);
              const isEditing = editStates[product.id] || false;

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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={!isEditing}
                        type="text"
                        value={stockInputs[product.id] ?? ""}
                        onChange={(e) =>
                          handleStockInputChange(product.id, e.target.value)
                        }
                        className="w-16 h-8"
                        placeholder={product.stock_suggestion.toString()}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 py-0"
                        onClick={() => toggleEditState(product.id)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        {isEditing ? "Salvar" : "Editar"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, orderedProducts.length)} of{" "}
            {orderedProducts.length} products
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
