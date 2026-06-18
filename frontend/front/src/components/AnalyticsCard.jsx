function AnalyticsCard({ title, value }) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body d-flex flex-column justify-content-center">
        <h6 className="card-subtitle mb-2 text-muted text-uppercase fw-semibold">{title}</h6>
        <h1 className="card-title display-5 fw-bold text-dark mb-0">{value}</h1>
      </div>
    </div>
  );
}

export default AnalyticsCard;