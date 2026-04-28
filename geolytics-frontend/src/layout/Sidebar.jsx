import { LayoutDashboard, BarChart3, Folder } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {
  const navItemClass = ({ isActive }) =>
    `
    flex items-center gap-3 px-4 py-3 rounded-xl
    transition-all duration-300
    ${
      isActive
        ? "bg-orange-500 text-white shadow-lg"
        : "hover:bg-white/10 text-gray-300"
    }
  `;

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-gradient-to-b
        from-black
        via-gray-950
        to-gray-900
        text-white
        p-6
        border-r
        border-gray-800
        shadow-2xl
      "
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-orange-400 tracking-wide">
          GEOlytics
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Generative Engine Optimization
        </p>
      </motion.div>

      {/* Navigation */}
      <nav className="space-y-4">

        <NavLink
          to="/dashboard"
          className={navItemClass}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/analysis"
          className={navItemClass}
        >
          <BarChart3 size={20} />
          <span>Analysis</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={navItemClass}
        >
          <Folder size={20} />
          <span>Projects</span>
        </NavLink>

      </nav>

      {/* Footer */}
      <div className="absolute bottom-8 left-6 text-xs text-gray-500">
        GEOlytics v1.0
      </div>
    </aside>
  );
}