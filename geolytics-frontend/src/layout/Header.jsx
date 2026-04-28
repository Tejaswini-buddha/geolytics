import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-gray-900 px-6 py-4 border-b border-gray-800">

      <h1 className="text-xl font-bold text-orange-500">
        GEOlytics
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

    </div>
  );
}