import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestions, evaluationCount } from "../../api/question";
import toast from "react-hot-toast";
import "./GetQuestions.css";
import axios from "axios";

function GetQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { quizId } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false); // New flag to track quiz completion

  useEffect(() => {
    // Increment impressions when the component mounts
    const incrementImpressions = async () => {
      try {
        await axios.post(`/api/increment-impressions/${quizId}`);
      } catch (error) {
        console.error("Failed to increment impressions:", error);
      }
    };

    incrementImpressions();
    // Fetching questions logic
    const renderQuestions = async () => {
      try {
        const response = await getQuestions(quizId);
        setQuestions(response.data);
        console.log("Fetched questions:", response.data);
      } catch (error) {
        toast.error("Failed to fetch questions");
        console.error(error);
      }
    };
    renderQuestions();
  }, [quizId]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex === 0) {
      setTimeLeft(parseInt(questions[0].timer, 10) || 0);
    }
  }, [questions]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && questions.length > 0 && !quizCompleted) {
      handleNextQuestion(true);
    }
  }, [timeLeft, questions, quizCompleted]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log("Option clicked:", option);
  };

  const updateCount = async (questionId, isCorrect) => {
    try {
      const response = await evaluationCount(questionId, isCorrect);
      console.log("Updated count:", response.data);
    } catch (error) {
      toast.error("Failed to update count");
      console.error(error);
    }
  };

  const handleNextQuestion = (isTimerEnd = false) => {
    if (quizCompleted) return; // Prevent further action if quiz is already completed

    const currentQuestion = questions[currentQuestionIndex];

    if (!isTimerEnd && !selectedOption) return;

    const isCorrect =
      (selectedOption?.text &&
        selectedOption.text === currentQuestion.correctOption) ||
      (selectedOption?.imageURL &&
        selectedOption.imageURL === currentQuestion.correctOption);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    updateCount(currentQuestion.id, isCorrect);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(parseInt(questions[currentQuestionIndex + 1].timer, 10) || 0);
    } else {
      // Final evaluation and prevent further actions
      const finalScore = isCorrect ? score + 1 : score;
      setQuizCompleted(true); // Set quiz completion flag
      toast(
        `Quiz completed! Your score: ${finalScore} out of ${questions.length}`
      );
      console.log("Final score:", finalScore);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz Questions</h1>
      <span className="question-index">
        {currentQuestionIndex}/{questions.length - 1}
      </span>

      {currentQuestion ? (
        <div>
          <h4 className="timer">Timer: {timeLeft}</h4>
          <h2 className="question">{currentQuestion.question}</h2>
          <ul className="options">
            {currentQuestion.options.map((option, index) => (
              <li key={index} className="option-item">
                <button
                  onClick={() => handleOptionClick(option)}
                  className={`option-button ${
                    selectedOption === option ? "selected" : ""
                  }`}
                >
                  {option.imageURL ? (
                    <div className="option-content">
                      <img
                        src={option.imageURL}
                        alt="Option"
                        className="option-image"
                      />
                      {option.text && (
                        <span className="option-text">{option.text}</span>
                      )}
                    </div>
                  ) : (
                    <span className="option-text">{option.text}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleNextQuestion(false)}
            className="next-button"
            disabled={!selectedOption}
          >
            {currentQuestionIndex == questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GetQuestions;
