import React, { useState } from "react";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f9",
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
  form: { width: "100%" },
  formGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "1.1rem"
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
  errorText: {
    color: "red",
    marginTop: "8px",
  }
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to send reset link.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Failed to connect to server.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerBox}>
        <h2 style={styles.heading}>Forgot Password</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Enter your email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                placeholder="Email address"
                required
              />
            </div>
            <button type="submit" style={styles.button}>Send Reset Link</button>
            {error && <p style={styles.errorText}>{error}</p>}
          </form>
        ) : (
          <p style={{ color: "green", marginTop: 20 }}>
            If an account exists, a reset link will be sent to your email.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
