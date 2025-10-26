import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use env var for backend URL for flexibility
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const res = await axios.post(
        `${backendUrl}/api/auth/register`,
        formData
      );
      setMessage("Signup successful! Please log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error signing up. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Signup</h2>
      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
          autoComplete="name"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
          autoComplete="new-password"
        />
        <button type="submit" style={styles.button}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundImage: 'url("/S1.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: 20,
  },
  heading: {
    fontSize: "2rem",
    marginBottom: 24,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  message: {
    color: "green",
    marginBottom: 12,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: 300,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: 10,
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
};

export default Signup;
