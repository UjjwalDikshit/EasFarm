import { useEffect, useState } from "react";
import { fetchTools } from "./ToolsApi";
import FilterBar from "./FilterBar";
import ToolList from "./ToolList";

export default function AllToolsPage() {
  const [tools, setTools] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  
  const limit = 10;

  useEffect(() => {
    loadTools(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadTools = async (reset = false) => {
    try {
      let res = await fetchTools({ page: reset ? 1 : page, limit, ...filters });
      res = res.data;
      
      if (reset) {
        setTools(res.tools);
        setPage(2);
      } else {
        setTools((prev) => [...prev, ...res.tools]);
        setPage((prev) => prev + 1);
      }

      setHasMore(res.currentPage < res.totalPages);
    } catch (err) {
      console.error("Error fetching tools:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <FilterBar onFilterChange={(f) => setFilters(f)} />
      <ToolList tools={tools} fetchMore={() => loadTools()} hasMore={hasMore} />
    </div>
  );
}
