import { useState } from "react";
import MainBtn from "../components/mainBtn";
import Loading from "../components/Loading";

export default function RecipeIdeas({
  recipeIdeas,
  selectedIngredients,
  onGenerateFullRecipe,
  onBack
}) {
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (selectedIdea === null) return;
    setIsLoading(true);
    try {
      await onGenerateFullRecipe(recipeIdeas[selectedIdea], selectedIngredients);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="page-title">Recipe Ideas</h1>

      <div className="recipe-ideas">
        <h2>Select a Recipe Idea</h2>
        {recipeIdeas.map((idea, index) => (
          <div
            key={index}
            className={`recipe-idea ${selectedIdea === index ? "selected" : ""}`}
            onClick={() => setSelectedIdea(index)}
          >
            <h3>{idea.title}</h3>
            <div className="recipe-meta">
              {idea.totalTime && <span>Total Time: {idea.totalTime}</span>}
              {idea.servings && <span> Servings: {idea.servings}</span>}
            </div>
            {idea.dietaryCategories && (
              <p className="dietary-tags"> categories: {idea.dietaryCategories}</p>
            )}
          </div>
        ))}

        <MainBtn
          text="Generate Full Recipe"
          onClick={handleGenerate}
          disabled={selectedIdea === null}
        />

        {isLoading && <Loading />}

        <MainBtn text="Back to Checklist" onClick={onBack} />
      </div>
    </>
  );
}
