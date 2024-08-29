import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPollQuestions } from "../../../../api/pollQuestion";
import toast from "react-hot-toast";

function PollQuestions() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: [
        { text: "", imageURL: "", votes: 0 },
        { text: "", imageURL: "", votes: 0 },
      ],
      optionType: "text", // Adding this to manage the option type
    },
  ]);
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: [
          { text: "", imageURL: "", votes: 0 },
          { text: "", imageURL: "", votes: 0 },
        ],
        optionType: "text", // Defaulting to text
      },
    ]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleOptionTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].optionType = value;
    updatedQuestions[index].options = [
      { text: "", imageURL: "", votes: 0 },
      { text: "", imageURL: "", votes: 0 },
    ];
    setQuestions(updatedQuestions);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      imageURL: "",
      votes: 0,
    });
    setQuestions(updatedQuestions);
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

  const fullPath = params["*"];
  const quizId = fullPath.split("/").pop();

  const handleSubmit = async (e) => {
    for (const question of questions) {
      console.log("question id", quizId);
      console.log("question", question.question);
      console.log("question options", question.options);
      console.log("question optionType", question.optionType);
    }

    e.preventDefault();

    try {
      for (const question of questions) {
        const response = await createPollQuestions({
          quizId,
          question: question.question,
          optionType: question.optionType,
          options: question.options,
        });
        console.log("poll question", response);

        if (response.status !== 201) {
          throw new Error(`Failed to add question: ${question.question}`);
        }
      }
      toast.success("Questions added successfully");
      navigate(`/quiz/${quizId}/questions/poll`);
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
            +
          </button>
        )}
        <label className="max-question">Max 5 questions</label>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map(
          (question, questionIndex) =>
            questionIndex === currentQuestionIndex && (
              <div key={question.id} className="question-container">
                <input
                  className="input-question"
                  type="text"
                  placeholder="Enter your poll question"
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
                <label
                  htmlFor={`text-${questionIndex}`}
                  className="text-option"
                >
                  Text
                </label>

                <input
                  className="option-radio"
                  type="radio"
                  name={`optionType-${questionIndex}`}
                  value="imageURL"
                  id={`image-${questionIndex}`}
                  checked={question.optionType === "imageURL"}
                  onChange={(e) =>
                    handleOptionTypeChange(questionIndex, e.target.value)
                  }
                />
                <label
                  htmlFor={`image-${questionIndex}`}
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
                          className="option-input"
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option.text}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[
                              optionIndex
                            ].text = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
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
                          className="option-input"
                          type="text"
                          placeholder="Image URL"
                          value={option.imageURL}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[
                              optionIndex
                            ].imageURL = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
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
                          className="option-input txt1"
                          type="text"
                          placeholder="Option Text"
                          value={option.text}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[
                              optionIndex
                            ].text = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        <input
                          className="option-input txt2"
                          type="text"
                          placeholder="Image URL"
                          value={option.imageURL}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[
                              optionIndex
                            ].imageURL = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
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

                <button className="submit-btn" type="submit">
                  Create Quiz
                </button>
              </div>
            )
        )}
      </form>
    </>
  );
}

export default PollQuestions;
