import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Option = ({ Icon, title, selected, setSelected, open, notifs, href }) => {
  const pathname = usePathname();

  const linkHref = href || `/admin/${title.toLowerCase()}`;

  const isActive = () => {
    if (pathname === linkHref) return true;

    if (linkHref === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }

    const basePath = linkHref.replace("/admin/", "");
    if (basePath !== "dashboard" && pathname.includes(`/${basePath}`)) {
      return true;
    }

    if (title === "Analytics" && pathname.includes("/admin/analytics")) {
      return true;
    }

    return selected === title;
  };

  return (
    <Link href={linkHref}>
      <motion.button
        layout
        onClick={() => setSelected(title)}
        className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
          isActive()
            ? "bg-blue-50 text-cyan-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <div className="text-lg p-3">
          <Icon size={18} />
        </div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-semibold text-nowrap"
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
            transition={{ duration: 0.3 }}
            className="absolute right-2 top-1/2 size-4 rounded bg-blue-500 text-xs text-white flex items-center justify-center"
          >
            {notifs}
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
};

export default Option;
