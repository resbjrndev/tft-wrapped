import { motion } from "framer-motion";

interface TFTButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
}: TFTButtonProps) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="relative px-8 py-3 font-bold text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />

      <span className="relative z-10 drop-shadow-md">{children}</span>
    </motion.button>
  );
};
