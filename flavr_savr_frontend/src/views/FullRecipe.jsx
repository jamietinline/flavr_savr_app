import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MainBtn from "../components/mainBtn";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

export default function FullRecipe({
  fullRecipe,
  recipeTitle,
  onBack
}) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isSaved, setIsSaved] = useState(false);
  const API_URL = process.env.API_URL;
  
  const handleSaveRecipe = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/user/save-recipe`,
        {
          title: recipeTitle,
          content: JSON.stringify(fullRecipe),
        },
        { withCredentials: true }
      );

      setIsSaved(true);
      toast.success("Recipe saved successfully!");
    } catch (err) {
      console.error("Error saving recipe:", err);
      toast.error("Failed to save recipe. Please try again.");
    }
  };

  return (
    <>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">{recipeTitle}</h1>
        {user && (
          <button
            onClick={handleSaveRecipe}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              padding: '8px'
            }}
            title={isSaved ? "Recipe saved" : "Save recipe"}
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        )}
      </div>

      {fullRecipe && (
        <div className="full-recipe">
          {/* Recipe Meta */}
          <div className="recipe-meta-info">
            <span>Prep: {fullRecipe.prepTime}</span>
            <span>Cook: {fullRecipe.cookTime}</span>
            <span>Total: {fullRecipe.totalTime}</span>
            <span>Servings: {fullRecipe.servings}</span>
          </div>

          {/* Ingredients */}
          <div className="recipe-section">
            <h2>Ingredients</h2>
            <ul>
              {fullRecipe.ingredients?.map((ingredient, index) => (
                <li key={index}>
                  <ReactMarkdown components={{ p: 'span' }}>{ingredient}</ReactMarkdown>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment */}
          {fullRecipe.equipment && fullRecipe.equipment.length > 0 && (
            <div className="recipe-section">
              <h2>Equipment Needed</h2>
              <ul>
                {fullRecipe.equipment.map((item, index) => (
                  <li key={index}>
                    <ReactMarkdown components={{ p: 'span' }}>{item}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Steps */}
          <div className="recipe-section">
            <h2>Instructions</h2>
            <ol>
              {fullRecipe.steps?.map((step, index) => (
                <li key={index}>
                  <ReactMarkdown components={{ p: 'span' }}>{step}</ReactMarkdown>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {fullRecipe.tips && fullRecipe.tips.length > 0 && (
            <div className="recipe-section">
              <h2>Tips</h2>
              <ul>
                {fullRecipe.tips.map((tip, index) => (
                  <li key={index}>
                    <ReactMarkdown components={{ p: 'span' }}>{tip}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!user && (
        <MainBtn text="Login to Save Recipe" onClick={() => navigate("/login")} />
      )}

      <MainBtn text="Back to Ideas" onClick={onBack} />
    </>
  );
}
