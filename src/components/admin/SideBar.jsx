"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Option from "./SidebarOption";
import SidebarToggleClose from "./SidebarToggleClose";
import SidebarTitleSection from "./SidebarTitleSection";
import { FiHome, FiShoppingCart, FiMessageCircle } from "react-icons/fi";
import { FaGear } from "react-icons/fa6";
import { TbUserDollar, TbDeviceAnalytics } from "react-icons/tb";
import { MdAddCard } from "react-icons/md";
import { useSelector } from "react-redux";

const Sidebar = ({section='Dashboard'}) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("");
  useEffect(()=>{
    setSelected(section)
  },[section])
  const username = useSelector((state) => state.userReducer.username);
  return (
    <motion.nav
      layout
      className={`sticky top-0 h-screen shrink-0 ${
        open ? "w-36 md:w-44 lg:w-52" : "w-fit"
      } border-r border-slate-300 bg-white p-2`}
      animate={{ width: open ? "208px" : "59px" }}
      transition={{ duration: 0.3 }}
    >
      <SidebarTitleSection
        open={open}
      />

      <span className="w-full h-px bg-slate-300 block my-3"></span>

      <div className="space-y-1">
        <Option
          Icon={FiHome}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={TbUserDollar}
          title="Sellers"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiShoppingCart}
          title="Orders"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={MdAddCard}
          title="Seller Request"
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
