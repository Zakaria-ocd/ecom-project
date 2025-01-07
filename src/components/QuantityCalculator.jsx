export default function QuantityCalculator({
  itemId,
  itemQuantity,
  onQuantityChange,
}) {
  function handleQuantityChange(increment) {
    const newQuantity = Math.max(itemQuantity + increment, 1);
    onQuantityChange(itemId, newQuantity);
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => handleQuantityChange(-1)}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <i className="fa-solid fa-minus text-gray-800 text-xs transition-colors dark:text-white"></i>
      </button>
      <span className="w-10 text-center text-sm font-medium text-gray-900 transition-colors dark:text-white">
        {itemQuantity}
      </span>
      <button
        type="button"
        onClick={() => handleQuantityChange(1)}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <i className="fa-solid fa-plus text-gray-800 text-xs transition-colors dark:text-white"></i>
      </button>
    </div>
  );
}
