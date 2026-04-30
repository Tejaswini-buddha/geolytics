import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const navigate = useNavigate(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await API.post("/login", {
      email,
      password,
      });

    console.log("LOGIN RESPONSE:", res.data); 

    localStorage.setItem("user", JSON.stringify(res.data));
    navigate("/dashboard");

    } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="bg-gray-800 p-6 rounded w-80">
        <h2 className="text-2xl mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}