import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Link from "next/link";

const TitleSection = ({ open, username, plan }) => {
  return (
    <div className="flex items-center justify-between rounded-md transition-colors">
      <div className="h-[42px] flex items-center gap-2">
        <Link
          href={"/"}
          className="grid size-[42px] shrink-0 place-content-center rounded-md hover:bg-slate-100"
        >
          <Logo className="w-8" />
        </Link>
        {open && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="flex flex-col"
          >
            <span className="block text-xs text-slate-800 font-bold">
              {username}
            </span>
            <span className="block text-xs text-slate-500">{plan}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TitleSection;
