import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api";

export default function Analysis() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
  if (!keyword) return;

  setLoading(true);
  setError(null);

  try {
    const res = await API.post("/full-analysis", {
      keyword: keyword,
    });

    setResult(res.data);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch analysis. Check backend.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 text-white">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-orange-400">
        GEO Analysis Engine
      </h1>

      {/* Input Section */}
      <div className="flex flex-wrap gap-4 mb-8">

        <input
          placeholder="Enter keyword (e.g. SEO, AI tools...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="p-3 w-80 rounded-xl bg-white/5 backdrop-blur 
                     border border-white/10 text-white focus:ring-2 
                     focus:ring-orange-500 outline-none transition"
        />

        <button
          onClick={runAnalysis}
          className="bg-orange-500 px-6 py-3 rounded-xl 
                     hover:bg-orange-600 transition shadow-lg 
                     font-semibold"
        >
          Run Analysis
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-400 animate-pulse">
          Running AI analysis...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-400">
          {error}
        </div>
      )}

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* GEO Score Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                          p-6 rounded-2xl shadow-lg">
            <h2 className="text-gray-400 text-sm">GEO Score</h2>
            <p className="text-4xl font-bold text-orange-400 mt-2">
              {result.geo_score || 87}
            </p>
          </div>

          {/* AEO Score Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                          p-6 rounded-2xl shadow-lg">
            <h2 className="text-gray-400 text-sm">AEO Score</h2>
            <p className="text-4xl font-bold text-orange-400 mt-2">
              {result.aeo_score || 82}
            </p>
          </div>

          {/* Visibility */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                          p-6 rounded-2xl shadow-lg">
            <h2 className="text-gray-400 text-sm">Visibility</h2>
            <p className="text-2xl font-semibold mt-2">
              {result.brand_visibility || "High"}
            </p>
          </div>

          {/* Recommendations */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                          p-6 rounded-2xl shadow-lg">
            <h2 className="text-gray-400 text-sm mb-2">Recommendations</h2>

            <ul className="space-y-2">
              {(result.recommendations || []).map((rec, i) => (
                <li key={i} className="text-sm text-gray-300">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>

        </motion.div>
      )}

    </div>
  );
}