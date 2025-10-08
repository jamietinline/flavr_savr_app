import { toast } from "react-toastify";

export default function SearchBtn({ value, onChange, onSubmit }) {
   const isEmpty = value.trim() === ""; // check if input is empty or just spaces
  
  
  return (
    <form className="search-bar-container"
    onSubmit={(e)=>{
        e.preventDefault();
        if (isEmpty){
          toast.warn("Please enter an ingredient!");
          return;
        } onSubmit();
        
    }}>
<input
    type="text"
    placeholder="Add an ingredient..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="search-btn"
    />

    <button type="submit" className="add-btn">Add</button>
    </form>
    
  );
}
