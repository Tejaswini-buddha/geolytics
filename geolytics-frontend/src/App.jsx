import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Projects from "./pages/Projects";
import Login from "./pages/Login";

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-950 text-white">

        {/* Sidebar (hide on login) */}
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <div className="p-6">

            <Routes>

              {/* Public Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analysis"
                element={
                  <ProtectedRoute>
                    <Analysis />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />

              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/analysis" />} />

            </Routes>

          </div>
        </div>
      </div>
    </Router>
  );
}