import InfiniteScroll from "react-infinite-scroll-component";
import ToolCard from "./ToolCard";
import { Tractor } from "lucide-react";

export default function ToolsList({ tools = [], fetchMore, hasMore }) {

  if (!tools.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/60">
        <div className="p-6 rounded-full bg-base-100 mb-4">
          <Tractor size={40} />
        </div>
        <h2 className="font-semibold">No machines available</h2>
        <p className="text-sm">Try changing filters</p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={tools.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<p className="text-center my-4">Loading...</p>}
      endMessage={<p className="text-center my-4">No more tools</p>}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
    >
      {tools.map((tool) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </InfiniteScroll>
  );
}