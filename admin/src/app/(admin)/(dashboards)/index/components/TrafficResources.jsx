import React, { useEffect, useState, useMemo } from "react";
import ApexChartClient from "@/components/client-wrapper/ApexChartClient";
import { LuTrendingDown } from "react-icons/lu";
import axios from "axios";
import { useLayoutContext } from "@/context/useLayoutContext";

const TrafficResources = () => {
  const { theme } = useLayoutContext();
  const isDarkMode = theme === "dark";

  const [stats, setStats] = useState({
    careers: 0,
    dealerships: 0,
    contacts: 0,
    totalOrders: 0,
  });

  const goal = 2000;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [careerRes, dealerRes, contactRes, orderRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/career`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/dealership`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/orders/stat`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        careers: careerRes.data?.careers?.length || 0,
        dealerships: dealerRes.data?.dealerships?.length || 0,
        contacts: contactRes.data?.contacts?.length || 0,
        totalOrders:
          orderRes.data?.totalOrders ||
          orderRes?.data?.stats?.totalOrders ||
          0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const orderProgress = Math.min((stats.totalOrders / goal) * 100, 100).toFixed(
    1
  );

  // ✅ Use useMemo to update chart options automatically when theme changes
  const getOptions = useMemo(() => ({
    chart: { type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: { size: "55%" },
        track: { background: "#f3f4f6", strokeWidth: "100%" },
        dataLabels: {
          name: { fontSize: "13px", color: isDarkMode ? "#fff" : "#6b7280", offsetY: 8 },
          value: { show: true, fontSize: "18px", color: isDarkMode ? "#fff" : "#111827", formatter: () => "100%" },
          total: { show: true, label: "Total", color: isDarkMode ? "#fff" : "#111827", fontSize: "16px", formatter: () => "100%" },
        },
      },
    },
    stroke: { lineCap: "round" },
    labels: ["Careers", "Dealerships", "Contacts"],
    colors: ["#3b82f6", "#a855f7", "#10b981"],
  }), [isDarkMode]);

  const series = [stats.careers, stats.dealerships, stats.contacts];

  return (
    <div className="col-span-1 bg-card">
      <div className="card mb-5">
        <div className="card-header">
          <h6 className="card-title">Enquiry Overview</h6>
        </div>
        <div className="card-body">
          <div className="grid md:grid-cols-12 grid-cols-1">
            <div className="rounded-md md:col-span-7 col-span-1">
              <ApexChartClient
                getOptions={() => getOptions} // pass the updated options
                series={series}
                type="radialBar"
                height={240}
              />
            </div>
            {/* Stats summary */}
            <div className="md:col-span-5 bgdark:text-white col-span-1 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 size-3" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <p className="text-blue-500">Career Applications ({stats.careers})</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-purple-500 size-3" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <p className="text-purple-500">Dealership Requests ({stats.dealerships})</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-green-500 size-3" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <p className="text-green-500">Contact Submissions ({stats.contacts})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-lg font-semibold">
              Total Orders: {stats.totalOrders.toLocaleString()}
            </h5>
            <span className="px-2.5 py-0.5 text-xs rounded border bg-transparent border-danger/50 text-danger flex items-center gap-1">
              <LuTrendingDown className="size-3" />
              {100 - orderProgress}% left
            </span>
          </div>

          <h6 className="font-semibold text-default-900">
            Monthly Orders Goal ({goal})
          </h6>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-default-500 text-sm">Total Orders Progress</p>
              <h6 className="mb-0 text-primary">{orderProgress}%</h6>
            </div>
            <div className="w-full bg-default-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${orderProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficResources;
