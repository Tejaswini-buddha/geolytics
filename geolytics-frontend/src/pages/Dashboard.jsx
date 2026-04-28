import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import KPI from "../components/KPI";
import Chart from "../components/Chart";

export default function Dashboard() {
  const [data, setData] = useState({
    kpis: {
      geo_score: 0,
      aeo_score: 0,
      brand_influence: 0,
      citation_visibility: 0,
    },
    citation_trend: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------------------
  // Fetch Dashboard Data
  // -----------------------------------------
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/analysis-history");

        const history = res.data || [];

        // If backend returns history array, compute KPIs dynamically
        if (history.length > 0) {
          const avgGeo =
            data.reduce(
              (acc, d) => acc + (d.geo_score || 0),
              0
            )  / data.length || 0;

          const avgAeo =
            history.reduce(
              (acc, item) => acc + Number(item.aeo_score || 0),
              0
            ) / history.length;

          const avgVisibility =
            history.reduce(
              (acc, item) => acc + Number(item.visibility || 75),
              0
            ) / history.length;

          const trend = history.slice(-6).map((item, index) => ({
            month: item.month || `M${index + 1}`,
            score: item.geo_score || 0,
          }));

          setData({
            kpis: {
              geo_score: Math.round(avgGeo),
              aeo_score: Math.round(avgAeo),
              brand_influence: Math.round(avgGeo + 5),
              citation_visibility: Math.round(avgVisibility),
            },
            citation_trend: trend,
          });
        }

        // Fallback demo data if backend empty
        else {
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
              { month: "Jun", score: 85 },
            ],
          });
        }

      } catch (err) {
        console.error("Dashboard Error:", err);

        setError("Failed to load dashboard.");

        // fallback if API fails
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

  // -----------------------------------------
  // Loading State
  // -----------------------------------------
  if (loading) {
    return (
      <div className="p-8 text-gray-400 animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 text-white min-h-screen">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 text-orange-400">
        GEOlytics Dashboard
      </h1>

      {/* Error */}
      {error && (
        <div className="mb-6 text-red-400">
          {error}
        </div>
      )}

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <KPI
          title="GEO Score"
          value={`${data.kpis.geo_score}%`}
        />

        <KPI
          title="AEO Score"
          value={`${data.kpis.aeo_score}%`}
        />

        <KPI
          title="Brand Influence"
          value={`${data.kpis.brand_influence}%`}
        />

        <KPI
          title="Visibility"
          value={`${data.kpis.citation_visibility}%`}
        />

      </div>

      {/* Citation Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          p-6
          rounded-2xl
          shadow-lg
        "
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-300">
          Citation Trend
        </h2>

        <Chart data={data.citation_trend} />
      </motion.div>

      {/* Insights Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">

        {/* Insight Card */}
        <div
          className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            p-6
            rounded-2xl
            shadow-lg
          "
        >
          <h2 className="text-gray-400 text-sm mb-3">
            Top Insight
          </h2>

          <p className="text-lg font-semibold">
            Your brand visibility is increasing steadily 📈
          </p>

          <p className="text-gray-400 mt-3">
            GEO performance improved based on recent citation trends.
          </p>
        </div>

        {/* Recommendation Card */}
        <div
          className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            p-6
            rounded-2xl
            shadow-lg
          "
        >
          <h2 className="text-gray-400 text-sm mb-3">
            Recommendation
          </h2>

          <p className="text-lg font-semibold">
            Improve structured data for better AI citations
          </p>

          <p className="text-gray-400 mt-3">
            Focus on schema markup, citations and answer-engine optimization.
          </p>
        </div>

      </div>

    </div>
  );
}