import React, { useEffect, useState } from "react";
import TransactionCard from "./TrasactionCard.jsx";
import { transactionAPI } from "./api";
import { Inbox } from "lucide-react";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await transactionAPI();
      if (res?.data) setTransactions(res.data);
    }

    fetchData();
  }, []);

  return (
    <div className="grid gap-4">
      {transactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Inbox size={40} className="mb-3 text-gray-400" />

          <p className="text-lg font-medium">No Transactions Yet</p>

          <p className="text-sm text-gray-400 mt-1">
            Your payment history will appear here
          </p>
        </div>
      )}
      {transactions.map((tx) => (
        <TransactionCard key={tx._id || tx.payment_id} transaction={tx} />
      ))}
    </div>
  );
}
