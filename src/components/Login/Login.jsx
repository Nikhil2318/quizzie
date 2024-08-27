import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./login.css";

function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userData;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmitL = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      const response = await login({ email, password });
      console.log(response);
      if (response.status === 200) {
        toast.success("Logged in successfully");
        setUserData({ email: "", password: "" });
        localStorage.setItem("token", response.data.token);
        setLoading(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to login. Please check your credentials");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmitL}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
        <div className="form-group a">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        <button className="submit-btn" disabled={loading} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
