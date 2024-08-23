import axios from "axios";
import { BACKEND_URL } from "../utils/constant";
import qs from "qs";

export const createQuestions = ({
  quizId,
  question,
  optionType,
  options,
  correctOption,
  timer,
}) => {
  console.log("body", correctOption, timer);

  try {
    const response = axios.post(
      `${BACKEND_URL}/api/quiz/questions/${quizId}/createQuestion`,
      qs.stringify({
        question,
        optionType,
        options,
        correctOption,
        timer,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const getQuestions = (quizId) => {
  try {
    const response = axios.get(`${BACKEND_URL}/api/quiz/${quizId}questions`);
    return response.data;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};
