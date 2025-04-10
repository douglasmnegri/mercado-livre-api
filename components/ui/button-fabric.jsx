import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChangeDataset({ fabricType, onFabricChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{fabricType}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Produtos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onFabricChange("poly")}>
          Camiseta Poliéster
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFabricChange("polo")}>
          Camiseta Polo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFabricChange("cott")}>
          Camiseta Algodão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
