import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FaStar } from "react-icons/fa";

export function Products({ products }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-slate-800">Name</TableHead>
          <TableHead className="text-slate-800">Description</TableHead>
          <TableHead className="text-slate-800">Price</TableHead>
          <TableHead className="text-slate-800">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length !== 0 &&
          products.map((product) => {
            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium py-4 text-black/55">
                  {product.name}
                </TableCell>
                <TableCell className="text-black/55">
                  {product.description}
                </TableCell>
                <TableCell className="text-black/55">
                  ${product.price}
                </TableCell>
                <TableCell className="text-black/55">
                  <div className="flex items-center gap-1.5 capitalize text-[13.5px] font-medium">
                    <FaStar className="text-amber-400" size={12} />
                    {product.rating}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
