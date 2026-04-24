import { useEffect, useState } from "react";
import API from "../api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");

  // 🔥 Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  // 🔥 Create project
  const createProject = async () => {
    if (!name || !domain) return;

    try {
      await API.post("/project", {
        name,
        domain,
      });

      setName("");
      setDomain("");
      fetchProjects();
    } catch (err) {
      console.error("Error creating project", err);
    }
  };

  // 🔥 Load on page open
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {/* Create Project */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 flex gap-4">
        <input
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded w-full"
        />

        <input
          placeholder="Domain (example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded w-full"
        />

        <button
          onClick={createProject}
          className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
        >
          Add
        </button>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-lg font-bold">{p.name}</h2>
            <p className="text-gray-400">{p.domain}</p>
          </div>
        ))}
      </div>
    </div>
  );
}