import React from "react";
import { Link } from "react-router-dom";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: 'url("/b1.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    paddingTop: 60,
  },
  title: {
    fontWeight: "bold",
    fontSize: "2.5rem",
    marginBottom: 20,
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  link: {
    padding: "12px 20px",
    borderRadius: 8,
    background: "#007bff",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

const Home = () => (
  <div style={styles.container}>
    <div style={styles.title}>Home</div>
    <nav style={styles.nav}>
      <Link to="/login" style={styles.link}>Login</Link>
      <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      <Link to="/transactions" style={styles.link}>Transactions</Link>
      <Link to="/forgot-password" style={styles.link}>Forgot Password</Link>
    </nav>
  </div>
);

export default Home;
