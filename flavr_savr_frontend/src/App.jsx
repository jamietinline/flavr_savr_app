import React, { useEffect } from "react";
import DynamicIsland from "./components/dynamicIsland";
import { Routes, Route, useLocation} from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./views/Homepage";
import SavedRecipes from "./views/SavedRecipes"
import Profile from "./views/Profile"
import RecipeGenerateProcess from "./views/RecipeGenerateProcess"
import SignIn from "./views/SignIn"
import SignUp from "./views/SignUp"
import ProtectedRoute from "./components/ProtectedRoute"
import DietaryOnboarding from './views/DietaryOnboarding'

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  const location = useLocation();

  // scale container to fit viewport
  useEffect(() => {
    function scaleContainer() {
      const containerWidth = 440;
      const containerHeight = 956;
      const padding = 40; // 20px on each side

      const scale = Math.min(
        (window.innerWidth - padding) / containerWidth,
        (window.innerHeight - padding) / containerHeight
      );

      document.documentElement.style.setProperty("--scale", scale);
    }

    window.addEventListener("resize", scaleContainer);
    scaleContainer(); // initial call

    return () => window.removeEventListener("resize", scaleContainer);
  }, []);

  const hideNavbarPaths = ["/signin", "/signup", "/onboarding", "/preferences"];

  return (
    <div className="app-container">
      {/* Always visible */}
      <DynamicIsland />
       {/* Content that changes per route */}
      <div className="scrollable-content">
       <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<DietaryOnboarding />} />
          <Route path="/preferences" element={<ProtectedRoute><DietaryOnboarding /></ProtectedRoute>} />
          < Route path="/RecipeGenerateProcess" element={<RecipeGenerateProcess />} />
          <Route path="/savedrecipes" element={<ProtectedRoute><SavedRecipes /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </div>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="home-indicator"></div>

       {/* Toast Container goes here */}
  <ToastContainer
    position="top-center"
    style={{ top: "50px" }}
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    draggable
  />
    </div>
  );
}
