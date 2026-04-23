import { motion } from "framer-motion";

export default function KPI({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 
                 p-5 rounded-2xl shadow-lg transition"
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2 text-orange-400">
        {value}
      </h2>
    </motion.div>
  );
}