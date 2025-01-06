import Image from "next/image";

export default function Logo({ className = "" }) {
  return <Image src={"/assets/logo.png"}  width={500} height={300} alt="logo" className={className} />;
}
