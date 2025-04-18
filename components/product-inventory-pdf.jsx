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

      const title = "Reposição de Produtos - Mercado Livre";
      doc.setFontSize(18);
      doc.text(title, 14, 22);

      const now = new Date();
      const date = `${String(now.getDate()).padStart(2, "0")}/${String(
        now.getMonth() + 1
      ).padStart(2, "0")}/${String(now.getFullYear()).slice(-2)}`;

      doc.setFontSize(11);
      doc.text(`Gerado em: ${date}`, 14, 30);

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
          doc.text(`• Produto: ${filters.name}`, 18, yPos);
          yPos += 5;
        }

        if (filters.color) {
          doc.setFontSize(10);
          doc.text(`• Cor: ${filters.color}`, 18, yPos);
          yPos += 5;
        }

        if (filters.size) {
          doc.setFontSize(10);
          doc.text(`• Tamanho: ${filters.size}`, 18, yPos);
          yPos += 5;
        }

        if (filters.stock) {
          doc.setFontSize(10);
          doc.text(`• Estoque: ${filters.stock}`, 18, yPos);
          yPos += 5;
        }

        yPos += 5;
      }

      // Prepare table data - use stock_suggestion as fallback when no manual input
      const tableColumn = ["Nome", "Cor", "Tamanho", "Estoque", "Reposição"];
      const tableRows = products.map((product) => {
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

        autoTable(doc, {
          startY: yPos,
          head: [tableColumn.slice(0, 5)],
          body: tableRows.map((row) => row.slice(0, 5)),
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

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);

        const totalUnitsToAdd = rowsWithUnits.reduce(
          (sum, row) => sum + Number.parseInt(row[4], 10),
          0
        );

        doc.text(
          `Modelos para Reposição: ${rowsWithUnits.length}`,
          14,
          finalY
        );
        doc.text(
          `Total de Unidades: ${totalUnitsToAdd}`,
          14,
          finalY + 7
        );
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
      {isGenerating ? "Generating PDF..." : "Exportar Reposição"}
    </Button>
  );
}
