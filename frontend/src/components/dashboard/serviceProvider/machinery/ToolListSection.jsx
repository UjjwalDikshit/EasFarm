import { useEffect, useState } from "react";
import axios from "axios";
import ToolCard from "./ToolCard";
import { Wrench } from "lucide-react";
import axiosClient from "../../../../utils/axiosClient";

export default function ToolListSection({ enabled }) {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTools = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.get("/service/get-my-tools");
      setTools(res.data.tools || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) fetchTools();
  }, [enabled]);

  if (loading) return <p>Loading tools...</p>;

  if (!tools.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <div className="bg-base-200 p-6 rounded-full mb-4">
          <Wrench size={40} />
        </div>

        <h2 className="text-lg font-semibold mb-1">No tools posted yet</h2>

        <p className="text-sm">Start by adding your first machinery for rent</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard
          key={tool._id}
          tool={tool}
          onDelete={(id) =>
            setTools((prev) => prev.filter((t) => t._id !== id))
          }
        />
      ))}
    </div>
  );
}
