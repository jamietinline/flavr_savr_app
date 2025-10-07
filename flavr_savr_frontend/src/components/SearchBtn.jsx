export default function SearchBtn({ value, onChange, onSubmit }) {
  return (
    <form className="search-bar-container"
    onSubmit={(e)=>{
        e.preventDefault();
        onSubmit();
    }}>
<input
    type="text"
    placeholder="enter ingredient..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="search-btn"
    />

    <button type="submit" className="add-btn">Add</button>
    </form>
    
  );
}
