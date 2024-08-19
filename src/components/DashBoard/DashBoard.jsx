import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Analytics from "./Analytics/Analytics";
import CreateQuiz from "./CreateQuiz/CreateQuiz";
import Quiz from "./CreateQuiz/Quiz/Quiz"; // Update the import path as needed
import toast from "react-hot-toast";
import "./Dashboard.css";
import { getQuiz } from "../../api/quiz";
import TrendingQuizes from "./TrendingQuizes/TrendingQuizes";

function DashBoard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogOut = (e) => {
    e.preventDefault();
    toast.success("Logged out successfully");
    navigate("/");
    localStorage.removeItem("token");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await getQuiz();
        setQuizzes(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    getQuizzes();
  }, []);

  return (
    <div className="main-container">
      <div className="side-bar">
        <h1>QUIZZIE</h1>
        <div className="side-bar-content">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/dashboard/analytics")}>
            Analytics
          </button>
          <button onClick={openModal}>Create Quiz</button>
        </div>
        <hr />
        <button className="log-out" onClick={handleLogOut}>
          LOGOUT
        </button>
      </div>
      <div className="content-container">
        <Routes>
          <Route path="/" element={<TrendingQuizes />} />
          <Route path="analytics" element={<Analytics />} />
        </Routes>
      </div>
      <Quiz isOpen={isModalOpen} onClose={closeModal}>
        <CreateQuiz />
      </Quiz>
    </div>
  );
}

export default DashBoard;
