import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizByid } from "../../../../api/quiz";
import { getQuestions } from "../../../../api/question";
import "./QuizWiseAnalysis.css";

function QuizWiseAnalysis() {
  const { id } = useParams(); // Get the quiz ID from the URL
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizByid(id);
        console.log("quiz", data); // Log quiz data for debugging
        setQuiz(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions(id);
        console.log("questions", response.data); // Log questions data for debugging
        setQuestions(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchQuestions();
    }
  }, [id]);

  return (
    <div className="quiz-analysis-container">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && quiz && (
        <div className="quiz-item">
          <p className="quizName">{quiz.title} Question Analysis</p>
          <div className="quiz-details">
            <p>Created on: {new Date(quiz.date).toLocaleDateString()}</p>
            <p>Impressions: {quiz.impressions}</p>
          </div>
        </div>
      )}
      {!loading && questions.length > 0 && (
        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={index} className="question-item">
              <p className="quiz-question">
                Q.{index + 1} {question.question}
              </p>
              <div className="question-analysis">
                <div className="analysis-container">
                  {question.correctCount + question.incorrectCount}
                  <span>Total</span>
                </div>
                <div className="analysis-container">
                  {question.correctCount}
                  <span>Correct</span>
                </div>
                <div className="analysis-container">
                  {" "}
                  {question.incorrectCount}
                  <span>Incorrect</span>
                </div>
              </div>
              <div className="horizontal-line"></div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && questions.length === 0 && (
        <div>No questions found for this quiz.</div>
      )}
    </div>
  );
}

export default QuizWiseAnalysis;
