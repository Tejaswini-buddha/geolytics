import { useEffect, useState } from "react";
import API from "../api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createProject = async () => {
    if (!name) return;

    try {
      await API.post("/project", { name });
      setName("");
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl mb-6">Projects</h1>

      <div className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
          className="p-2 rounded bg-gray-800"
        />
        <button onClick={createProject} className="bg-orange-500 px-4 rounded">
          Create
        </button>
      </div>

      <div>
        {projects.map((p) => (
          <div key={p.id} className="mb-2">
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}