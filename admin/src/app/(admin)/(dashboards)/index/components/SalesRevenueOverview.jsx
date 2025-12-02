import { useEffect, useState } from "react";
import ApexChartClient from "@/components/client-wrapper/ApexChartClient";
import { LuMoveRight } from "react-icons/lu";
import { Link } from "react-router";
import axios from "axios";

const TransactionStatistics = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Transactions",
        data: [],
      },
    ],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactionStats();

    // 🔁 Auto-refresh every 60 seconds
    const interval = setInterval(fetchTransactionStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTransactionStats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions`
      );

      if (data.success && Array.isArray(data.data)) {
        const all = data.data;

        // ✅ Count by status
        const total = all.length;
        const success = all.filter((t) => t.status === "Success").length;
        const failed = all.filter((t) => t.status === "Failed").length;
        const pending = all.filter((t) => t.status === "Pending").length;

        // ✅ Prepare chart data
        setChartData({
          series: [
            {
              name: "Transactions",
              data: [total, success, failed, pending],
            },
          ],
          categories: ["Total", "Successful", "Failed", "Pending"],
        });
      }
    } catch (error) {
      console.error("❌ Error fetching transaction statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Chart Configuration
  const getChartOptions = () => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        columnWidth: "40%",
      },
    },
    stroke: {
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: "#888",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(0),
        style: { colors: "#888", fontSize: "12px" },
      },
    },
    colors: ["#3B82F6"], // blue theme
    dataLabels: { enabled: true },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    tooltip: {
      y: { formatter: (val) => `${val} Transactions` },
    },
  });

  if (loading)
    return (
      <div className="col-span-1">
        <div className="card p-6 text-center text-gray-500">
          Loading transaction statistics...
        </div>
      </div>
    );

  return (
    <div className="lg:col-span-2 col-span-1">
      <div className="card">
        {/* Header */}
        <div className="card-header flex justify-between items-center">
          <h6 className="card-title">Transaction Statistics</h6>
          <Link
            to="#"
            className="btn btn-sm border-0 text-primary/90 hover:text-primary"
          >
            View All
            <LuMoveRight className="ms-1 size-4" />
          </Link>
        </div>

        {/* Body */}
        <div className="card-body">
          <ApexChartClient
            getOptions={getChartOptions}
            series={chartData.series}
            type="bar"
            height={275}
          />

          {/* Footer Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 bgdark:text-white gap-4 mt-5 text-center">
            {chartData.categories.map((label, index) => (
              <div key={index}>
                <p className="text-sm  mb-1">{label}</p>
                <h5 className="font-semibold ">
                  {chartData.series[0].data[index]}
                </h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistics;
