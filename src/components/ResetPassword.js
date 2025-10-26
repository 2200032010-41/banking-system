import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
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
    fontSize: "1.1rem",
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
  error: {
    color: "red",
    marginTop: "12px",
  },
  success: {
    color: "green",
    marginTop: "12px",
  },
};

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!password || !confirm) {
      setMessage("Please enter and confirm the new password.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // Use env variable for backend URL (best practice!)
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Could not reset password.");
      }
    } catch {
      setMessage("Connection error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerBox}>
        <h2 style={styles.heading}>Reset Password</h2>
        <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter new password"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirm-password">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={styles.input}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {message && (
          <p style={success ? styles.success : styles.error}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
