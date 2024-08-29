import axios from "axios";
import { BACKEND_URL } from "../utils/constant";
import qs from "qs";

export const createPollQuestions = ({
  quizId,
  question,
  optionType,
  options,
}) => {
  try {
    const response = axios.post(
      `${BACKEND_URL}/api/quiz/pollQuestion/${quizId}/createPoll`,
      qs.stringify({
        question,
        optionType,
        options,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating poll question:", error);
    throw error;
  }
};

export const getPollQuestions = (quizId) => {
  try {
    const response = axios.get(
      `${BACKEND_URL}/api/quiz/pollQuestion/${quizId}/poll-questions`
    );
    return response;
  } catch (error) {
    console.error("Error getting poll questions:", error);
    throw error;
  }
};

// export const icrementVote = (questionId, optionId) => {
//   try {
//     const response = axios.put(
//       `${BACKEND_URL}/api/quiz/pollQuestion/${questionId}/options/${optionId}`
//     );
//     return response;
//   } catch (error) {
//     console.error("Error incrementing vote:", error);
//     throw error;
//   }
// };
