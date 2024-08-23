import { useState, useEffect } from "react";
import { getQuiz } from "../../../api/quiz";
import "./Analytics.css";

const TrendingQuizzes = () => {
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
    const month = months[date.getMonth()];
    return `${date.getDate()} ${month.substring(0, 3)}, ${date.getFullYear()}`;
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
          {quizzes.map((quiz, index) => (
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
                <span className="icon delete" title="Delete"></span>
                <span className="icon share" title="Share"></span>
                <a href="#!" className="analysis-link">
                  Question Wise Analysis
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendingQuizzes;
