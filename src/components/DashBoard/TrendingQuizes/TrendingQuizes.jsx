import { useEffect, useState } from "react";
import { getQuiz } from "../../../api/quiz";
import "./TrendingQuizes.css";

function TrendingQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await getQuiz();
        console.log(data);

        setQuizzes(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
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
    const month = months[date.getMonth() + 1];
    return `${date.getDate()} ${month.substring(0, 3)},${date.getFullYear()}`;
  };
  return (
    <>
      <div className="dashboard-top">
        <div className="top-content qu">
          {quizzes.length}
          <span>Quiz</span>
          <h6>Created</h6>
        </div>
        <div className="top-content cr">
          50 <span>questions</span>
          <h6>Created</h6>
        </div>
        <div className="top-content im">
          86 <span>Total</span>
          <h6>Impressions</h6>
        </div>
      </div>
      <div className="quiz-container">
        <h1 className="trending-quiz-title">Trending Quizzes</h1>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {!loading && (
          <div className="quizzes">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz">
                <h2>{quiz.title}</h2>
                <img src="./images/eyes.png" alt="impressions" />
                <p>Created on: {formatDate(quiz.date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TrendingQuizzes;
