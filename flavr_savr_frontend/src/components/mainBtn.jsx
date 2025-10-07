export default function MainBtn({ text, onClick, type= "button" }) {
  return (
    
    <div className="main-btn-container">
      <button className="main-btn" type={type} onClick={onClick}>
        {text}
      </button>
    </div>
  );
}
