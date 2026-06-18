import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function FundingChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Funding Required ($)",
        data: data.map((item) => item.amount),
        backgroundColor: "rgba(25, 135, 84, 0.6)", // Success Green
        borderColor: "rgba(25, 135, 84, 1)",
        borderWidth: 1,
        borderRadius: 4, // Gives the bars rounded corners
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false } // Hides the top legend since the title explains it
    }
  };

  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <h5 className="fw-bold mb-3 text-center">Funding Requirements</h5>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default FundingChart;