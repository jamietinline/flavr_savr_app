import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import MainBtn from "../components/mainBtn";

export default function Profile() {
  const { user, setUser, setAccessToken } = useContext(UserContext);
  const navigate = useNavigate();
  const API_URL = process.env.API_URL;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUser(null);
      setAccessToken(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
      setAccessToken(null);
      navigate("/");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (<>
     <h1 className="page-title">Your Account</h1>
   
   <div className="profile-container">
      {/* User Info Section */}
      <div className="profile-section">
        <h2>Account Information</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Dietary Preferences Section */}
      <div className="profile-section">
        <h2>Dietary Preferences</h2>

        <div>
          <h3>Diet Type:</h3>
          {user.diet && user.diet.length > 0 ? (
            <p>{user.diet.join(", ")}</p>
          ) : (
            <p>None selected</p>
          )}
          {user.dietOther && <p>Other: {user.dietOther}</p>}
        </div>

        <div>
          <h3>Foods to Avoid:</h3>
          {user.avoid && user.avoid.length > 0 ? (
            <p>{user.avoid.join(", ")}</p>
          ) : (
            <p>None selected</p>
          )}
          {user.avoidOther && <p>Other: {user.avoidOther}</p>}
        </div>

        <MainBtn text="Edit Preferences" onClick={() => navigate("/preferences")} />
      </div>

      <MainBtn text="Log Out" onClick={handleLogout} />
    </div>
    </>
  );
}
