import InfiniteScroll from "react-infinite-scroll-component";
import ToolCard from "./ToolCard";

export default function ToolsList({ tools = [], fetchMore, hasMore }) {
    // if (!Array.isArray(tools)) {
    //     return null;
    // }

    return (
        <InfiniteScroll
            dataLength={tools.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<h4 className="text-center my-4 text-black">Loading...</h4>}
            endMessage={<p className="text-center my-4 text-black">No more tools</p>}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
        >
            {tools.map((tool) => (
                <ToolCard key={tool._id} tool={tool} />
            ))}
        </InfiniteScroll>
    );
}