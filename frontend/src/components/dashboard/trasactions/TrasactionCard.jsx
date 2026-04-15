import React from "react";
import { CheckCircle, XCircle, CreditCard, User, Hash, Calendar } from "lucide-react";

export default function TransactionCard({ transaction }) {
    if (!transaction) return null;

    const isPaid = transaction.status === "paid";

    return (
        <div className="border rounded-xl p-5 shadow-sm bg-grey flex flex-col gap-3 hover:shadow-md transition">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Hash size={18} className="text-gray-500" />
                    <h3 className="font-semibold text-gray-100">
                        {transaction.order_id}
                    </h3>
                </div>

                <div
                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full ${
                        isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {isPaid ? (
                        <CheckCircle size={14} />
                    ) : (
                        <XCircle size={14} />
                    )}
                    {transaction.status}
                </div>
            </div>

            {/* Payment ID */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard size={16} />
                <span>{transaction.payment_id}</span>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{transaction.customer}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={14} />
                <span>
                    {new Date(transaction.createdAt).toLocaleString()}
                </span>
            </div>
        </div>
    );
}