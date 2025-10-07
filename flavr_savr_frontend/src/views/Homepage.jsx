import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import MainBtn from "../components/mainBtn"
import SearchBtn from '../components/SearchBtn'
import {UserContext} from "../contexts/UserContext";
import Loading from "../components/Loading";


export default function Homepage(){
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const API_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);
    
    // use state to show/hide the input bar for ingredients
    const [showSearch, setShowSearch] = useState(false);
    
    const handleInputClick = () => {
    if (!user) {
        navigate("/signin");
        return;
    }
    setShowSearch(true); // show search input
    };

    const handleBackClick = () => {
    setShowSearch(false); // show search input
    };

    const [ingredientInput, setIngredientInput] = useState('');
    const [ingredients, setIngredients]= useState([]);

    
    const handleAddIngredient = () => {
        // Removes the leading and trailing white space and line terminator characters from a string.
        // Capitalize first letter
    const formattedIngredient = ingredientInput.trim();
    const capitalizedIngredient = formattedIngredient.charAt(0).toUpperCase() + formattedIngredient.slice(1);

    setIngredients([...ingredients, capitalizedIngredient]);
    setIngredientInput('');
}

    const handleDeleteIngredient = (indexToDelete) => {
        setIngredients(ingredients.filter((_, index) => index !== indexToDelete));
    }

    const handleBackAndDeleteAll = () => {
        handleBackClick(); // hide search input
        setIngredients([]); // delete all ingredients
    };

    // defining states for if the screen is loading. 
    const [isLoading, setIsLoading] = useState(false);

    const handleNextStep = async () => {
        // triggering the load function for when the user sends a message to claude.
        setIsLoading(true);
        try{
            // remove local host part when pushing live.
            const response = await fetch(`${API_URL}/claude`,{
                method:"POST",
                headers:{ "Content-Type": "application/json" },
                credentials: "include", // send cookies
                body: JSON.stringify({ userId: user?._id, ingredients }),
            });

            // collecting the response and console logging what Claude says. 
            const data = await response.json();
            console.log("Claude says:", data.reply); 

            // change the view for the checklist section.
            navigate("/RecipeGenerateProcess", { state: { reply: data.reply, ingredients } });
           

        } catch (error) {
            console.error("Error talking to Claude:", error);
            setIsLoading(false); 
        }
    };

    return(
    <>
    <div className="header">
        <h1 className="page-title">Find a Recipe</h1>
    </div>
    
        {showSearch && (
        <>
            <SearchBtn
            value={ingredientInput}
            onChange={setIngredientInput}
            onSubmit={handleAddIngredient}
            />
            <button className="back-btn" onClick={handleBackAndDeleteAll}> Change Search Method</button> 

        </>
        )}
        
        <div className="ingredient-list-container">
            <h1 className="ingredient-list-title">
                {showSearch ? "Ingredient List"
                : <>Welcome,<br />{user ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Guest"}</>} </h1>

           
            
            <ul>
                {ingredients.map((item, index) => (
                    <li key={index}>{item}
                    <button 
                    className="delete-Btn"
                    onClick={() => handleDeleteIngredient(index)}
                    >
                         &mdash;
                    </button>
                    </li>
                ))}
            </ul>
            
            {!showSearch && (
                <p className="ingredient-list-body">
                Add ingredients using the following methods: Type your ingredients manually. Take a photo of the contents of your fridge/pantry or any food.
                </p>
            )}
 
        </div>
            
        {!showSearch && (
            <MainBtn text="Input Ingredients" onClick={handleInputClick} />
        )} 

         {isLoading && <Loading />}

        {/* Show extra button only if there’s more than 1 ingredient */}
        {ingredients.length > 0 && (
            <MainBtn text="Next Step" onClick={handleNextStep} />
        )}   
    </>   
    );
}