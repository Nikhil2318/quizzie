import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./register.css";

function Register() {
  const [userData, setUserData] = useState({
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
  });
  const { name, email, password, confirmPassword } = userData;
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  //Navigate
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (confirmPassword !== password) {
      toast.error("Passwords do not match");
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await register({ name, email, password });
      console.log(response);
      if (response.status === 200) {
        toast.success("registered sucessfully");
        navigate("/login");
        setUserData({ name: "", email: "", password: "" });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to register");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            placeholder="Enter your name"
            onChange={handleChange}
            autoComplete="name"
          />
        </div>
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
        <div className="form-group b">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm your password"
            onChange={handleChange}
            // autoComplete="current-password"
          />
        </div>
        <button className="submit-btn" disabled={loading} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
