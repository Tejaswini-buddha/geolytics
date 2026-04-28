import axios from "axios";

const API = axios.create({
 baseURL: import.meta.env.VITE_API_URL,
 headers:{
   "Content-Type":"application/json"
 }
});

export const runAnalysis = (keyword, projectId=1)=>
 API.post(`/full-analysis?keyword=${keyword}&project_id=${projectId}`);

export const getProjects = () =>
 API.get("/projects");

export const createProject = (data)=>
 API.post("/project", data);

export const citationTracker = (domain)=>
 API.post(`/citation-tracker?domain=${domain}`);

export const competitorCompare=(domain, competitor)=>
 API.post(
`/competitor-comparison?domain=${domain}&competitor=${competitor}`
);

export default API;