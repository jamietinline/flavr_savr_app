import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import MainBtn from "../components/mainBtn"
import SearchBtn from '../components/SearchBtn'
import {UserContext} from "../contexts/UserContext";
import Loading from "../components/Loading";
import AuthPrompt from "../components/AuthPrompt";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { gsap } from "gsap";
import { useRef, useEffect } from "react";

export default function Homepage(){
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const API_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);
    
    // use state to show/hide the input bar for ingredients
    const [showSearch, setShowSearch] = useState(false);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    const handleInputClick = () => {
    if (!user) {
    setShowAuthPrompt(true);
    return;
    }

    const tl = gsap.timeline({
        onComplete: () => {
        setShowSearch(true); // show ingredient input after animation
        }
    });

    // 1. Slide caption bubble up and fade
    tl.to(captionRef.current, { y: -50, opacity: 0, duration: 0.5, ease: "power2.in" }, 0);

    // 2. Slide welcome message left and fade
    tl.to(welcomeRef.current, { x: -200, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);

    // 3. Slide out button
    tl.to(btnRef.current, { y: 40, opacity: 0, duration: 0.5, ease: "power2.in" }, 0);
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

    // Cycle through captions for landing page --------
    const[caption, setCaption] = useState("");
    const captions = [
    "Got ingredients you might otherwise throw out? Let’s turn them into meals!",
    "Leftover food? We’ll help you turn it into something delicious.",
    "Fridge full, ideas empty? Let’s cook!",
    "Don’t chuck it — cook it!",
    "That lonely carrot isn’t going to cook itself!"
    ];

    // Pick a random Caption
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * captions.length);
        setCaption(captions[randomIndex]);
    }, []);
    
    // Welcome message slide in from the left
    const welcomeRef = useRef(null);
    useEffect(() => {
    gsap.fromTo(
      welcomeRef.current,
      { x: -200, opacity: 0 }, // start off-screen left
      { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" } // slide in
    );
    }, []);

    // Caption bubble appears on load
    const captionRef = useRef(null);
    useEffect(() => {
    gsap.fromTo(
    captionRef.current,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2.5)", delay: 0.3 }
    );
    }, []);

    // MainBtn animations
    const btnRef = useRef(null);
    useEffect(() => {
    gsap.fromTo(
      btnRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
    );
  }, []);

 const searchRef = useRef(null);
  // In
    const ingredientListRef = useRef(null);
    const prevLengthRef = useRef(ingredients.length);
    useEffect(() => {
    const prevLength = prevLengthRef.current;
    const currentLength = ingredients.length;

    // Only animate if an ingredient was added
    if (currentLength > prevLength) {
        const lastItem = ingredientListRef.current?.querySelector(
        "li:last-child"
        );
        if (lastItem) {
        gsap.fromTo(
            lastItem,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
        }
    }

    // Update the previous length ref
    prevLengthRef.current = currentLength;
    }, [ingredients]);

    // End of GSAP Animations --------

    return(
    <>
    {showAuthPrompt && <AuthPrompt />}
    {!showAuthPrompt && (
        <>
        <div className="header">
        {showSearch && (<FaLongArrowAltLeft className="back-arrow" size={30}color="#1A443D" onClick={handleBackAndDeleteAll}  />  )}
      
        <h2 className="page-title">Find a Recipe</h2>

      </div>

      
    {!showSearch && (
        <>
            <h1 className="welcome-user" ref={welcomeRef}>
                {user ? `Hello ${user.username.charAt(0).toUpperCase() + user.username.slice(1)},` : "Hello friend,"}
            </h1>
        
            <div className="caption-container">
                <h3 className="homepage-caption" ref={captionRef}>"{caption}"</h3>
                </div>
                <div ref={btnRef}>
                    <MainBtn  text="Add your Ingredients" onClick={handleInputClick} />
            </div>
        </>
        )}
   
        
      {showSearch && (
        <>
            <SearchBtn
            ref={searchRef}
            value={ingredientInput}
            onChange={setIngredientInput}
            onSubmit={handleAddIngredient}
            />
        <div className="ingredient-list-container" ref={ingredientListRef}>
            <h3 className="ingredient-list-title">Ingredient List</h3>
            
            <ul>
                {ingredients.map((item, index) => (
                <li key={index}>
                    {item}
                    <button className="delete-Btn" onClick={() => handleDeleteIngredient(index)}>
                    &mdash;
                    </button>
                </li>
                ))}
            </ul>
        </div>
        </>
        )}
        </>
        )}


         {isLoading && <Loading />}

        {/* Show extra button only if there’s more than 1 ingredient */}
        {ingredients.length > 0 && (
            <MainBtn text="Suggest Ingredients" onClick={handleNextStep} />
        )}   
    </>   
    );
}