import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestions } from "../../api/question"; // Assuming this is the function that fetches questions
import toast from "react-hot-toast";

function GetQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { quizId } = useParams();

  useEffect(() => {
    const renderQuestions = async () => {
      try {
        const response = await getQuestions(quizId); // Ensure you await the API call
        console.log(response.data);
        setQuestions(response.data); // Update state with fetched questions
      } catch (error) {
        toast.error("Failed to fetch questions"); // Display error message
        console.error(error);
      }
    };
    renderQuestions();
  }, [quizId]);

  // Get the current question based on the index
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Quiz Questions</h1>

      {currentQuestion ? (
        <div>
          <h2>{currentQuestion.question}</h2>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          <h4>Timer: {currentQuestion.timer}</h4>
          <h4> Correct ans : {currentQuestion.correctOption}</h4>
          <button
            onClick={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                toast("You have reached the end of the quiz.");
              }
            }}
          >
            Next
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GetQuestions;
