"use client";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Items per page
const ITEMS_PER_PAGE = 5;

export function SalesContent({ salesReport }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(salesReport.length / ITEMS_PER_PAGE);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = salesReport.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="max-h-[600px] overflow-y-auto pr-2">
            {currentItems.map((sale) => (
              <div
                key={`${sale.product_id}-${sale.sale_date}`}
                className="flex items-center gap-4 p-4 border rounded-lg mb-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={sale.picture || "/placeholder.svg"}
                    alt={sale.title}
                    width={120}
                    height={120}
                    className="rounded-md object-cover"
                    style={{ width: 'auto' }} 

                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-lg line-clamp-2">
                    {sale.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID do Produto:</span>
                      <span className="font-mono ml-1">{sale.product_id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tamanho:</span>
                      <span className="font-semibold ml-1">{sale.size}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Preço Unitário:
                      </span>
                      <span className="font-semibold ml-1">
                        R$ {sale.unit_price}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantidade:</span>
                      <span className="font-semibold ml-1">
                        {sale.quantity_sold}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Sale Date:</span>
                      <span className="ml-1">{formatDate(sale.sale_date)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold text-base ml-1 text-green-600">
                        R$ {(Number(sale.unit_price) * sale.quantity_sold).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, salesReport.length)} of{" "}
              {salesReport.length} items
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
        </div>
      </CardContent>
    </Card>
  );
}
