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
    insights: "",
    recommendation: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Convert visibility text → numeric
  const visibilityToScore = (v) => {
    if (v === "High") return 90;
    if (v === "Medium") return 65;
    return 40;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await API.get("/analysis-history");
        const history = res.data || [];

        if (history.length === 0) {
          setError("No analysis data yet. Run analysis first.");
          return;
        }

        // -------------------------
        // KPI CALCULATION
        // -------------------------
        const avgGeo =
          history.reduce((acc, i) => acc + (i.geo_score || 0), 0) /
          history.length;

        const avgAeo =
          history.reduce((acc, i) => acc + (i.aeo_score || 0), 0) /
          history.length;

        const avgVisibility =
          history.reduce(
            (acc, i) => acc + visibilityToScore(i.visibility),
            0
          ) / history.length;

        // -------------------------
        // TREND DATA
        // -------------------------
        const trend = history.slice(-6).map((item, index) => ({
          month: `K${index + 1}`,
          score: item.geo_score || 0,
        }));

        // -------------------------
        // AI INSIGHT GENERATION
        // -------------------------
        let insight = "";
        let recommendation = "";

        if (avgGeo > 80) {
          insight = "Your GEO performance is strong and improving.";
          recommendation = "Focus on scaling authority content and backlinks.";
        } else if (avgGeo > 60) {
          insight = "Your GEO performance is moderate.";
          recommendation = "Improve structured data and semantic SEO.";
        } else {
          insight = "Your GEO performance is low.";
          recommendation = "Optimize content depth and answer intent better.";
        }

        // -------------------------
        // FINAL STATE
        // -------------------------
        setData({
          kpis: {
            geo_score: Math.round(avgGeo),
            aeo_score: Math.round(avgAeo),
            brand_influence: Math.round(avgGeo + 5),
            citation_visibility: Math.round(avgVisibility),
          },
          citation_trend: trend,
          insights: insight,
          recommendation: recommendation,
        });

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 text-white min-h-screen">

      <h1 className="text-4xl font-bold mb-8 text-orange-400">
        GEOlytics Dashboard
      </h1>

      {error && <div className="text-red-400 mb-6">{error}</div>}

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <KPI title="GEO Score" value={`${data.kpis.geo_score}%`} />
        <KPI title="AEO Score" value={`${data.kpis.aeo_score}%`} />
        <KPI title="Brand Influence" value={`${data.kpis.brand_influence}%`} />
        <KPI title="Visibility" value={`${data.kpis.citation_visibility}%`} />
      </div>

      {/* Chart */}
      <motion.div className="bg-white/5 p-6 rounded-2xl">
        <h2 className="mb-4 text-gray-300">Citation Trend</h2>
        <Chart data={data.citation_trend} />
      </motion.div>

      {/* AI Insights */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">

        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-gray-400 mb-2">AI Insight</h3>
          <p className="text-lg">{data.insights}</p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-gray-400 mb-2">Recommendation</h3>
          <p className="text-lg">{data.recommendation}</p>
        </div>

      </div>

    </div>
  );
}