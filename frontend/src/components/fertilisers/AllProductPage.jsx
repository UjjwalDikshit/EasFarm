import { useEffect, useState } from "react";
import { fetchProducts } from "./productApi";
import ProductFilterBar from "./ProductFilterBar";
import ProductList from "./ProductList";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  
  const limit = 10;

  useEffect(() => {
    loadProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadProducts = async (reset = false) => {
    try {
      const res = await fetchProducts({ page: reset ? 1 : page, limit, ...filters });

      if (reset) {
        setProducts(res.products);
        setPage(2);
      } else {
        setProducts((prev) => [...prev, ...res.products]);
        setPage((prev) => prev + 1);
      }

      setHasMore(res.currentPage < res.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ProductFilterBar onFilterChange={(f) => setFilters(f)} />
      <ProductList products={products} fetchMore={() => loadProducts()} hasMore={hasMore} />
    </div>
  );
}
