import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useSelector } from "react-redux";

const TitleSection = ({ open }) => {
  const user = useSelector((state) => state.userReducer);

  return (
    <Link
      href={"/"}
      className="flex items-center justify-between rounded-md mt-0.5"
    >
      <div className="h-10 flex items-center gap-x-1">
        <div className="grid w-10 shrink-0 place-content-center rounded-md">
          <Logo className="w-7" />
        </div>
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
    </Link>
  );
};

export default TitleSection;
