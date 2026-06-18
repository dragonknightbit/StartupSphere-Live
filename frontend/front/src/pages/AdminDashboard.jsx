import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DomainChart from '../components/charts/DomainChart';
import DashboardLayout from '../components/layout/DashboardLayout';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, startupsRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/admin/users'),
        API.get('/admin/startups')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStartups(startupsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const approveStartup = async (id) => {
    try {
      await API.put(`/admin/startups/${id}/approve`);
      setStartups(startups.map(s => s._id === id ? { ...s, status: 'Approved' } : s));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStartup = async (id) => {
    if (!window.confirm('Delete this startup?')) return;
    try {
      await API.delete(`/admin/startups/${id}`);
      setStartups(startups.filter(s => s._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !stats) {
    return <div className="container mt-5">Loading Dashboard...</div>;
  }

  const domainChartData = stats.startupsByDomain.map(d => ({
    name: d._id,
    count: d.count
  }));

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'admin' };

  return (
    <DashboardLayout role="admin" userName={user.name}>
      <div className="mb-5">
        
        {/* Top Metrics Row */}
        <div className="startup-grid mb-5">
          <div className="metric-card">
            <span className="metric-title">Total Users</span>
            <span className="metric-value" style={{ color: 'var(--primary)' }}>{stats.totalUsers}</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Startups</span>
            <span className="metric-value" style={{ color: 'var(--secondary)' }}>{stats.totalStartups}</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Mentors</span>
            <span className="metric-value" style={{ color: 'var(--accent)' }}>{stats.totalMentors}</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Investors</span>
            <span className="metric-value" style={{ color: '#06B6D4' }}>{stats.totalInvestors}</span>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <div className="glass-panel p-4 h-100">
              <h5 className="fw-bold mb-4">Startups by Domain</h5>
               <div style={{ height: "300px", width: "100%" }} className="d-flex justify-content-center">
                 <DomainChart data={domainChartData} />
               </div>
            </div>
          </div>
        </div>

        <h4 className="fw-bold mb-3 mt-5">Manage Users</h4>
        <div className="glass-panel p-0 mb-5 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 border-0">
              <thead style={{ background: 'var(--bg-color)' }}>
                <tr>
                  <th className="border-0">Name</th>
                  <th className="border-0">Email</th>
                  <th className="border-0">Role</th>
                  <th className="border-0">Joined Date</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="border-0 align-middle fw-medium">{u.name}</td>
                    <td className="border-0 align-middle text-muted">{u.email}</td>
                    <td className="border-0 align-middle"><span className="badge badge-premium bg-primary-soft text-primary">{u.role}</span></td>
                    <td className="border-0 align-middle text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="border-0 align-middle">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h4 className="fw-bold mb-3 mt-5">Manage Startups</h4>
        <div className="glass-panel p-0 mb-5 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 border-0">
              <thead style={{ background: 'var(--bg-color)' }}>
                <tr>
                  <th className="border-0">Title</th>
                  <th className="border-0">Domain</th>
                  <th className="border-0">Stage</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Founder</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {startups.map(s => (
                  <tr key={s._id}>
                    <td className="border-0 align-middle fw-medium">{s.title}</td>
                    <td className="border-0 align-middle text-muted">{s.domain}</td>
                    <td className="border-0 align-middle text-muted">{s.stage}</td>
                    <td className="border-0 align-middle">
                      <span className={`badge badge-premium ${s.status === 'Approved' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="border-0 align-middle text-muted">{s.founder?.name}</td>
                    <td className="border-0 align-middle">
                      {s.status !== 'Approved' && (
                        <button className="btn btn-sm btn-success me-2" onClick={() => approveStartup(s._id)}>Approve</button>
                      )}
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteStartup(s._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;