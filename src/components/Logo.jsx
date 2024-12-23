import Image from "next/image";
import logo from "@/../public/assets/logo.png";

export default function Logo({ className = "" }) {
  return <Image src={logo} alt="logo" className={className} />;
}
