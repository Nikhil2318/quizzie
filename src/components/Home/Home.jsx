import { useState } from "react";
import Register from "../Register/Register";
import Login from "../Login/Login";
import "./Home.css";

function Home() {
  const [currentview, setCurrentView] = useState("register");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  return (
    <div className="main-container">
      <div className="container">
        <h1 className="heading">QUIZZIE</h1>
        <div className="btns">
          <button className="btn" onClick={() => handleViewChange("register")}>
            Sign Up
          </button>
          <button className="btn" onClick={() => handleViewChange("login")}>
            Login
          </button>
        </div>

        {currentview == "register" && <Register />}
        {currentview == "login" && <Login />}
      </div>
    </div>
  );
}

export default Home;
