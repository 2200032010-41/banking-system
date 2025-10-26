import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;
  try {
    const userJson = localStorage.getItem("user");
    if (userJson && userJson !== "undefined") {
      user = JSON.parse(userJson);
    }
  } catch (err) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect back to login on logout
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.title}>🏦 Banking System</h2>
      <div style={styles.links}>
        {token ? (
          <>
            <div style={styles.profileContainer}>
              {user?.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt={user.name || "Profile"}
                  style={styles.profilePhoto}
                />
              ) : (
                <span style={styles.profileIcon} title="Profile">👤</span>
              )}
              <span style={styles.userName}>{user?.name}</span>
            </div>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/transactions" style={styles.link}>Transactions</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/transactions" style={styles.link}>Transactions</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: "10px 20px",
    color: "white",
  },
  title: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: "10px",
  },
  profilePhoto: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
  },
  profileIcon: {
    display: "inline-block",
    fontSize: "32px",
    marginRight: "10px",
  },
  userName: {
    fontWeight: "bold",
    color: "white",
    fontSize: "14px",
    marginTop: "2px",
  },
  logoutBtn: {
    background: "#0056b3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 16px",
    cursor: "pointer",
    marginLeft: "8px",
  }
};

export default Navbar;
