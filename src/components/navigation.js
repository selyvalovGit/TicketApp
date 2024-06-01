import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Overview from "./overview";
import Tickets from "./tickets";

export default function Navigation({ role, user }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="nav-container">
      <div class="hamburger" onClick={handleToggle}>
        <div className="hamburger-icon">☰</div>
      </div>
      <Router>
        <nav className={`app-nav ${isOpen ? "open" : ""}`}>
          <span>Dashboard Kit</span>
          <ul className="nav-link">
            <li></li>
            {role === "admin" && (
              <li>
                <Link to="/overview">Overview</Link>
              </li>
            )}
            <li>
              <Link to="/tickets">Tickets</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/overview" element={<Overview user={user} />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </Router>
    </div>
  );
}
