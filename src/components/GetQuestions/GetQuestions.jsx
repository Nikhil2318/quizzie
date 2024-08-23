import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestions } from "../../api/question";
import toast from "react-hot-toast";

function GetQuestions() {
  const [questions, setQuestions] = useState([]);
  //   const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { quizId } = useParams();

  // Extract the quizId from the path
  // console.log(params);

  useEffect(() => {
    const renderQuestions = async () => {
      try {
        const response = getQuestions(quizId);
        console.log(response);

        setQuestions(response);
      } catch (error) {
        toast.error(error);
      }
    };
    renderQuestions();
  }, [quizId]);
  return (
    <>
      <div>
        Question: {questions[currentQuestionIndex].question}
        <br />
        <button
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default GetQuestions;
