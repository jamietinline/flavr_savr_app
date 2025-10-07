import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { UserContext } from "../contexts/UserContext";
import MainBtn from "../components/mainBtn";
import Loading from "../components/Loading";

import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { MdDelete } from "react-icons/md";




export default function SavedRecipes() {
  const { user } = useContext(UserContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);
  
  
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Saved recipes are stored directly on the user object
    console.log("User saved recipes:", user.savedRecipes);
    setSavedRecipes(user.savedRecipes || []);
    setIsLoading(false);
  }, [user, navigate]);

  const handleRecipeClick = (recipe) => {
    // Parse the content string back to object
    const parsedRecipe = typeof recipe.content === 'string'
      ? JSON.parse(recipe.content)
      : recipe.content;

    setSelectedRecipe({
      ...parsedRecipe,
      _id: recipe._id,
      savedTitle: recipe.title,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      
    });
  };

  const handleDelete = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await axios.delete(`${API_URL}/user/saved-recipes/${recipeId}`, {
        withCredentials: true,
      });

      // Update local state
      setSavedRecipes(savedRecipes.filter(r => r._id !== recipeId));
      setSelectedRecipe(null);
      alert("Recipe deleted successfully!");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (selectedRecipe) {
    return (
      <>
      <div className="header">
      <FaLongArrowAltLeft className="back-arrow" size={30}color="#1A443D" onClick={() => setSelectedRecipe(null)} /> 
      
      <h1 className="page-title">Saved Recipes</h1>

      <MdDelete className="bin-recipe" size={30}color="#1A443D" onClick={() => handleDelete(selectedRecipe._id)} />
      </div>
       
        <div className="full-recipe">
          {/* Recipe Meta */}
          <div className="disable-hover saved-recipe-card full-recipe-card">
            <h2>{selectedRecipe.savedTitle}</h2>
            <div className="recipe-card-meta-info">
              <span>Prep: {selectedRecipe.prepTime}</span>
            <span>Cook: {selectedRecipe.cookTime}</span>
            <span>Total: {selectedRecipe.totalTime}</span>
            <span>Servings: {selectedRecipe.servings}</span>
            </div>
            
          </div>

          {/* Ingredients */}
          <div className="recipe-section">
            <h2>Ingredients</h2>
            <ul>
              {selectedRecipe.ingredients?.map((ingredient, index) => (
                <li className="ingredient-list" key={index}>
                    <input type="checkbox" />
                  <ReactMarkdown components={{ p: 'span' }}>{ingredient}</ReactMarkdown>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment */}
          {selectedRecipe.equipment && selectedRecipe.equipment.length > 0 && (
            <div className="recipe-section">
              <h2>Equipment Needed</h2>
              <ul>
                {selectedRecipe.equipment.map((item, index) => (
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
              {selectedRecipe.steps?.map((step, index) => (
                <li key={index}>
                  <ReactMarkdown components={{ p: 'span' }}>{step}</ReactMarkdown>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
            <div className="recipe-section">
              <h2>Tips</h2>
              <ul>
                {selectedRecipe.tips.map((tip, index) => (
                  <li key={index}>
                    <ReactMarkdown components={{ p: 'span' }}>{tip}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">Saved Recipes</h1>

      {savedRecipes.length === 0 ? (
        <div div className="no-recipe-section">
        <p>No saved recipes yet. Start generating recipes to save them!</p>
        <MainBtn text="Generate Recipe's" onClick={() => navigate("/")} />
          </div>
      ) : (
        <>
        <p className="save-recipe-explain">Below are your saved recipes you have generated, click the recipe card to view the full recipe!</p>
        <div className="preference-list">
          {savedRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="saved-recipe-card"
              onClick={() => handleRecipeClick(recipe)}
            >
              <h3>{recipe.title}</h3>
              <div className="recipe-card-meta-info">
              <span><FaRegClock /> Prep: {recipe.prepTime}</span>
              <span><FaRegClock /> Cook: {recipe.cookTime}</span>
              <span><FaClock /> Total: {recipe.totalTime}</span>
              {/* <span>Servings: {recipe.servings}</span> */}
            </div>
              <p>
                Saved on {new Date(recipe.savedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        </>
      )}

    </>
  );
}