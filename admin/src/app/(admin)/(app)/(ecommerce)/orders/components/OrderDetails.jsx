
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LuBoxes,
  LuLoader,
  LuPackageCheck,
  LuPackagePlus,
  LuPackageX,
  LuTruck,
} from "react-icons/lu";

const OrderDetails = () => {
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
      console.error("❌ Error fetching order stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const orderDetailsData = [
    {
      id: 1,
      count: stats?.totalOrders || 0,
      label: "Total Orders",
      icon: LuBoxes,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      id: 2,
      count: stats?.shippingOrders || 0,
      label: "Shipping Orders",
      icon: LuTruck,
      bgColor: "bg-secondary/10",
      textColor: "text-secondary",
    },
    {
      id: 3,
      count: stats?.pendingOrders || 0,
      label: "Pending Orders",
      icon: LuLoader,
      bgColor: "bg-warning/15",
      textColor: "text-warning",
    },
    {
      id: 4,
      count: stats?.newOrders || 0,
      label: "New Orders",
      icon: LuPackagePlus,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      id: 5,
      count: stats?.deliveredOrders || 0,
      label: "Delivered Orders",
      icon: LuPackageCheck,
      bgColor: "bg-success/10",
      textColor: "text-success",
    },
    {
      id: 6,
      count: stats?.cancelledOrders || 0,
      label: "Cancelled Orders",
      icon: LuPackageX,
      bgColor: "bg-danger/10",
      textColor: "text-danger",
    },
  ];

  if (loading)
    return (
      <div className="text-center p-5">
        <p>Loading order stats...</p>
      </div>
    );

  return (
    <div className="col-span-1">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {orderDetailsData.map(({ id, count, label, icon: Icon, bgColor, textColor }) => (
          <div key={id} className="card">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className={`btn size-12 text-15 ${bgColor} ${textColor}`}>
                  <Icon className="size-6" />
                </div>
                <div>
                  <h5 className="mb-1 text-base font-semibold text-default-800">
                    {count.toLocaleString()}
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

export default OrderDetails;
