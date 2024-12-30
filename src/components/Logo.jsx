import Image from "next/image";

export default function Logo({ className = "" }) {
  //test
  return <Image src={"/assets/logo.png"} alt="logo" className={className} />;
}
