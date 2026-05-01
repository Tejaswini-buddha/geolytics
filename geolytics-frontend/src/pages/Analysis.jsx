import { useEffect, useState } from "react";
import API from "../api";

export default function Analysis() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Run Analysis
  const runAnalysis = async () => {
    if (!keyword) {
      setError("Please enter a keyword");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/full-analysis", {
        keyword: keyword,
        project_id: 1,
      });

      setResult(res.data);

    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Backend not responding or invalid request.");
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
          placeholder="Enter keyword (SEO tools, AI marketing...)"
          className="p-3 rounded bg-gray-800 w-80"
        />

        <button
          onClick={runAnalysis}
          className="bg-orange-500 px-6 py-2 rounded hover:bg-orange-600"
        >
          {loading ? "Running..." : "Run Analysis"}
        </button>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* RESULT */}
      {result && (
        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* GEO Score */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-gray-400">GEO Score</h2>
            <p className="text-4xl text-orange-400 font-bold">
              {result.geo_score}
            </p>
          </div>

          {/* AEO Score */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-gray-400">AEO Score</h2>
            <p className="text-4xl text-orange-400 font-bold">
              {result.aeo_score}
            </p>
          </div>

          {/* Visibility */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-gray-400">Visibility</h2>
            <p className="text-xl">
              {result.visibility}
            </p>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-gray-400">Recommendations</h2>
            <ul className="list-disc pl-5">
              {result.recommendations?.map((rec, i) => (
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
            <div key={h.id} className="border-b border-gray-700 py-2">
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