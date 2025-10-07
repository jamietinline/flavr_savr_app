

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from "/src/App.jsx";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);