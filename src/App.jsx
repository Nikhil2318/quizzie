import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import DashBoard from "./components/DashBoard/DashBoard";
// import Analytics from "./components/DashBoard/Analytics/Analytics";
// import CreateQuiz from "./components/DashBoard/CreateQuiz/CreateQuiz";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<DashBoard />} />
        {/* <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/createQuiz" element={<CreateQuiz />} /> */}
      </Routes>
    </>
  );
}

export default App;
