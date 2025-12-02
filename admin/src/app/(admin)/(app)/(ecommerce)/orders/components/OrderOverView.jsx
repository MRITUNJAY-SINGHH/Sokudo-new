import { useEffect, useState } from "react";
import axios from "axios";
import ApexChartClient from "@/components/client-wrapper/ApexChartClient";

const OrderOverView = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/overview`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChartData(data);
    } catch (error) {
      console.error(" Error fetching order overview:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="card p-4">
        <p>Loading chart...</p>
      </div>
    );

  const options = {
    chart: { type: "bar", toolbar: { show: false }, height: 190 },
    plotOptions: {
      bar: {
        borderRadius: 5,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
      style: { fontSize: "12px" },
    },
    xaxis: {
      categories: chartData.months,
      position: "bottom",
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    grid: { padding: { bottom: -10 } },
    colors: ["#2b7fff"],
  };

  return (
    <div className="lg:col-span-1 col-span-1">
      <div className="card">
        <div className="card-header">
          <h6 className="car-title">Orders Overview</h6>
        </div>
        <div className="card-body">
          <ApexChartClient
            getOptions={() => options}
            series={chartData.series}
            type="bar"
            height={190}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderOverView;
