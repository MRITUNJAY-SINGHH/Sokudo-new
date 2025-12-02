import { useEffect, useState } from "react";
import ApexChartClient from "@/components/client-wrapper/ApexChartClient";
import { LuMoveRight } from "react-icons/lu";
import { Link } from "react-router";
import axios from "axios";

const OrderStatistics = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Orders",
        data: [],
      },
    ],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveStats();

    // 🔁 Auto-refresh every 60 seconds
    const interval = setInterval(fetchLiveStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/stat`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Example: converting API data into chart format
      // You can modify keys based on your backend response
      const { newOrders, pendingOrders, deliveredOrders, cancelledOrders } = data;

      setChartData({
        series: [
          {
            name: "Orders",
            data: [
              newOrders || 0,
              pendingOrders || 0,
              deliveredOrders || 0,
              cancelledOrders || 0,
            ],
          },
        ],
        categories: ["New", "Pending", "Delivered", "Cancelled"],
      });
    } catch (error) {
      console.error("❌ Error fetching live order statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Chart Configuration
  const getChartOptions = () => ({
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
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
    colors: ["#3B82F6"], // primary blue
    dataLabels: { enabled: true },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    tooltip: {
      y: { formatter: (val) => `${val} Orders` },
    },
  });

  if (loading)
    return (
      <div className="col-span-1">
        <div className="card p-6 text-center text-gray-500">
          Loading order statistics...
        </div>
      </div>
    );

  return (
    <div className="col-span-1">
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h6 className="card-title">Order Statistics</h6>
          {/* <Link
            to="#"
            className="btn btn-sm border-0 text-primary/90 hover:text-primary"
          >
            View All
            <LuMoveRight className="ms-1 size-4" />
          </Link> */}
        </div>

        <div className="card-body">
          <ApexChartClient
            getOptions={getChartOptions}
            series={chartData.series}
            type="line"
            height={275}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics;
