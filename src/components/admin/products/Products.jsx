import ProductCard from "./ProductCard";

export function Products({ products }) {
  return (
    <>
      {/* <div className="border rounded-2xl shadow-sm p-4 w-[300px] bg-white flex flex-col gap-3">
        <div className="relative bg-gray-100 rounded-xl h-48 flex items-center justify-center">
          <span className="text-gray-400">Image</span>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
            1 of 4
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Apple iMac 27</h3>
          <p className="text-sm text-gray-500 mt-1">
            Apple M3 Octa Core, 23.8inch, RAM 8GB, SSD 256GB, macOS Sonoma
          </p>
        </div>

        <div className="text-xs text-blue-600">
          Buy in installments with Flowbite Wallet
        </div>

        <div className="text-xl font-bold">$1199</div>

        <div className="flex items-center gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border-2 ${
                selectedColor === color ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button className="flex-1 py-2 border rounded-lg text-gray-700 text-sm">
            Wishlist
          </button>
          <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Buy now
          </button>
        </div>
      </div> */}
      <div className="flex flex-wrap justify-between gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
