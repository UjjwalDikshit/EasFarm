import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "./ProductCard";
import { PackageX } from "lucide-react";


export default function ProductList({ products, fetchMore, hasMore }) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <div className="p-6 rounded-full bg-gray-100 mb-4">
          <PackageX size={40} />
        </div>

        <h2 className="text-lg font-semibold mb-1">
          No products found
        </h2>

        <p className="text-sm">
          Try changing filters or add new products
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<h4 className="text-center my-4">Loading...</h4>}
      endMessage={<p className="text-center my-4">No more products</p>}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
    >
      {products.map((p, index) => (
        <ProductCard key={`${p._id}-${index}`} product={p} />
      ))}
    </InfiniteScroll>
  );
}
