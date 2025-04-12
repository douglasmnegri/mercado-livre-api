import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductInventoryTable } from "./product-inventory-table";

export function AnalyticsContent({ orderedProducts }) {
  
  return (
    <div className="space-y-4">
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Current stock levels and status</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductInventoryTable orderedProducts={orderedProducts} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Detailed analytics will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Analytics content</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Metrics content</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
