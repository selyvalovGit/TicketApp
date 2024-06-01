import "./App.css";
import { useState } from "react";
import loginData from "./data/dataLogin.json";
import Login from "./components/login";
import Navigation from "./components/navigation";
import Overview from "./components/overview";
import Tickets from "./components/tickets";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState();
  const [isDarkMode, setIsDarkMode] = useState(false);

  function checkData(email, password) {
    return loginData.find(
      (user) => user.email === email && user.password === password
    );
  }

  const handleLogin = (email, password, role) => {
    const user = checkData(email, password);
    setUser(user);
    setRole(role);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
    localStorage.setItem('isDarkMode', !isDarkMode);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : ''}`}>
      <button className="button" onClick={toggleTheme}>
      Toggle Theme
    </button>
      <Navigation role={role} user={user} />
      {role === "admin" ? <Overview user={user} /> : <Tickets />}
    </div>
  );
}

export default App;
