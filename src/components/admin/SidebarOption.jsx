import { motion } from "framer-motion";
import Link from "next/link";

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => {
  return (
    <Link href={"/admin/category"}>
      <motion.button
        layout
        onClick={() => setSelected(title)}
        className={`relative flex h-fit w-full items-center rounded-md transition-colors ${
          selected === title
            ? "bg-indigo-100 text-indigo-800"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <div className="text-lg p-3">
          <Icon />
        </div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-semibold"
          >
            {title}
          </motion.span>
        )}

        {notifs && open && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            style={{ y: "-50%" }}
            transition={{ delay: 0.5 }}
            className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
          >
            {notifs}
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
};

export default Option;
