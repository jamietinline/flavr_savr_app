import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import MainBtn from "../components/mainBtn";
export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setAccessToken } = useContext(UserContext);
  const navigate = useNavigate();
  const API_URL = process.env.API_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/auth/signup`,
        { username, email, password },
        { withCredentials: true } // receive refresh token cookie
      );
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
       // If user is new, send them to onboarding
      if (res.data.user.firstTimeUser) {
          navigate("/onboarding");
      } else {
          navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (<>
   <h1 className="page-title">Sign Up</h1>
    <form className="form-container"onSubmit={handleSignup}>
    <p>username</p>
      <input
      className="auth-input"
        type="text"
        placeholder=""
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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

     <button className="back-btn" onClick={() => navigate("/login")}> Got an Account? Sign In</button> 
     </>
  );
}
