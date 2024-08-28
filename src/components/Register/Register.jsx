import { useState } from "react";
import { register } from "../../api/auth";
import toast from "react-hot-toast";
import "./register.css";

function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = userData;
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let validationErrors = {};

    if (!name) validationErrors.name = "Invalid name";
    if (!email) validationErrors.email = "Invalid email";
    if (!password) validationErrors.password = "Invalid password";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Invalid confirm password";
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await register({ name, email, password });
      if (response.status === 200) {
        toast.success("Registered successfully");
        setUserData({ name: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
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
            placeholder={errors.name || "Enter your name"}
            onChange={handleChange}
            autoComplete="name"
            className={errors.name ? "error" : ""}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder={errors.email || "Enter your email"}
            onChange={handleChange}
            autoComplete="email"
            className={errors.email ? "error" : ""}
          />
        </div>
        <div className="form-group a">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder={errors.password || "Enter your password"}
            onChange={handleChange}
            autoComplete="current-password"
            className={errors.password ? "error" : ""}
          />
        </div>
        <div className="form-group b">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder={errors.confirmPassword || "Confirm your password"}
            onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""}
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
