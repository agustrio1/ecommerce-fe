'use client'

import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

export function FilterButton() {
  return (
    <motion.button 
      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Filter className="w-5 h-5 mr-2" />
      Filter
    </motion.button>
  );
}

