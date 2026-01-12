import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "./ProductCard";

export default function ProductList({ products, fetchMore, hasMore }) {
  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<h4 className="text-center my-4">Loading...</h4>}
      endMessage={<p className="text-center my-4">No more products</p>}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
    >
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </InfiniteScroll>
  );
}
