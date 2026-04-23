import { Search, Bell } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between items-center bg-gray-900 px-6 py-4 border-b border-gray-800">

      <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg w-80">
        <Search size={16} className="text-gray-400" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-white w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-gray-400" />
        <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-bold">
          T
        </div>
      </div>

    </div>
  );
}