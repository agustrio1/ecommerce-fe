"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
    const shortDescription = desc.slice(0, 150) + (desc.length > 150 ? "..." : "");

    if (!isExpanded) {
      return (
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          {shortDescription}
        </p>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
      >
        {lines.map((line, index) => {
          const [title, ...contentParts] = line.split(":").map((item) => item.trim());
          const content = contentParts.join(":");

          if (!content) {
            return (
              <p key={index} className="text-gray-700 text-sm md:text-base leading-relaxed">
                {title}
              </p>
            );
          }

          return (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-lg p-3 transition-all duration-200 hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex-1">
                  <h6 className="font-semibold text-gray-900 text-sm md:text-base">
                    {title}
                  </h6>
                  <p className="text-gray-700 mt-1 text-sm md:text-base leading-relaxed">
                    {content}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <AnimatePresence>
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : "6rem" }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
          >
            {parseDescription(description)}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-sm md:text-base hover:bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2"
            onClick={toggleDescription}
          >
            {isExpanded ? "Sembunyikan" : "Lihat Selengkapnya"}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;

