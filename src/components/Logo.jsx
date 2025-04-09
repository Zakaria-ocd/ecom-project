import Image from "next/image";

export default function Logo({ className = "" }) {
  return (
    <div className="flex items-center gap-1">
      <Image
        src={"/assets/logo.png"}
        width={500}
        height={300}
        alt="logo"
        className={className}
      />
      <span className="bg-gradient-to-br bg-colored-gradient-text bg-clip-text text-transparent font-semibold text-lg">
        3z shop
      </span>
    </div>
  );
}
