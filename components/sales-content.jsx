"use client";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample sales data
const salesData = [
  {
    product_id: "MLB5026163190",
    title: "Camiseta Click Camisetas Algodão Vortex Fio 30.1 Rosa Pink",
    size: "G",
    unit_price: 24.01,
    quantity_sold: 2,
    sale_date: "2025-04-20T17:20:11.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163191",
    title: "Camiseta Click Camisetas Algodão Premium Azul Marinho",
    size: "M",
    unit_price: 29.99,
    quantity_sold: 3,
    sale_date: "2025-04-20T16:45:22.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163192",
    title: "Camiseta Click Camisetas Algodão Vortex Fio 30.1 Branca",
    size: "P",
    unit_price: 22.5,
    quantity_sold: 5,
    sale_date: "2025-04-20T15:30:45.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163193",
    title: "Camiseta Click Camisetas Algodão Vortex Fio 30.1 Preta",
    size: "GG",
    unit_price: 24.01,
    quantity_sold: 4,
    sale_date: "2025-04-20T14:15:33.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163194",
    title: "Camiseta Click Camisetas Algodão Premium Verde Militar",
    size: "G",
    unit_price: 29.99,
    quantity_sold: 2,
    sale_date: "2025-04-20T13:10:18.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163195",
    title: "Camiseta Click Camisetas Algodão Vortex Fio 30.1 Amarela",
    size: "M",
    unit_price: 22.5,
    quantity_sold: 3,
    sale_date: "2025-04-20T12:05:42.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163196",
    title: "Camiseta Click Camisetas Algodão Premium Cinza",
    size: "P",
    unit_price: 29.99,
    quantity_sold: 1,
    sale_date: "2025-04-20T11:30:27.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163197",
    title: "Camiseta Click Camisetas Algodão Vortex Fio 30.1 Vermelha",
    size: "G",
    unit_price: 24.01,
    quantity_sold: 2,
    sale_date: "2025-04-20T10:45:15.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163198",
    title: "Camiseta Click Camisetas Algodão Premium Laranja",
    size: "M",
    unit_price: 29.99,
    quantity_sold: 1,
    sale_date: "2025-04-20T09:20:33.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    product_id: "MLB5026163199",
    title: "Camiseta Click Camisetas Algodão Vortex Fio 30.1 Roxa",
    size: "GG",
    unit_price: 24.01,
    quantity_sold: 3,
    sale_date: "2025-04-20T08:15:51.000-04:00",
    image: "/placeholder.svg?height=120&width=120",
  },
];

// Items per page
const ITEMS_PER_PAGE = 5;

export function SalesContent({ salesReport }) {
  console.log("SALES REPORT", salesReport);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(salesReport.length / ITEMS_PER_PAGE);

  // Get current items
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = salesReport.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPP 'at' p");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Data</CardTitle>
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
                  />
                  
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-lg line-clamp-2">
                    {sale.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Product ID:</span>
                      <span className="font-mono ml-1">{sale.product_id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-semibold ml-1">{sale.size}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Unit Price:</span>
                      <span className="font-semibold ml-1">
                        ${sale.unit_price}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
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
                        {/* ${(Number(sale.unit_price) * sale.quantity_sold).toFixed(2)} */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, salesData.length)} of{" "}
              {salesData.length} items
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
