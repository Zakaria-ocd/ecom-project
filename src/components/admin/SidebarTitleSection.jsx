import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useSelector } from "react-redux";

const TitleSection = ({ open }) => {
  const user = useSelector((state) => state.userReducer);

  return (
    <div className="flex items-center justify-between rounded-md transition-colors">
      <div className="h-[42px] flex items-center gap-x-1">
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
            className="flex flex-col gap-y-px"
          >
            <span className="block text-xs text-slate-700 font-bold">
              {user.username}
            </span>
            <span className="block text-xs text-slate-500 capitalize">{user.role} plan</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TitleSection;
