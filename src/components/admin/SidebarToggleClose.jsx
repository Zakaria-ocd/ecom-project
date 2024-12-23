import { motion } from "framer-motion";
import { FiChevronsRight } from "react-icons/fi";

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 flex items-center space-x-1 p-1 border-t border-slate-300 transition-colors hover:bg-slate-100 text-gray-800"
    >
      <motion.div layout className="text-lg px-4 py-3">
        <FiChevronsRight
          className={`text-slate-600 transition-transform ${
            open && "rotate-180"
          }`}
        />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-slate-600 text-xs font-bold"
        >
          Hide
        </motion.span>
      )}
    </motion.button>
  );
};

export default ToggleClose;
