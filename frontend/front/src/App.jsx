import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import StartupDashboard from "./pages/StartupDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import StartupsBrowse from "./pages/StartupsBrowse";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/startups" element={<StartupsBrowse />} />
          
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/startup" element={<ProtectedRoute roles={['founder']}><StartupDashboard /></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute roles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
          <Route path="/investor" element={<ProtectedRoute roles={['investor']}><InvestorDashboard /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;