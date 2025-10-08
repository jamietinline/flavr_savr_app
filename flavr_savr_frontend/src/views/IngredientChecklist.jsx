
import { useState } from "react";
import MainBtn from "../components/mainBtn";
import { MdRefresh } from "react-icons/md";
import Loading from "../components/Loading";
import { NavLink } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
export default function IngredientChecklist({
  ingredientsReply,
  userIngredients,
  onGenerateIdeas,
  onRefresh
}) {
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Parse ingredients from reply
  const ingredients = ingredientsReply
    ? ingredientsReply
        .split("\n")
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, ""))
    : [];

  const handleCheckboxChange = (ingredient) => {
    setSelected((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await onRefresh();
      setSelected([]); // Clear selections after refresh
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      await onGenerateIdeas(selected);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
       <div className="header">
             <FaLongArrowAltLeft className="back-arrow" size={30}color="#1A443D"  /> 
            
              <h2 className="page-title">Ingredient Checklist</h2>
      
            </div>

      <p className="checklist-explain-text">
        Below are common household ingredients suited to your inputted ingredients.
        Select those you have on hand and wish to use for the final recipe.
      </p>

      <div className="refresh-btn-container" onClick={handleRefresh}>
        <MdRefresh className="refresh-icon"/>
        <p>Refresh Ingredient's</p>
      </div>

      <div className="checkbox-list">
        {ingredients.map((ingredient, index) => (
          <label key={index} className="checkbox-item-container">
            <input
              type="checkbox"
              checked={selected.includes(ingredient)}
              onChange={() => handleCheckboxChange(ingredient)}
            />
            {ingredient}
          </label>
        ))}
      </div>

      <MainBtn
        text="Generate ideas"
        onClick={handleGenerate}
        disabled={selected.length < 4}
      />

      {isLoading && <Loading />}

      <NavLink to="/" end>
        <MainBtn text="Back" />
      </NavLink>
    </>
  );
}

