import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api";

export default function Analysis() {
  const [history, setHistory] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

useEffect(() => {
  API.get("/prompt-history").then(res => setHistory(res.data));
}, []);

  // ---------------- FETCH HISTORY ----------------
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);

      const res = await API.get("/analysis-history");

      setHistory(res.data || []);
    } catch (err) {
      console.error("History Error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ---------------- RUN ANALYSIS ----------------
  const runAnalysis = async () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await API.post(
    `/full-analysis?keyword=${keyword}&project_id=${selectedProject}`
      );

      setResult(res.data);

      // Refresh history after new analysis
      fetchHistory();

    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Failed to fetch analysis.");
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
  setLoading(true);

  try {
    const res = await API.post("/full-analysis", { keyword });
    setResult(res.data);
    } catch (err) {
    console.error(err);
   }

  setLoading(false);
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-8 text-white">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold mb-8 text-orange-400">
        GEO Analysis Engine
      </h1>

      {/* INPUT SECTION */}
      <div className="flex flex-wrap gap-4 mb-10">
        <input
          placeholder="Enter keyword (SEO, AI tools...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && runAnalysis()
          }
          className="
            p-3
            w-80
            rounded-xl
            bg-white/5
            backdrop-blur
            border
            border-white/10
            text-white
            focus:ring-2
            focus:ring-orange-500
            outline-none
            transition
          "
        />

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="
            bg-orange-500
            px-6
            py-3
            rounded-xl
            hover:bg-orange-600
            transition
            shadow-lg
            font-semibold
            disabled:opacity-50
          "
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-400 animate-pulse mb-6">
          Running AI analysis...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-400 mb-6">
          {error}
        </div>
      )}

      {/* RECENT ANALYSIS HISTORY */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Recent Analyses
        </h2>

        {historyLoading ? (
          <p className="text-gray-400">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-400">No history yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="
                  bg-gray-800/70
                  backdrop-blur
                  p-5
                  rounded-xl
                  border border-white/10
                "
              >
                <p className="font-semibold text-lg">
                  {item.keyword}
                </p>

                <p className="mt-2 text-gray-300">
                  GEO: {item.geo_score}
                </p>

                <p className="text-gray-300">
                  AEO: {item.aeo_score}
                </p>

                <p className="text-orange-300 mt-2">
                  Visibility: {item.visibility}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESULTS */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >

          {/* GEO SCORE */}
          <div className="
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              p-6
              rounded-2xl
              shadow-lg
            "
          >
            <h2 className="text-gray-400 text-sm">
              GEO Score
            </h2>

            <p className="text-5xl font-bold text-orange-400 mt-3">
              {result.geo_score ?? 87}
            </p>
          </div>

          {/* AEO SCORE */}
          <div className="
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              p-6
              rounded-2xl
              shadow-lg
            "
          >
            <h2 className="text-gray-400 text-sm">
              AEO Score
            </h2>

            <p className="text-5xl font-bold text-orange-400 mt-3">
              {result.aeo_score ?? 82}
            </p>
          </div>

          {/* VISIBILITY */}
          <div className="
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              p-6
              rounded-2xl
              shadow-lg
            "
          >
            <h2 className="text-gray-400 text-sm">
              Brand Visibility
            </h2>

            <p className="text-2xl font-semibold mt-3">
              {result.brand_visibility || "High"}
            </p>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-gray-800 p-2 rounded"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* RECOMMENDATIONS */}
          <div className="
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              p-6
              rounded-2xl
              shadow-lg
            "
          >
            <h2 className="text-gray-400 text-sm mb-4">
              Recommendations
            </h2>

            {result.recommendations?.length ? (
              <ul className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-300"
                  >
                    • {rec}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">
                No recommendations available.
              </p>
            )}
          </div>

        </motion.div>
      )}
    </div>
  );
}