import {useEffect,useState} from "react";
import {getProjects} from "../api";

export default function Projects(){

const [projects,setProjects]=useState([]);

useEffect(()=>{
loadProjects();
},[]);

const loadProjects=async()=>{
const res=await getProjects();
setProjects(res.data);
}

const [projects, setProjects] = useState([]);

useEffect(() => {
  API.get("/projects").then(res => setProjects(res.data));
  }, []);

const createProject = async () => {
  await API.post("/project", { name });
  window.location.reload();
  };

return(
<div>
<h1>Projects</h1>

{projects.map(p=>(
<div key={p.id}>
<h3>{p.name}</h3>
<p>{p.domain}</p>
</div>
))}

</div>
)

}