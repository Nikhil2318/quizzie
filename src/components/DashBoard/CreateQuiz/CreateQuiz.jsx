/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./CreateQuiz.css";
import toast from "react-hot-toast";
import { createQuiz } from "../../../api/quiz";
import { useNavigate } from "react-router-dom";
import QuizQuestion from "./QuizQuestions/QuizQuestions";
import PollQuestions from "./PollQuestions/PollQuestions";
import QuizModal from "./QuizModal/QuizModal";

function CreateQuiz() {
  const [quizName, setQuizName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("q&a");
  const navigate = useNavigate();

  const handleInput = (e) => {
    setQuizName(e.target.value);
  };

  const handleType = (newType) => {
    setType(newType);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!quizName) {
      toast.error("Please enter a quiz name");
      return;
    }
    try {
      const response = await createQuiz({ title: quizName, type });
      console.log("API response: ", response.data._id);

      if (response.status === 201) {
        toast.success("Quiz created");
        setQuizName("");
        navigate(`/dashboard/quiz/${response.data._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating quiz");
    }
    // Clear the form inputs
    setQuizName("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="quiz-modal">
          <input
            type="text"
            placeholder="Quiz name"
            className="quiz-input"
            value={quizName}
            onChange={handleInput}
          />
        </div>
        <div className="quiz-type">
          <label> Quiz type</label>
          <button
            type="button"
            className={`qna-btn ${type === "q&a" ? "active" : ""}`}
            onClick={() => handleType("q&a")}
          >
            Q & A
          </button>
          <button
            type="button"
            className={`poll-btn ${type === "poll" ? "active" : ""}`}
            onClick={() => handleType("poll")}
          >
            Poll Type
          </button>
        </div>
        <button type="submit" className="quiz-continue" onClick={openModal}>
          Continue
        </button>
      </form>
      <QuizModal isOpen={isModalOpen} onClose={closeModal}>
        {type == "q&a" ? <QuizQuestion /> : <PollQuestions />}
      </QuizModal>
    </>
  );
}

export default CreateQuiz;
