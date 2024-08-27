import { useState, useEffect } from "react";
import { deleteQuiz, getQuiz } from "../../../api/quiz";
// import { useNavigate } from "react-router-dom";
import "./Analytics.css";
import DeleteModal from "../CreateQuiz/DeleteModal/DeleteModal"; // Import DeleteModal
import toast from "react-hot-toast";
import { Route, Routes, useNavigate } from "react-router-dom";
import QuizWiseAnalysis from "./QuizWiseAnalysis/QuizWiseAnalysis";

const Analytics = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null); // Track the selected quiz ID for deletion
  // const navigate = useNavigate();

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await getQuiz();
        console.log(data);
        setQuizzes(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    getQuizzes();
  }, []);

  const formatDate = (dateString) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(dateString);
    const month = months[date.getMonth()];
    return `${date.getDate()} ${month.substring(0, 3)}, ${date.getFullYear()}`;
  };

  const openModal = (id) => {
    setSelectedQuizId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedQuizId(null); // Reset selected quiz ID when closing the modal
  };

  const handleDelete = async () => {
    try {
      const response = await deleteQuiz(selectedQuizId);
      if (response.status === 200) {
        toast.success("Quiz deleted successfully");
        setQuizzes(quizzes.filter((q) => q._id !== selectedQuizId));
      } else if (response.status === 403) {
        toast.error("not authorized to delete this quiz");
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (e) {
      console.error("Error deleting quiz:", e);
      toast.error("Failed to delete quiz");
    } finally {
      closeModal();
    }
  };

  const handleShare = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Text copied to clipboard");
        // Optionally show a toast or some feedback to the user
      },
      (err) => {
        console.error("Failed to copy text: ", err);
        // Optionally show an error message to the user
      }
    );
  };
  const navigate = useNavigate();
  const handleAnalysis = (selectedQuizId) => {
    // Navigate to the analysis page with the selected quiz ID
    navigate(`${selectedQuizId}`);
  };
  return (
    <div className="table-container">
      <h1 className="analytics-title">Quiz Analysis</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : (
            quizzes.map((quiz, index) => (
              <tr
                key={quiz._id}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{formatDate(quiz.date)}</td>
                <td>{quiz.impression}</td>
                <td>
                  <span className="icon edit" title="Edit"></span>
                  <span
                    className="icon delete"
                    onClick={() => openModal(quiz._id)}
                    title="Delete"
                  ></span>
                  <span
                    className="icon share"
                    onClick={() =>
                      handleShare(
                        `http://localhost:5173/quiz/${quiz._id}/questions/view`
                      )
                    }
                    title="Share"
                  ></span>
                  <a
                    className="analysis-link"
                    onClick={() => handleAnalysis(quiz._id)}
                  >
                    Question Wise Analysis
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {modalOpen && (
        <DeleteModal
          isOpen={modalOpen}
          onClose={closeModal}
          onDelete={handleDelete} // Pass delete function to the modal
        />
      )}
    </div>
  );
};

export default Analytics;
