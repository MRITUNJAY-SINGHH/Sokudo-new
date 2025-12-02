import { useEffect, useState } from "react";
import axios from "axios";
import { LuPackage, LuPackageX, LuTruck, LuLoader } from "react-icons/lu";

const ProductOrderDetails = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/stat`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(data);
    } catch (error) {
      console.error("❌ Error fetching product order stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const orderStats = [
    {
      id: 1,
      icon: LuPackage,
      iconColor: "text-info",
      bgColor: "bg-info/10",
      value: stats?.totalOrders || 0,
      label: "Total Orders",
    },
    {
      id: 2,
      icon: LuLoader,
      iconColor: "text-warning",
      bgColor: "bg-warning/10",
      value: stats?.pendingOrders || 0,
      label: "Pending",
    },
    {
      id: 3,
      icon: LuTruck,
      iconColor: "text-success",
      bgColor: "bg-success/10",
      value: stats?.deliveredOrders || 0,
      label: "Delivered",
    },
    {
      id: 4,
      icon: LuPackageX,
      iconColor: "text-danger",
      bgColor: "bg-danger/10",
      value: stats?.cancelledOrders || 0,
      label: "Cancelled",
    },
  ];

  if (loading)
    return (
      <div className="text-center p-5">
        <p>Loading order stats...</p>
      </div>
    );

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
      {orderStats.map(({ id, icon: Icon, iconColor, bgColor, value, label }) => (
        <div className="card" key={id}>
          <div className="card-body">
            <div
              className={`flex items-center justify-center mx-auto rounded-full size-14 ${bgColor}`}
            >
              <Icon className={`size-6 ${iconColor}`} />
            </div>
            <h5 className="mt-4 text-center mb-2 text-default-800 font-semibold text-lg">
              {value.toLocaleString()}
            </h5>
            <p className="text-center text-sm text-default-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductOrderDetails;
