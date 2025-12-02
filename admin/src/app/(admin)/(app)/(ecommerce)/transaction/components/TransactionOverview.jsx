import { useEffect, useState } from "react";
import axios from "axios";
import ApexChartClient from "@/components/client-wrapper/ApexChartClient";

const TransactionOverview = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`);
      if (data.success) {
        const transactions = data.data;
        const monthly = Array(12).fill(0);
        transactions.forEach((t) => {
          const month = new Date(t.createdAt).getMonth();
          monthly[month]++;
        });
        setChartData({
          months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          series: [{ name: "Transactions", data: monthly }],
        });
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card p-4">Loading chart...</div>;

  const options = {
    chart: { type: "bar", toolbar: { show: false }, height: 200 },
    plotOptions: { bar: { borderRadius: 5, dataLabels: { position: "top" } } },
    dataLabels: { enabled: true, formatter: (val) => val },
    xaxis: { categories: chartData.months },
    colors: ["#0ea5e9"],
  };

  return (
    <div className=" rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-4 text-default-800">Transaction Overview</h2>
      <ApexChartClient
        getOptions={() => options}
        series={chartData.series}
        type="bar"
        height={200}
      />
    </div>
  );
};

export default TransactionOverview;
