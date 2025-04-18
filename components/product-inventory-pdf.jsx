"use client";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useState } from "react";

export function ProductInventoryPDF({ products, stockInputs, filters = {} }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      // Dynamically import jsPDF and jsPDF-AutoTable to reduce bundle size
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      // Create a new PDF document
      const doc = new jsPDF();

      // Add title
      const title = "Product Restock Order";
      doc.setFontSize(18);
      doc.text(title, 14, 22);

      // Add date
      const date = new Date().toLocaleDateString();
      doc.setFontSize(11);
      doc.text(`Generated on: ${date}`, 14, 30);

      // Add filter information if filters are active
      let yPos = 38;
      const hasActiveFilters = Object.values(filters).some(
        (filter) => filter !== ""
      );

      if (hasActiveFilters) {
        doc.setFontSize(12);
        doc.text("Applied Filters:", 14, yPos);
        yPos += 6;

        if (filters.name) {
          doc.setFontSize(10);
          doc.text(`• Product Name: ${filters.name}`, 18, yPos);
          yPos += 5;
        }

        if (filters.color) {
          doc.setFontSize(10);
          doc.text(`• Color: ${filters.color}`, 18, yPos);
          yPos += 5;
        }

        if (filters.size) {
          doc.setFontSize(10);
          doc.text(`• Size: ${filters.size}`, 18, yPos);
          yPos += 5;
        }

        if (filters.stock) {
          doc.setFontSize(10);
          doc.text(`• Stock (less than): ${filters.stock}`, 18, yPos);
          yPos += 5;
        }

        yPos += 5;
      }

      // Prepare table data - use stock_suggestion as fallback when no manual input
      const tableColumn = [
        "Product Name",
        "Color",
        "Size",
        "Current Stock",
        "Units to Add",
        "Source",
      ];
      const tableRows = products.map((product) => {
        // Get units to add - use manual input if available, otherwise use stock_suggestion
        const manualInput = stockInputs[product.id]
          ? Number.parseInt(stockInputs[product.id], 10)
          : 0;
        const suggestion = product.stock_suggestion || 0;
        const unitsToAdd = manualInput > 0 ? manualInput : suggestion;
        const source =
          manualInput > 0 ? "Manual" : suggestion > 0 ? "Suggestion" : "None";

        return [
          product.name,
          product.color,
          product.size,
          product.stock.toString(),
          unitsToAdd.toString(),
          source,
        ];
      });

      // Filter out rows with zero units to add
      const rowsWithUnits = tableRows.filter(
        (row) => Number.parseInt(row[4], 10) > 0
      );

      if (rowsWithUnits.length === 0) {
        doc.setFontSize(12);
        doc.text("No units to add for any products.", 14, yPos);
        yPos += 10;

        // Generate the table with all products
        autoTable(doc, {
          startY: yPos,
          head: [tableColumn.slice(0, 5)], // Remove the Source column
          body: tableRows.map((row) => row.slice(0, 5)), // Remove the Source column
          headStyles: {
            fillColor: [75, 75, 75],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
          margin: { top: 10 },
        });
      } else {
        // Generate the table with products that have units to add
        autoTable(doc, {
          startY: yPos,
          head: [tableColumn],
          body: rowsWithUnits,
          headStyles: {
            fillColor: [75, 75, 75],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
          margin: { top: 10 },
        });

        // Add summary information
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);

        // Calculate total units being added
        const totalUnitsToAdd = rowsWithUnits.reduce(
          (sum, row) => sum + Number.parseInt(row[4], 10),
          0
        );

        // Count manual vs suggestion sources
        const manualCount = rowsWithUnits.filter(
          (row) => row[5] === "Manual"
        ).length;
        const suggestionCount = rowsWithUnits.filter(
          (row) => row[5] === "Suggestion"
        ).length;

        doc.text(
          `Total Products to Restock: ${rowsWithUnits.length}`,
          14,
          finalY
        );
        doc.text(`Total Units to Add: ${totalUnitsToAdd}`, 14, finalY + 7);
        doc.text(`Manual Entries: ${manualCount}`, 14, finalY + 14);
        doc.text(`Suggestion-based: ${suggestionCount}`, 14, finalY + 21);
      }

      // Save the PDF
      doc.save("product-restock-order.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      {isGenerating ? "Generating PDF..." : "Export Restock Order"}
    </Button>
  );
}
