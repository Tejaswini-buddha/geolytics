import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Projects from "./pages/Projects";

export default function App() {
  const [page, setPage] = useState("analysis");

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "analysis") return <Analysis />;
    if (page === "projects") return <Projects />;
  };

  <motion.div
  key={page}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="p-6"
>
  {renderPage()}
</motion.div>

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">

      <Sidebar setPage={setPage} />

      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6">{renderPage()}</div>
      </div>

    </div>
  );
}