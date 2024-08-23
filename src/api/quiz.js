import axios from "axios";
import qs from "qs";
import { BACKEND_URL } from "../utils/constant";

export const createQuiz = async ({ title, type }) => {
  const data = qs.stringify({
    title,
    type,
  });
  // console.log("data sent:" + data);

  try {
    const response = await axios.post(`${BACKEND_URL}/api/quiz`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const getQuiz = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/quiz`);
    console.log(response);

    return response.data;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

// export const getQuizByid = async() => {
//     try {
//       const response = await axios.get(`${BACKEND_URL}/api/quiz`);
//       return response.data;
//     } catch (error) {

//     }
// }
