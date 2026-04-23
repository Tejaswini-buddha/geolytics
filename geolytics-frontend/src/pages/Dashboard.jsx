import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import KPI from "../components/KPI";
import Chart from "../components/Chart";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard-metrics");
        setData(res.data);
      } catch (err) {
        console.error(err);

        // fallback demo data (so UI never breaks)
        setData({
          kpis: {
            geo_score: 82,
            aeo_score: 78,
            brand_influence: 85,
            citation_visibility: 76,
          },
          citation_trend: [
            { month: "Jan", score: 60 },
            { month: "Feb", score: 65 },
            { month: "Mar", score: 70 },
            { month: "Apr", score: 75 },
            { month: "May", score: 80 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="p-8 text-gray-400 animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 text-white">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-orange-400">
        GEOlytics Dashboard
      </h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <KPI title="GEO Score" value={data.kpis.geo_score + "%"} />
        <KPI title="AEO Score" value={data.kpis.aeo_score + "%"} />
        <KPI title="Brand Influence" value={data.kpis.brand_influence + "%"} />
        <KPI title="Visibility" value={data.kpis.citation_visibility + "%"} />

      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 
                   p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-300">
          Citation Trend
        </h2>

        <Chart data={data.citation_trend} />
      </motion.div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        {/* Insight Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                        p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400 text-sm mb-2">Top Insight</h2>
          <p className="text-lg font-semibold">
            Your brand visibility is increasing steadily 📈
          </p>
        </div>

        {/* Recommendation Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                        p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400 text-sm mb-2">Recommendation</h2>
          <p className="text-lg font-semibold">
            Improve structured data for better AI citations
          </p>
        </div>

      </div>

    </div>
  );
}