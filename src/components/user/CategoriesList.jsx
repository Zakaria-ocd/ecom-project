import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function CategoriesList({ categories = [], loading = false }) {
  if (loading) {
    return (
      <div className="container py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Categories</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border p-6 dark:bg-slate-800 dark:border-slate-700"
              >
                <Skeleton className="h-7 w-3/4 mb-4" />
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="container py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Categories</h1>
          <div className="bg-white rounded-lg border p-6 text-center dark:bg-slate-800 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400">
              No categories found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">{category.name}</h2>
                <Badge variant="secondary" className="ml-auto">
                  {category.product_count || 0} products
                </Badge>
              </div>
              <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                {category.description || "Browse products in this category"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
