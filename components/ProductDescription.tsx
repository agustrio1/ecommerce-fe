"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
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
    const lines = desc.split("\n").filter((line) => line.trim());
    const shortDescription =
      desc.slice(0, 100) + (desc.length > 100 ? "..." : "");

    if (!isExpanded) {
      return (
        <p className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg">
          {shortDescription}
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          const [title, ...contentParts] = line.split(":").map((item) => item.trim());
          const content = contentParts.join(":");

          if (!content) {
            return (
              <p
                key={index}
                className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg"
              >
                {title}
              </p>
            );
          }

          return (
            <div
              key={index}
              className="group rounded-lg p-2 transition-all duration-200 hover:bg-gray-50"
            >
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex-1">
                  <h6 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg">
                    {title}
                  </h6>
                  <p className="text-gray-700 mt-1 text-xs sm:text-sm md:text-base lg:text-lg">
                    {content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
        <div
          className={`transition-all duration-300 ${
            isExpanded ? "overflow-visible" : "overflow-hidden max-h-20"
          }`}
          onClick={toggleDescription}
          style={{ cursor: "pointer" }}
        >
          {parseDescription(description)}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        <div className="mt-2 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs sm:text-sm md:text-base hover:bg-gray-100 rounded-full px-4 py-1 flex items-center gap-1"
            onClick={toggleDescription}
          >
            {isExpanded ? "Sembunyikan" : "Lihat Selengkapnya"}
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
