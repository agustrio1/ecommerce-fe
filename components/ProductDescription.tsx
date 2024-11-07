"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  const parseDescription = (desc: string) => {
    const shortDescription = desc.slice(0, 100) + (desc.length > 100 ? "..." : "");

    return (
      <div className="text-gray-700">
        {isExpanded ? (
          desc.split("\n").map((line, index) => {
            const [title, content] = line.split(":").map((item) => item.trim());
            return (
              <div key={index} className="mb-1">
                <h6 className="font-semibold text-sm lg:text-lg text-gray-800">{title}</h6>
                <p className="text-gray-600 ml-4">{content}</p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-700">{shortDescription}</p>
        )}
      </div>
    );
  };

  return (
    <div className="text-sm md:text-md lg:text-lg space-y-1">
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-screen opacity-100" : "max-h-20 opacity-80"
        }`}>
        {parseDescription(description)}
      </div>
      {description.length > 100 && (
        <Button
          onClick={toggleDescription}
          className="flex items-center gap-1 font-semibold mt-2"
        >
          {isExpanded ? "Sembunyikan Deskripsi" : "Lihat Deskripsi Lengkap"}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 transition-transform duration-200" />
          )}
        </Button>
      )}
    </div>
  );
};

export default ProductDescription;
