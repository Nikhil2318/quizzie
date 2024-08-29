import { useState } from "react";
import "./QuizQuestions.css";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestions } from "../../../../api/question";
import toast from "react-hot-toast";

function QuizQuestions() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: [
        { text: "", imageURL: "" }, // Default option 1
        { text: "", imageURL: "" }, // Default option 2
      ],
      answer: "",
      timer: "off",
      optionType: "text",
    },
  ]);
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleOptionTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].optionType = value;
    // Reset options if the type changes to ensure compatibility
    updatedQuestions[index].options = [
      { text: "", imageURL: "" }, // Default option 1
      { text: "", imageURL: "" }, // Default option 2
    ];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({ text: "", imageURL: "" });
    setQuestions(updatedQuestions);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: [
          { text: "", imageURL: "" }, // Default option 1
          { text: "", imageURL: "" }, // Default option 2
        ],
        answer: "",
        timer: "off",
        optionType: "text",
      },
    ]);
    setCurrentQuestionIndex(questions.length);
  };

  const deleteQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    }
  };

  const params = useParams();

  // Extract the quizId from the path
  const fullPath = params["*"];
  const quizId = fullPath.split("/").pop();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Iterate through each question and send it individually
    try {
      for (const question of questions) {
        const response = await createQuestions({
          quizId,
          question: question.question,
          optionType: question.optionType,
          options: question.options,
          correctOption: question.answer,
          timer: question.timer,
        });

        if (response.status !== 201) {
          throw new Error(`Failed to add question: ${question.question}`);
        }
      }

      toast.success("Questions added successfully");
      navigate(`/quiz/${quizId}/questions/view`);
    } catch (error) {
      toast.error("Failed to add questions");
      console.error("Submission error:", error);
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        {questions.map((q, index) => (
          <div key={index} style={{ position: "relative" }}>
            <button
              onClick={() => setCurrentQuestionIndex(index)}
              className="question-index"
            >
              {index + 1}
            </button>
            <button
              onClick={() => deleteQuestion(index)}
              className="delete-btn"
              style={{
                display: index === currentQuestionIndex ? "block" : "none",
              }}
            >
              X
            </button>
          </div>
        ))}
        {questions.length < 5 && (
          <button onClick={addQuestion} className="add-question">
            +{" "}
          </button>
        )}
        <label className="max-question">Max 5 questions</label>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((question, questionIndex) =>
          questionIndex === currentQuestionIndex ? (
            <div key={question.id} className="question-container">
              <input
                className="input-question"
                type="text"
                placeholder="Enter your question"
                value={question.question}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[questionIndex].question = e.target.value;
                  setQuestions(updatedQuestions);
                }}
              />
              <br />

              <label className="option-type sta">Option type:</label>
              <input
                className="option-radio"
                type="radio"
                name={`optionType-${questionIndex}`}
                value="text"
                id={`text-${questionIndex}`}
                checked={question.optionType === "text"}
                onChange={(e) =>
                  handleOptionTypeChange(questionIndex, e.target.value)
                }
              />
              <label htmlFor={`text-${questionIndex}`} className="text-option">
                Text
              </label>

              <input
                className="option-radio"
                type="radio"
                name={`optionType-${questionIndex}`}
                value="imageURL"
                id={`imageURL-${questionIndex}`}
                checked={question.optionType === "imageURL"}
                onChange={(e) =>
                  handleOptionTypeChange(questionIndex, e.target.value)
                }
              />
              <label
                htmlFor={`imageURL-${questionIndex}`}
                className="text-option"
              >
                Image URL
              </label>

              <input
                className="option-radio"
                type="radio"
                name={`optionType-${questionIndex}`}
                value="text&imageURL"
                id={`text&imageURL-${questionIndex}`}
                checked={question.optionType === "text&imageURL"}
                onChange={(e) =>
                  handleOptionTypeChange(questionIndex, e.target.value)
                }
              />
              <label
                htmlFor={`text&imageURL-${questionIndex}`}
                className="text-option"
              >
                Text & Image URL
              </label>
              <br />

              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  {question.optionType === "text" && (
                    <div>
                      <input
                        className="options-radio"
                        type="radio"
                        name={`answer-${questionIndex}`}
                        value={option.text}
                        checked={question.answer === option.text}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].answer =
                            e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                      <input
                        className="option-input"
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            "text",
                            e.target.value
                          )
                        }
                      />
                      {optionIndex >= 2 && (
                        <button
                          type="button"
                          className="deleteBtn"
                          onClick={() =>
                            deleteOption(questionIndex, optionIndex)
                          }
                        >
                          <img
                            src="/images/delete.png"
                            alt="deleteImg"
                            className="deleteImg"
                          />
                        </button>
                      )}
                    </div>
                  )}
                  {question.optionType === "imageURL" && (
                    <div>
                      <input
                        className="option-radio url"
                        type="radio"
                        name={`answer-${questionIndex}`}
                        value={option.imageURL}
                        checked={question.answer === option.imageURL}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].answer =
                            e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                      <input
                        className="option-input txt"
                        type="text"
                        placeholder={`Image URL ${optionIndex + 1}`}
                        value={option.imageURL}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            "imageURL",
                            e.target.value
                          )
                        }
                      />
                      {optionIndex >= 2 && (
                        <button
                          type="button"
                          className="deleteBtn"
                          onClick={() =>
                            deleteOption(questionIndex, optionIndex)
                          }
                        >
                          <img
                            src="/images/delete.png"
                            alt="deleteImg"
                            className="deleteImg"
                          />
                        </button>
                      )}
                    </div>
                  )}
                  {question.optionType === "text&imageURL" && (
                    <div>
                      <input
                        className="option-radio rdo"
                        type="radio"
                        name={`answer-${questionIndex}`}
                        value={`${option.text} ${option.imageURL}`}
                        checked={
                          question.answer ===
                          `${option.text} ${option.imageURL}`
                        }
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].answer =
                            e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                      <input
                        className="option-input txt1"
                        type="text"
                        placeholder={`Option ${optionIndex + 1} Text`}
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            "text",
                            e.target.value
                          )
                        }
                      />
                      <input
                        className="option-input txt2"
                        type="text"
                        placeholder={`Option ${optionIndex + 1} Image URL`}
                        value={option.imageURL}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            "imageURL",
                            e.target.value
                          )
                        }
                      />
                      {optionIndex >= 2 && (
                        <button
                          type="button"
                          className="deleteBtn"
                          onClick={() =>
                            deleteOption(questionIndex, optionIndex)
                          }
                        >
                          <img
                            src="/images/delete.png"
                            alt="deleteImg"
                            className="deleteImg"
                          />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {question.options.length < 4 && (
                <button
                  type="button"
                  className="add-option"
                  onClick={() => addOption(questionIndex)}
                >
                  Add Option
                </button>
              )}
              <br />
              <div className="timer-container">
                <label className="timer-label">Timer:</label>
                <button
                  type="button"
                  className={question.timer === "off" ? "active" : ""}
                  onClick={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].timer = "off";
                    setQuestions(updatedQuestions);
                  }}
                >
                  Off
                </button>
                <button
                  type="button"
                  className={question.timer === "5sec" ? "active" : ""}
                  onClick={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].timer = "5sec";
                    setQuestions(updatedQuestions);
                  }}
                >
                  5 sec
                </button>
                <button
                  type="button"
                  className={question.timer === "10sec" ? "active" : ""}
                  onClick={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].timer = "10sec";
                    setQuestions(updatedQuestions);
                  }}
                >
                  10 sec
                </button>
              </div>
              <br />

              <button className="submit-btn" type="submit">
                Create Quiz
              </button>
            </div>
          ) : null
        )}
      </form>
    </>
  );
}

export default QuizQuestions;
