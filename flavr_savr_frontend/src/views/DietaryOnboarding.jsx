import {useState, useContext, useEffect} from "react";
import MainBtn from "../components/mainBtn"
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function OnboardingForm(){

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
      const API_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);

  // form states - initialize with existing user data if available
  const [formData, setFormData] = useState({
    diet: [],
    dietOther: "",
    avoid: [],
    avoidOther: "",
  });

  // Load existing user preferences when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        diet: user.diet || [],
        dietOther: user.dietOther || "",
        avoid: user.avoid || [],
        avoidOther: user.avoidOther || "",
      });
    }
  }, [user]);

const handleFinish = async () => {
  try {
    const res = await axios.patch(
      `${API_URL}/user/onboarding/${user._id}`,
      {
        diet: formData.diet,
        dietOther: formData.dietOther,
        avoid: formData.avoid,
        avoidOther: formData.avoidOther,
      },
      { withCredentials: true }
    );

    // update user context
    setUser(res.data.user);

    // navigate based on whether this is first time user or editing
    if (user.firstTimeUser) {
      navigate("/");
    } else {
      // Coming from profile edit, go back to profile
      navigate("/profile");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to save preferences");
  }
};

  const dietOptions = [
  "Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo", "Low-carb"
];

const avoidOptions = [
  "Peanuts", "Tree nuts", "Shellfish", "Fish", "Eggs", "Milk", "Wheat", "Soy", "Sesame", "Lactose", "Gluten", "FODMAP", "Fructose"
];

const toggleOption = (key, value) => {
  setFormData(prev => {
    const current = prev[key];           // get current array for this key
    if (current.includes(value)) {       // if already selected
      return { ...prev, [key]: current.filter(v => v !== value) }; // remove
    } else {
      return { ...prev, [key]: [...current, value] }; // add
    }
  });
};

const totalSteps=3;

const renderStep1 = () => (
    <div>
        <h2 className="onboard-title">1. Foods to Avoid</h2>
        <p className="onboard-subtitle">Select any ingredients you cannot eat/ wish to avoid.</p>

        <div className="preference-list">
            {avoidOptions.map((opt, index) => (
                <label key={index} className="preference-item-container">
                    <input
                    type="checkbox"
                    checked={formData.avoid.includes(opt)}
                    onChange={() => toggleOption("avoid", opt)}
                    />
                    {opt}
                </label>
                ))}
            <div>
               
                    <input
                    className="preference-item-container textinput"
                    type="text"
                    placeholder="Enter your own"
                    value={formData.avoidOther}
                    onChange={e => setFormData({ ...formData, avoidOther: e.target.value })}
                    />
            </div>
        </div>

        <MainBtn onClick={() => setStep(2)} text="next" />
    </div>
);


const renderStep2 = () => (
  <div>
    <h2 className="onboard-title">2. Your dietary preferences</h2>
        <p className="onboard-subtitle">Select any diets you follow so we can suggest recipes that match your lifestyle.</p>

    <div className="preference-list">
      {dietOptions.map((opt, index) => (
        <label key={index} className="preference-item-container">
          <input
            type="checkbox"
            checked={formData.diet.includes(opt)}
            onChange={() => toggleOption("diet", opt)}
          />
          {opt}
        </label>
      ))}


        <div>

                <input
                className="preference-item-container textinput"
                type="text"
                placeholder="Enter your own"
                value={formData.dietOther}
                onChange={e => setFormData({ ...formData, dietOther: e.target.value })}
                />
        </div>
    </div>
    <MainBtn onClick={() => setStep(1)} text="Back"/>
    <MainBtn onClick={() => setStep(3)} text="Next" />
  </div>
);

const renderStep3 = () => {
  // Build summary text
  const dietSummary = formData.diet.length > 0
    ? formData.diet.join(", ") + (formData.dietOther ? `, ${formData.dietOther}` : "")
    : formData.dietOther || "None selected";

  const avoidSummary = formData.avoid.length > 0
    ? formData.avoid.join(", ") + (formData.avoidOther ? `, ${formData.avoidOther}` : "")
    : formData.avoidOther || "None selected";

  return (
    <div>
      <h2 className="onboard-title">3. Confirm Your Preferences</h2>
      <p className="onboard-subtitle">Please review your selections below:</p>

      <div className="preference-summary">
        <div className="summary-section">
          <h3>Diet Type:</h3>
          <p>{dietSummary}</p>
        </div>

        <div className="summary-section">
          <h3>Foods to Avoid:</h3>
          <p>{avoidSummary}</p>
        </div>

        <p className="onboard-subtitle" style={{ marginTop: "20px" }}>
          You can change these preferences at any time from your Profile page.
        </p>
      </div>

      <MainBtn onClick={() => setStep(2)} text="Back"/>
      <MainBtn onClick={handleFinish} text="Confirm & Finish" />
    </div>
  );
};

    return (
        <div>
          <div className="header">
            <h1 className="page-title">{user?.firstTimeUser ? "Onboarding" : "Edit Preferences"}</h1>
            {user && !user.firstTimeUser && (
              <button className="back-btn" onClick={() => navigate("/profile")}>
                Cancel
              </button>
            )}
          </div>

          <div className="progress-bar-container">
        <div
            className="progress-bar-fill"
            style={{ width: `${(step / totalSteps) * 100}%` }}
        />
        </div>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>
    )
}