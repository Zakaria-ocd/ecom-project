export default function ProductSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 place-self-center animate-pulse">
      <div className="w-full relative h-[350px] sm:h-72 flex flex-col justify-center items-center overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
      </div>

      <div className="relative w-full flex flex-col px-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4"></div>
        <div className="w-full flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/4"></div>
          <div className="flex items-center gap-1">
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 