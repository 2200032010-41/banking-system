import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      // Use localhost for local development
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerBox}>
        <h2 style={styles.heading}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <div style={{ marginTop: "10px", width: "100%", textAlign: "right" }}>
          <Link to="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
        </div>
        <p style={styles.signupText}>
          Don’t have an account?{" "}
          <Link to="/signup" style={styles.signupLink}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: 'url("/L11.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  innerBox: {
    backgroundColor: "#fff",
    boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
    borderRadius: "20px",
    padding: "32px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "12px",
  },
  form: { width: "100%" },
  formGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "7px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "7px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "8px",
  },
  forgotLink: {
    color: "#007bff",
    textDecoration: "underline",
    fontSize: "1rem",
    cursor: "pointer",
  },
  signupText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "1rem",
  },
  signupLink: {
    color: "#007bff",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};

export default Login;
