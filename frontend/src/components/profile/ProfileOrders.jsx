import { useEffect, useState } from "react";
import { getMyOrders } from "./api";
import { Package, IndianRupee, Hash } from "lucide-react";

export default function ProfileOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders(1);
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="card bg-base-100 shadow border border-base-200">
      <div className="card-body">

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Package size={18} className="text-primary" />
          <h3 className="font-semibold text-base">Orders</h3>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o, i) => (
              <div
                key={i}
                className="p-4 border rounded-xl flex justify-between items-center hover:shadow-sm transition"
              >
                {/* Left */}
                <div className="space-y-1">
                  <p className="font-medium">{o.orderType}</p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Hash size={14} />
                    Qty: {o.quantity}
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-1 font-semibold text-primary">
                  <IndianRupee size={16} />
                  {o.price}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}