import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Chart({ data }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#f97316" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}