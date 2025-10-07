import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import MainBtn from "../components/mainBtn";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setAccessToken } = useContext(UserContext);
  const navigate = useNavigate();
     const API_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/auth/signin`,
        { email, password },
        { withCredentials: true } // send/receive refresh token cookie
      );
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);

      navigate("/"); // redirect after login
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>

     <h1 className="page-title">Sign In</h1>
    <form className="form-container" onSubmit={handleLogin}>
      <p>Email</p>
      <input
      className="auth-input"
        type="email"
        placeholder=""
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <p>Password</p>
      <input
      className="auth-input"
        type="password"
        placeholder=""
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <MainBtn className="submit" type="submit" text="Sign in"></MainBtn>
    </form>
    
    <button className="back-btn" onClick={() => navigate("/signup")}> No Account? Sign Up</button> 
</>
  );
}
