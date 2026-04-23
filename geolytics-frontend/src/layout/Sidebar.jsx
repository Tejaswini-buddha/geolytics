import { LayoutDashboard, BarChart3, Folder } from "lucide-react";

export default function Sidebar({ setPage }) {
  return (
    <div className="w-64 bg-gradient-to-b from-black to-gray-900 
                    text-white h-screen p-6 border-r border-gray-800">

      <h1 className="text-2xl font-bold text-orange-400 mb-10">
        GEOlytics
      </h1>

      <div className="space-y-4">

        <button onClick={() => setPage("dashboard")}
          className="flex items-center gap-3 p-3 rounded-lg 
                     hover:bg-white/10 transition">
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <button onClick={() => setPage("analysis")}
          className="flex items-center gap-3 p-3 rounded-lg 
                     hover:bg-white/10 transition">
          <BarChart3 size={18} /> Analysis
        </button>

        <button onClick={() => setPage("projects")}
          className="flex items-center gap-3 p-3 rounded-lg 
                     hover:bg-white/10 transition">
          <Folder size={18} /> Projects
        </button>

      </div>

    </div>
  );
}