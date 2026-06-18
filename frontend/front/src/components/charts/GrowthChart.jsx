import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js";

// Added 'Filler' to allow background color under the line
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function GrowthChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Startups Created",
        data: data.map((item) => item.startups),
        borderColor: "rgba(13, 110, 253, 1)", // Primary Blue
        backgroundColor: "rgba(13, 110, 253, 0.1)", // Light blue fill
        borderWidth: 3,
        pointBackgroundColor: "rgba(13, 110, 253, 1)",
        pointRadius: 4,
        fill: true, // Fills the area under the line
        tension: 0.4 // Makes the line smoothly curved instead of sharp angles
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default GrowthChart;