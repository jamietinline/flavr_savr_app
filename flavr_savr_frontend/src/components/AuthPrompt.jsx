import { useNavigate } from "react-router-dom";

import MainBtn from "../components/mainBtn"

export default function AuthPrompt() {
  const navigate = useNavigate();

  return (
    <div className="auth-prompt">
      <div className="auth-prompt-content">
        <h2>Sign in required</h2>
        <p>You need to be signed in to access this feature.</p>
        <div className="auth-prompt-buttons">
           <MainBtn text="Sign In" onClick={() => navigate("/signin")} />
            <MainBtn text="Sign Up" onClick={() => navigate("/signup")} />
        </div>
      </div>
    </div>
  );
}
