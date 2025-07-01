import { motion } from "motion/react";
import React from "react";

interface FlashcardPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  maxWidthClass?: string; // e.g., "max-w-4xl"
  paddingYClass?: string; // e.g., "py-12"
  headerChildren?: React.ReactNode; // For additional elements in the header like view selectors
}

const FlashcardPageLayout: React.FC<FlashcardPageLayoutProps> = ({
  title,
  description,
  children,
  maxWidthClass = "max-w-4xl",
  paddingYClass = "py-12",
  headerChildren,
}) => {
  return (
    <div className={`${maxWidthClass} mx-auto px-6 ${paddingYClass}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-[#93A5CF] text-lg">{description}</p>
        {headerChildren && <div className="mt-8">{headerChildren}</div>}
      </motion.div>
      {children}
    </div>
  );
};

export default FlashcardPageLayout; 