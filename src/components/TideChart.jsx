import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function TideChart({ events }) {
  const labels = events.map((e) => e.date.format("DD HH:mm"));
  const data = {
    labels,
    datasets: [
      {
        label: "Tide height (m)",
        data: events.map((e) => e.height),
        borderColor: "blue",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="card">
      <h3>Tide Timeline (48h)</h3>
      <div style={{ height: 220 }}>
        <Line data={data} />
      </div>
    </div>
  );
}
