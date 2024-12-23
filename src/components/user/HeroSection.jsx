export default function HeroSection() {
  return (
    <section className="grid max-w-screen-xl px-8 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
      <div className="mr-auto place-self-center lg:col-span-7">
        <h1 className="mb-4 text-slate-900 text-4xl font-semibold sm:mb-10 sm:text-5xl md:mb-8 lg:text-6xl">
          Buy, and sell products securely with ease.
        </h1>
        <p className="max-w-2xl mb-2 font-light text-gray-600 sm:mb-4 sm:text-xl lg:mb-4">
          Explore the latest products in our store and easily sell your own with
          total peace of mind!
        </p>
        <a
          href="#"
          className="bg-blue-500 inline-flex items-center justify-center px-4 py-2 text-base font-medium text-center text-white rounded-lg transition-colors duration-300 hover:bg-blue-600 focus:ring-4 focus:ring-blue-200"
        >
          Get started
        </a>
        <a
          href="#"
          className="inline-flex items-center justify-center mx-7 text-base font-semibold text-center text-slate-900 rounded-lg group transition-colors hover:text-blue-700"
        >
          Learn more
          <i className="fa-solid fa-arrow-right text-slate-800 ml-2 transition-all ease-out duration-300 group-hover:text-blue-600 group-hover:translate-x-2"></i>
        </a>
      </div>
      <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
        <img src="/assets/phone-mockup.png" alt="mockup" />
      </div>
    </section>
  );
}
