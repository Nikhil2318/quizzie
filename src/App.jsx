import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import DashBoard from "./components/DashBoard/DashBoard";
import GetQuestions from "./components/GetQuestions/GetQuestions";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<DashBoard />} />
        <Route path="/quiz/:quizId/questions/view" element={<GetQuestions />} />
        {/* <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/createQuiz" element={<CreateQuiz />} /> */}
      </Routes>
    </>
  );
}

export default App;
