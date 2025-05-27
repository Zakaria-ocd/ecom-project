export default function QuantityCalculator({
  productId,
  choiceValueId,
  itemQuantity,
  onQuantityChange,
  max = Infinity,
}) {
  function handleQuantityChange(increment) {
    const newQuantity =
      increment > 0
        ? Math.min(itemQuantity + increment, max)
        : Math.max(itemQuantity + increment, 1);

    onQuantityChange(productId, choiceValueId, newQuantity);
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => handleQuantityChange(-1)}
        disabled={itemQuantity <= 1}
        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 ${
          itemQuantity <= 1
            ? "bg-gray-100 cursor-not-allowed opacity-50"
            : "bg-gray-100 transition-colors hover:bg-gray-200"
        } dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600`}
      >
        <i className="fa-solid fa-minus text-gray-800 text-xs transition-colors dark:text-white"></i>
      </button>
      <span className="w-10 text-center text-sm font-medium text-gray-900 transition-colors dark:text-white">
        {itemQuantity}
      </span>
      <button
        type="button"
        onClick={() => handleQuantityChange(1)}
        disabled={itemQuantity >= max}
        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 ${
          itemQuantity >= max
            ? "bg-gray-100 cursor-not-allowed opacity-50"
            : "bg-gray-100 transition-colors hover:bg-gray-200"
        } dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600`}
      >
        <i className="fa-solid fa-plus text-gray-800 text-xs transition-colors dark:text-white"></i>
      </button>
    </div>
  );
}
