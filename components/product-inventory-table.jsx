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
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ProductInventoryPDF } from "./product-inventory-pdf";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Filter states - modified to use arrays for multi-select options
  const [filters, setFilters] = useState({
    name: [],
    color: "",
    size: [],
    stock: "",
    status: [],
  });

  // Get unique options for filters
  const productOptions = [
    ...new Set(orderedProducts.map((product) => product.name)),
  ];
  const sizeOptions = ["P", "M", "G", "GG"];
  const statusOptions = ["Urgente", "Atenção", "Estável"];

  // Filtered products
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(orderedProducts);
  }, [orderedProducts]);

  // Apply filters
  useEffect(() => {
    let result = [...orderedProducts];

    if (filters.name.length > 0) {
      result = result.filter((product) => filters.name.includes(product.name));
    }

    if (filters.color) {
      result = result.filter((product) =>
        product.color.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    if (filters.size.length > 0) {
      result = result.filter((product) => filters.size.includes(product.size));
    }

    if (filters.stock) {
      const stockNum = Number.parseInt(filters.stock);
      if (!isNaN(stockNum)) {
        result = result.filter((product) => product.stock <= stockNum);
      }
    }

    if (filters.status.length > 0) {
      result = result.filter((product) => {
        const status = getRestockStatus(product.size, product.stock);
        return status && filters.status.includes(status.status);
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [filters, orderedProducts]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
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
    const isCurrentlyEditing = editStates[productId] || false;
    setEditStates((prev) => ({
      ...prev,
      [productId]: !isCurrentlyEditing,
    }));
  };

  const handleTextFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleOptionFilter = (field, option) => {
    setFilters((prev) => {
      const currentOptions = [...prev[field]];
      const optionIndex = currentOptions.indexOf(option);

      if (optionIndex === -1) {
        // Add option
        return {
          ...prev,
          [field]: [...currentOptions, option],
        };
      } else {
        // Remove option
        currentOptions.splice(optionIndex, 1);
        return {
          ...prev,
          [field]: currentOptions,
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      name: [],
      color: "",
      size: [],
      stock: "",
      status: [],
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.name.length > 0 ||
    filters.color !== "" ||
    filters.size.length > 0 ||
    filters.stock !== "" ||
    filters.status.length > 0;

  // Count products with added units (either manual or suggestion)
  const productsWithAddedUnits = filteredProducts.filter((product) => {
    const manualInput = stockInputs[product.id]
      ? Number.parseInt(stockInputs[product.id], 10)
      : 0;
    const suggestion = product.stock_suggestion || 0;
    return manualInput > 0 || suggestion > 0;
  }).length;

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="bg-muted/40 p-4 rounded-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h3 className="text-lg font-medium mb-2 sm:mb-0">Filtros</h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar todos os filtros
              </Button>
            )}
            <ProductInventoryPDF
              products={filteredProducts}
              stockInputs={stockInputs}
              filters={filters}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Product Name Filter - Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Produto</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.name.length === 0
                    ? "Selecione os produtos"
                    : `${filters.name.length} selecionado${
                        filters.name.length > 1 ? "s" : ""
                      }`}

                  <ChevronLeft className="h-4 w-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Produtos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {productOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={filters.name.includes(option)}
                    onCheckedChange={() => toggleOptionFilter("name", option)}
                  >
                    {option}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Color Filter - Text Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cor</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtre por cor"
                value={filters.color}
                onChange={(e) =>
                  handleTextFilterChange("color", e.target.value)
                }
                className="pl-8"
              />
            </div>
          </div>

          {/* Size Filter - Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tamanho</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.size.length === 0
                    ? "Selecione os produtos"
                    : `${filters.size.length} selecionado${
                        filters.size.length > 1 ? "s" : ""
                      }`}
                  <ChevronLeft className="h-4 w-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Tamanhos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sizeOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={filters.size.includes(option)}
                    onCheckedChange={() => toggleOptionFilter("size", option)}
                  >
                    {option}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stock Filter - Text Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estoque (menos de)</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. 10"
                value={filters.stock}
                onChange={(e) =>
                  handleTextFilterChange(
                    "stock",
                    e.target.value.replace(/[^0-9]/g, "")
                  )
                }
                className="pl-8"
              />
            </div>
          </div>

          {/* Status Filter - Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.status.length === 0
                    ? "Select status"
                    : `${filters.status.length} selected`}
                  <ChevronLeft className="h-4 w-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={filters.status.includes(option)}
                    onCheckedChange={() => toggleOptionFilter("status", option)}
                  >
                    {option}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.name.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.name.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleOptionFilter("name", name)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {filters.size.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.size.map((size) => (
                <Badge
                  key={size}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  Tamanho: {size}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleOptionFilter("size", size)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {filters.status.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.status.map((status) => (
                <Badge
                  key={status}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  Status: {status}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleOptionFilter("status", status)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {filters.color && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Cor: {filters.color}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTextFilterChange("color", "")}
              />
            </Badge>
          )}

          {filters.stock && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Stock &lt; {filters.stock}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTextFilterChange("stock", "")}
              />
            </Badge>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {hasActiveFilters && (
            <div className="text-muted-foreground">
              Mostrando {filteredProducts.length} de {orderedProducts.length}{" "}
              produtos
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border" ref={tableRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Visual</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Adicionar Unidades</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const restockInfo = getRestockStatus(
                  product.size,
                  product.stock
                );
                const colorHex = getColorHex(product.color);
                const isEditing = editStates[product.id] || false;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
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
                          placeholder={
                            product.stock_suggestion?.toString() || "0"
                          }
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
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum produto corresponde aos seus filtros
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} de{" "}
            {filteredProducts.length} produtos
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <div className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
