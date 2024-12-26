import Image from "next/image";
import heroImage from "@/../public/assets/heroImage.png";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex justify-between items-center gap-0 px-12 py-16">
      <div className="w-full md:w-7/12">
        <h1 className="min-w-[474px] mb-4 text-slate-800 text-4xl text-start font-semibold sm:text-5xl sm:mb-10 md:mb-8 lg:min-w-[592px] lg:text-6xl">
          Buy, and sell products securely with ease.
        </h1>
        <p className="mb-2 font-light text-gray-600 sm:mb-4 sm:text-lg md:text-xl lg:mb-4">
          Explore the latest products in our store and easily sell your own with
          total peace of mind!
        </p>
        <Link
          href="#"
          className="bg-blue-500 inline-flex items-center justify-center px-4 py-2 text-base font-medium text-center text-white rounded-lg transition-colors duration-300 hover:bg-blue-600 focus:ring-4 focus:ring-blue-200"
        >
          Get started
        </Link>
        <Link
          href="#"
          className="inline-flex items-center justify-center mx-7 text-base font-semibold text-center text-slate-900 rounded-lg group transition-colors hover:text-blue-700"
        >
          Learn more
          <i className="fa-solid fa-arrow-right text-slate-800 ml-2 transition-all ease-out duration-300 group-hover:text-blue-600 group-hover:translate-x-2"></i>
        </Link>
      </div>
      <Image src={heroImage} alt="mockup" className="w-5/12 hidden md:block" />
    </section>
  );
}
