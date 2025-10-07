import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import AuthPrompt from "./AuthPrompt";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    return <AuthPrompt />;
  }

  return children;
}