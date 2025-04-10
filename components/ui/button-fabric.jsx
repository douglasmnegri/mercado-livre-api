import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ChangeDataset({ dataset }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 border-solid border-black border-2"
    >
      Algodão
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`ml-1 h-4 w-4 transition-transform ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </Button>
  );
}
