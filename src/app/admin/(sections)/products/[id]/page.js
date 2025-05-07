"use client";

import Product from "@/components/admin/products/Product";
import { use } from "react";

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  return <Product productId={productId} />;
}
