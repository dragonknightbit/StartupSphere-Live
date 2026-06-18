import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DomainChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Startup Domains",
        data: data.map((item) => item.count),
        backgroundColor: [
          "rgba(13, 110, 253, 0.7)",  // Bootstrap Primary Blue
          "rgba(25, 135, 84, 0.7)",   // Bootstrap Success Green
          "rgba(255, 193, 7, 0.7)",   // Bootstrap Warning Yellow
          "rgba(220, 53, 69, 0.7)",   // Bootstrap Danger Red
        ],
        borderColor: [
          "rgba(13, 110, 253, 1)",
          "rgba(25, 135, 84, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(220, 53, 69, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <h5 className="fw-bold mb-3 text-center">Startup Domains</h5>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

export default DomainChart;