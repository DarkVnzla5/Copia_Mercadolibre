import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Outlet } from "react-router";

Chart.register(...registerables);

interface DashboardData {
  sales: number[];
  buys: number[];
  stock: number[];
  spends: number[];
  labels: string[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  // Replace with your API endpoint
  const { data } = await axios.get("/api/dashboard");
  return data;
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-error">
        <span>Error loading dashboard data.</span>
      </div>
    );
  }

  return (
    <section className="p-8 bg-base-200 min-h-screen">
      <section>
        <Outlet />
      </section>
      <p className="text-3xl font-bold mb-6">Panel de Control</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="card-title">Ventas</p>
            <Bar
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: "Sales",
                    data: data.sales,
                    backgroundColor: "#36d399",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
        {/* Buys Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="card-title">Compras</p>
            <Line
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: "Buys",
                    data: data.buys,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.2)",
                    fill: true,
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>
        {/* Stock Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="card-title">Inventario</p>
            <Doughnut
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: "Stock",
                    data: data.stock,
                    backgroundColor: [
                      "#fbbf24",
                      "#f87171",
                      "#60a5fa",
                      "#34d399",
                      "#a78bfa",
                    ],
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>
        {/* Spends Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Gastos</h2>
            <Bar
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: "Spends",
                    data: data.spends,
                    backgroundColor: "#f87171",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
