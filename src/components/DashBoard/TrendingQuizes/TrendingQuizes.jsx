import { useEffect, useState } from "react";
import { getQuiz } from "../../../api/quiz";

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
    <div className="quiz-container">
      <h1>Trending Quizzes</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && (
        <div className="quizzes">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz">
              <h2>{quiz.title}</h2>
              <p>Created on: {formatDate(quiz.date)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingQuizzes;
