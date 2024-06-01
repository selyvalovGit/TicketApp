import React, { useState } from "react";
import logo from "../img/logo.png";
import loginData from "../data/dataLogin.json";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.length <= 0) {
      setLoginError("Email is required!");
      return;
    }
    if (password.length < 8) {
      setLoginError("Password minimum 8 characters!");
      return;
    }
    setLoginError("");

    const user = loginData.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      onLogin(email, password, user.role);
    }

    if (!user) {
      alert("Email dan password Anda salah.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
          <img src={logo} alt="logo" />
          <h3>Dashboard Kit</h3>
          <h2>Log In to Dashboard Kit</h2>
          <span>Enter your email and password below</span>
        </div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="8"
        />

        <button type="submit">Log In</button>

        <div className="login-footer">
          <span>
            Don't have an account? <a href="https://www.google.com/">Sign Up</a>
          </span>
        </div>
        {loginError && <p className="login-error">{loginError}</p>}
      </form>
    </div>
  );
}
