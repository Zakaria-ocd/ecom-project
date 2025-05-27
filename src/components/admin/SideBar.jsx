"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Option from "./SidebarOption";
import SidebarToggleClose from "./SidebarToggleClose";
import SidebarTitleSection from "./SidebarTitleSection";
import {
  FiHome,
  FiShoppingCart,
  FiMessageCircle,
  FiChevronDown,
  FiChevronLeft,
} from "react-icons/fi";
import { FaGear } from "react-icons/fa6";
import { TbDeviceAnalytics } from "react-icons/tb";
import { FaListUl, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { PiUsersThreeBold } from "react-icons/pi";

const Sidebar = ({ section = "Dashboard" }) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    products: false,
    users: false,
    orders: false,
  });
  const pathname = usePathname();

  useEffect(() => {
    setSelected(section);

    // Auto-expand sections based on current path
    if (pathname.includes("/products")) {
      setExpandedSections((prev) => ({ ...prev, products: true }));
    }
    if (pathname.includes("/users")) {
      setExpandedSections((prev) => ({ ...prev, users: true }));
    }
    if (pathname.includes("/orders")) {
      setExpandedSections((prev) => ({ ...prev, orders: true }));
    }
  }, [section, pathname]);

  const username = useSelector((state) => state.userReducer.username);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Animation variants for dropdown content
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      overflow: "hidden",
    },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: "0.25rem",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  // Check if a path is active
  const isActive = (path) => {
    if (path === "/admin/dashboard" && pathname === "/admin/dashboard")
      return true;
    if (path === "/admin/users" && pathname === "/admin/users") return true;
    if (path === "/admin/users/create" && pathname === "/admin/users/create")
      return true;
    if (path === "/admin/products" && pathname === "/admin/products")
      return true;
    if (path === "/admin/products/create" && pathname === "/admin/products/create")
      return true;
    if (path === "/admin/orders" && pathname === "/admin/orders") return true;
    return false;
  };

  return (
    <motion.nav
      layout
      className={`${
        open ? "w-36 md:w-44 lg:w-52" : "w-fit"
      } sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2`}
      animate={{ width: open ? "208px" : "59px" }}
      transition={{ duration: 0.3 }}
    >
      <SidebarTitleSection open={open} />

      <span className="w-full h-px bg-slate-300 block my-3"></span>

      <div className="space-y-1 flex flex-col h-[calc(100vh-180px)] overflow-y-auto pb-4">
        <Option
          Icon={FiHome}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
          href="/admin/dashboard"
        />

        {/* Users Section */}
        <div className="w-full">
          <button
            onClick={() => toggleSection("users")}
            className={`flex items-center w-full h-10 px-2 rounded-md text-xs font-semibold transition-colors ${
              pathname.includes("/users")
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <div className="text-lg pr-3 pl-1">
              <PiUsersThreeBold size={18} />
            </div>
            {open && (
              <>
                <span className="flex-1 text-left text-nowrap">Users</span>
                {expandedSections.users ? (
                  <FiChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                  <FiChevronLeft className="h-4 w-4 transition-transform" />
                )}
              </>
            )}
          </button>

          <AnimatePresence>
            {open && expandedSections.users && (
              <motion.div
                className="ml-7 space-y-1 border-l border-slate-200 pl-2"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link
                  href="/admin/users"
                  className={`flex items-center px-2 py-1.5 text-xs font-normal rounded-md ${
                    isActive("/admin/users")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FaListUl className="h-3 w-3 mr-2" />
                  <span className="text-nowrap">All Users</span>
                </Link>
                <Link
                  href="/admin/users/create"
                  className={`flex items-center px-2 py-1.5 text-xs font-normal rounded-md ${
                    isActive("/admin/users/create")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FaPlus className="h-3 w-3 mr-2" />
                  <span className="text-nowrap">Add User</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Section */}
        <div className="w-full">
          <button
            onClick={() => toggleSection("products")}
            className={`flex items-center w-full h-10 px-2 rounded-md text-xs font-semibold transition-colors ${
              pathname.includes("/products") ||
              pathname.includes("/products/create")
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <div className="text-lg pr-3 pl-1">
              <i className="fa-regular fa-boxes-stacked size-4 text-base"></i>
            </div>
            {open && (
              <>
                <span className="flex-1 text-left text-nowrap">Products</span>
                {expandedSections.products ? (
                  <FiChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                  <FiChevronLeft className="h-4 w-4 transition-transform" />
                )}
              </>
            )}
          </button>

          <AnimatePresence>
            {open && expandedSections.products && (
              <motion.div
                className="ml-7 space-y-1 border-l border-slate-200 pl-2"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link
                  href="/admin/products"
                  className={`flex items-center px-2 py-1.5 text-xs font-normal rounded-md ${
                    isActive("/admin/products")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FaListUl className="h-3 w-3 mr-2" />
                  <span className="text-nowrap">All Products</span>
                </Link>
                <Link
                  href="/admin/products/create"
                  className={`flex items-center px-2 py-1.5 text-xs font-normal rounded-md ${
                    isActive("/admin/products/create")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FaPlus className="h-3 w-3 mr-2" />
                  <span className="text-nowrap">Add Product</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Orders Section */}
        <div className="w-full">
          <button
            onClick={() => toggleSection("orders")}
            className={`flex items-center w-full h-10 px-2 rounded-md text-xs font-semibold transition-colors ${
              pathname.includes("/orders")
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <div className="text-lg pr-3 pl-1">
              <FiShoppingCart size={18} />
            </div>
            {open && (
              <>
                <span className="flex-1 text-left text-nowrap">Orders</span>
                {expandedSections.orders ? (
                  <FiChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                  <FiChevronLeft className="h-4 w-4 transition-transform" />
                )}
              </>
            )}
          </button>

          <AnimatePresence>
            {open && expandedSections.orders && (
              <motion.div
                className="ml-7 space-y-1 border-l border-slate-200 pl-2"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link
                  href="/admin/orders"
                  className={`flex items-center px-2 py-1.5 text-xs font-normal rounded-md ${
                    isActive("/admin/orders")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FaListUl className="h-3 w-3 mr-2" />
                  <span className="text-nowrap">All Orders</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Option
          Icon={ClipboardList}
          title="Seller Requests"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiMessageCircle}
          title="Messages"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
        />
        <Option
          Icon={TbDeviceAnalytics}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FaGear}
          title="Settings"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      <SidebarToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

export default Sidebar;
