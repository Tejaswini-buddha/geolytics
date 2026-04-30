import { useEffect, useState } from "react";
import API from "../api";

export default function Analysis() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Run Analysis
  const runAnalysis = async () => {
    if (!keyword) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/full-analysis", {
        keyword,
        project_id: 1, // you can later make dynamic
      });

      setResult(res.data);

      // refresh history after new run
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analysis. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch History
  const fetchHistory = async () => {
    try {
      const res = await API.get("/analysis-history");
      setHistory(res.data);
    } catch (err) {
      console.error("History error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-8 text-white">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        GEO Analysis Engine
      </h1>

      {/* INPUT */}
      <div className="flex gap-4 mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword (e.g. SEO tools)"
          className="p-3 rounded bg-gray-800 w-80"
        />
        <button
          onClick={runAnalysis}
          className="bg-orange-500 px-6 py-2 rounded"
        >
          {loading ? "Running..." : "Run Analysis"}
        </button>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* RESULT */}
      {result && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded">
            <h2>GEO Score</h2>
            <p className="text-3xl text-orange-400">
              {result.geo_score}
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2>AEO Score</h2>
            <p className="text-3xl text-orange-400">
              {result.aeo_score}
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2>Visibility</h2>
            <p className="text-xl">{result.visibility}</p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2>Recommendations</h2>
            <ul className="list-disc pl-5">
              {result.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* HISTORY */}
      <h2 className="text-2xl mb-4">Analysis History</h2>

      <div className="bg-gray-900 p-4 rounded">
        {history.length === 0 ? (
          <p>No history yet</p>
        ) : (
          history.map((h) => (
            <div
              key={h.id}
              className="border-b border-gray-700 py-2"
            >
              <p className="font-bold">{h.keyword}</p>
              <p>
                GEO: {h.geo_score} | AEO: {h.aeo_score}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}