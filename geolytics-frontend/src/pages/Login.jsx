// inside Login.jsx
import { useNavigate } from "react-router-dom";
import API from "../api";

const navigate = useNavigate();
navigate("/dashboard");

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
  const res = await API.post("/login", { email, password });

  localStorage.setItem("user", JSON.stringify(res.data));
  };


  const handleLogin = async () => {
    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      // ✅ SAVE USER (this is the block you asked about)
      localStorage.setItem("user", JSON.stringify(res.data));

      // 👉 redirect after login
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      {/* your inputs */}
      <input onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}