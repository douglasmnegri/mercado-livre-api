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

  White: "#f0ece8",
  Black: "#000000",
  Red: "#FF0000",
  Navy: "#051057",
};

const minStock = { P: "10", M: "20", G: "40", GG: "30" };

// Function to determine restock status
function getRestockStatus(size, stock) {
  if (stock < minStock[size] * 0.2) {
    return { status: "Urgente", variant: "destructive" };
  } else if (stock < minStock[size] * 0.6) {
    return { status: "Atenção", variant: "secondary" };
  } else {
    return { status: "Estável", variant: "outline" };
  }
}

function getStockSuggestion(size, stock) {
  const min = parseInt(minStock[size], 10);
  return Math.ceil(Math.max(0, min - stock) / 5) * 5;
}

function getColorHex(colorName) {
  return colorMap[colorName] || "#CCCCCC";
}

export function ProductInventoryTable({ orderedProducts }) {
  console.log("ORDER PRODUCTS", orderedProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30); // Show 30 products per page
  const tableRef = useRef(null);
  const [stockInputs, setStockInputs] = useState({});
  const [buttonState, setButtonState] = useState(true);

  // Calculate total pages
  const totalPages = Math.ceil(orderedProducts.length / productsPerPage);

  // Get current products
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

  // Handle stock input change
  const handleStockInputChange = (productId, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setStockInputs({
      ...stockInputs,
      [productId]: numericValue,
    });
  };

  const handleAddButtonClick = (productId) => {
    buttonState == true ? setButtonState(false) : setButtonState(true);
    const amount = Number.parseInt(stockInputs[productId] || 0, 10);
    if (amount > 0) {
      console.log(
        `Button clicked for product ${productId} with amount: ${amount}`
      );

      setStockInputs({
        ...stockInputs,
        [productId]: "",
      });
    }
  };

  // Reset to page 1 if products change
  useEffect(() => {
    setCurrentPage(1);
  }, [orderedProducts]);

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
                        disabled={buttonState}
                        type="text"
                        value={stockInputs[product.id] || ""}
                        onChange={(e) =>
                          handleStockInputChange(product.id, e.target.value)
                        }
                        className="w-16 h-8"
                        placeholder={getStockSuggestion(
                          product.size,
                          product.stock
                        ).toString()}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 py-0"
                        onClick={() => handleAddButtonClick(product.id)}
                      >
                        <Plus className="h-3.5 w-3.5 " />
                        {buttonState ? "Editar" : "Salvar"}
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
