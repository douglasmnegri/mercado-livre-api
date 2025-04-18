import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductInventoryTable } from "./product-inventory-table";
import { AlertCircle, CheckCircle, AlertTriangle, Package } from "lucide-react";

export function AnalyticsContent({ orderedProducts, minStock, stock }) {
  function getTotalSuggestion(products) {
    const mappedSuggestion = products.map((item) => item.stock_suggestion);
    const totalSuggestion = mappedSuggestion.reduce((acc, val) => {
      return acc + Number(val);
    }, 0);

    return totalSuggestion;
  }

  const statusCounts = {
    urgent: 0,
    attention: 0,
    stable: 0,
  };

  function getRestockStatus(size, stock) {
    const item = minStock.find((entry) => entry.size === size);

    if (!item) return null;

    const { min } = item;

    if (stock <= min * 0.2) {
      return (statusCounts.urgent += 1);
    } else if (stock <= min * 0.6) {
      return (statusCounts.attention += 1);
    } else {
      return (statusCounts.stable += 1);
    }
  }

  orderedProducts.map((item) => {
    return getRestockStatus(item.size, item.stock);
  });

  const totalProducts =
    statusCounts.urgent + statusCounts.attention + statusCounts.stable;

  // Mock data - replace with your actual calculations later

  return (
    <div className="space-y-4">
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Inventário de Mercadorias</CardTitle>
          <CardDescription>Estoque atual, sugestões para reposição e status</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductInventoryTable
            orderedProducts={orderedProducts}
            minStock={minStock}
          />
        </CardContent>
      </Card>

      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Análise do Inventário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Stock */}
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium text-sm">Estoque Total</h3>
              </div>
              <p className="text-2xl font-bold">{stock}</p>
              <p className="text-xs text-muted-foreground">
                Total de unidades armezanadas no Full
              </p>
            </div>

            {/* Total Suggestion */}
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium text-sm">Reposição Sugerida</h3>
              </div>
              <p className="text-2xl font-bold">
                {getTotalSuggestion(orderedProducts)}
              </p>
              <p className="text-xs text-muted-foreground">
                Total de unidades sugerida para reposição
              </p>
            </div>

            {/* Status Breakdown */}
            <div className="flex flex-col gap-3 rounded-lg border p-4 md:col-span-2">
              <h3 className="font-medium text-sm">Status do Estoque</h3>

              <div className="grid grid-cols-3 gap-4">
                {/* Urgent */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Urgente</span>
                  </div>
                  <p className="text-xl font-bold">{statusCounts.urgent}</p>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-destructive"
                      style={{
                        width: `${
                          (statusCounts.urgent / totalProducts) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Attention */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Atenção</span>
                  </div>
                  <p className="text-xl font-bold">{statusCounts.attention}</p>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{
                        width: `${
                          (statusCounts.attention / totalProducts) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Stable */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Estável</span>
                  </div>
                  <p className="text-xl font-bold">{statusCounts.stable}</p>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${
                          (statusCounts.stable / totalProducts) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mt-2">
                Total Products:{" "}
                {statusCounts.urgent +
                  statusCounts.attention +
                  statusCounts.stable}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
