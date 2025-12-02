import { useEffect, useState } from "react";
import axios from "axios";
import {
  LuWallet,
  LuCheckCheck,
  LuCircleX,
  LuClock4,
  LuRotateCcw,
  LuTrendingUp,
} from "react-icons/lu";

const TransactionDetails = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactionStats();
  }, []);

  const fetchTransactionStats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions`
      );
      if (data.success) {
        const all = data.data;
        const statsObj = {
          total: all.length,
          success: all.filter((t) => t.status === "Success").length,
          failed: all.filter((t) => t.status === "Failed").length,
          pending: all.filter((t) => t.status === "Pending").length,
          refunded: all.filter((t) => t.status === "Refunded").length,
          amount: all.reduce((sum, t) => sum + (t.amount || 0), 0),
        };
        setStats(statsObj);
      }
    } catch (error) {
      console.error("❌ Error fetching transaction stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const transactionData = [
    {
      id: 1,
      count: stats?.total || 0,
      label: "Total Transactions",
      icon: LuWallet,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      id: 2,
      count: stats?.success || 0,
      label: "Successful",
      icon: LuCheckCheck,
      bgColor: "bg-success/10",
      textColor: "text-success",
    },
    {
      id: 3,
      count: stats?.pending || 0,
      label: "Pending",
      icon: LuClock4,
      bgColor: "bg-warning/15",
      textColor: "text-warning",
    },
    {
      id: 4,
      count: stats?.failed || 0,
      label: "Failed",
      icon: LuCircleX,
      bgColor: "bg-danger/10",
      textColor: "text-danger",
    },
    {
      id: 5,
      count: stats?.refunded || 0,
      label: "Refunded",
      icon: LuRotateCcw,
      bgColor: "bg-secondary/10",
      textColor: "text-secondary",
    },
    {
      id: 6,
      count: `₹${(stats?.amount || 0).toLocaleString()}`,
      label: "Total Amount",
      icon: LuTrendingUp,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
  ];

  if (loading)
    return (
      <div className="text-center p-5">
        <p>Loading transaction stats...</p>
      </div>
    );

  return (
    <div className="col-span-1">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {transactionData.map(({ id, count, label, icon: Icon, bgColor, textColor }) => (
          <div key={id} className="card">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className={`btn size-12 text-15 ${bgColor} ${textColor}`}>
                  <Icon className="size-6" />
                </div>
                <div>
                  <h5 className="mb-1 text-base font-semibold text-default-800">
                    {count}
                  </h5>
                  <p className="text-default-500 text-sm">{label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionDetails;
