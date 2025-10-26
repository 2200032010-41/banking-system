import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState("Savings");
  const [openingBalance, setOpeningBalance] = useState("");
  const [msg, setMsg] = useState("");
  // Transfer form state
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferMsg, setTransferMsg] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [balanceInfo, setBalanceInfo] = useState(null);
  const navigate = useNavigate();

  let user = null;
  try {
    const userJson = localStorage.getItem("user");
    if (userJson && userJson !== "undefined") user = JSON.parse(userJson);
  } catch {
    user = null;
  }

  // --- SESSION TIMEOUT HANDLER ---
  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.removeItem("user");
        alert("Session timed out due to inactivity.");
        navigate("/login");
      }, SESSION_TIMEOUT);
    };
    const activityEvents = ["mousemove", "keydown", "wheel", "mousedown", "touchstart"];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);
  // --- END SESSION TIMEOUT HANDLER ---

  useEffect(() => {
    async function fetchAccounts() {
      if (!user || !user.id) return;
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const res = await axios.get(`${backendUrl}/api/accounts/user/${user.id}`);
        setAccounts(res.data);
      } catch {
        setAccounts([]);
      }
      setLoading(false);
    }
    fetchAccounts();
  }, [user]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      await axios.post(`${backendUrl}/api/accounts/create`, {
        userId: user.id,
        accountType,
        openingBalance: openingBalance ? openingBalance : 0.00
      });
      setMsg("Account created!");
      setOpeningBalance("");
      setShowCreate(false);
      const res = await axios.get(`${backendUrl}/api/accounts/user/${user.id}`);
      setAccounts(res.data);
    } catch {
      setMsg("Error creating account.");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    // ENFORCE MINIMUM AMOUNT
    if (parseFloat(transferAmount) < 500) {
      setTransferMsg("Minimum transfer amount is ₹500.");
      return;
    }
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      await axios.post(`${backendUrl}/api/transactions/transfer`, {
        from_account: parseInt(fromAccountId, 10),
        to_account: parseInt(toAccountId, 10),
        amount: parseFloat(transferAmount)
      });
      setTransferMsg("Transfer successful!");
      setFromAccountId("");
      setToAccountId("");
      setTransferAmount("");
      setShowTransfer(false);
      const res = await axios.get(`${backendUrl}/api/accounts/user/${user.id}`);
      setAccounts(res.data);
    } catch {
      setTransferMsg("Error making transfer.");
    }
  };

  // ---- BALANCE CHECK LOGIC ----
  const handleCheckBalance = () => {
    const found = accounts.find(acc => acc.account_id === parseInt(selectedAccountId, 10));
    setBalanceInfo(found || null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Your Dashboard</h1>
      <p style={styles.text}>
        Here you can view your account details, check transactions, and manage your finances.
      </p>
      <div style={styles.card}>
        <h3>Check Account Balance</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <select
              value={selectedAccountId}
              onChange={e => setSelectedAccountId(e.target.value)}
              style={{ marginRight: 12 }}
            >
              <option value="">Select Account</option>
              {accounts.map(acc => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.account_number} ({acc.account_type})
                </option>
              ))}
            </select>
            <button
              onClick={handleCheckBalance}
              disabled={!selectedAccountId}
              style={{ padding: "6px 14px" }}
            >
              Check Balance
            </button>
            {balanceInfo && (
              <div style={{ marginTop: 18 }}>
                <strong>Account Number:</strong> {balanceInfo.account_number}<br />
                <strong>Type:</strong> {balanceInfo.account_type}<br />
                <strong>Balance:</strong> ₹{Number(balanceInfo.balance).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Account creation button and form */}
        <div>
          {!showCreate ? (
            <button
              style={{ margin: "12px 0", padding: "8px 16px", borderRadius: "5px" }}
              onClick={() => setShowCreate(true)}
            >
              Create Account
            </button>
          ) : (
            <form onSubmit={handleCreateAccount} style={{ marginTop: 8 }}>
              <label>
                Type:
                <select
                  value={accountType}
                  onChange={e => setAccountType(e.target.value)}
                  style={{ marginLeft: 8, marginRight: 12 }}
                >
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </label>
              <input
                type="number"
                value={openingBalance}
                placeholder="Opening Balance"
                onChange={e => setOpeningBalance(e.target.value)}
                style={{ width: 110, marginRight: 10, padding: "4px 10px" }}
                min="0"
              />
              <button type="submit" style={{ padding: "6px 16px", borderRadius: "5px", marginRight: 8 }}>
                Submit
              </button>
              <button
                type="button"
                onClick={() => { setShowCreate(false); setMsg(""); }}
                style={{ padding: "6px 12px", borderRadius: "5px", background: "#f0f0f0" }}
              >
                Cancel
              </button>
              {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
            </form>
          )}
        </div>

        {/* Transfer Money: button first, then form on demand */}
        <h4 style={{ marginTop: 32 }}>Transfer Money</h4>
        {!showTransfer ? (
          <button
            style={{ margin: "12px 0", padding: "8px 16px", borderRadius: "5px" }}
            onClick={() => setShowTransfer(true)}
          >
            Transfer
          </button>
        ) : (
          <form onSubmit={handleTransfer} style={{ marginTop: 8 }}>
            <label>
              From Account:
              <select
                required
                value={fromAccountId}
                onChange={e => setFromAccountId(e.target.value)}
                style={{ marginRight: 8, width: 150 }}
              >
                <option value="">Select</option>
                {accounts.map(acc => (
                  <option key={acc.account_id} value={acc.account_id}>
                    {acc.account_number} (ID: {acc.account_id})
                  </option>
                ))}
              </select>
            </label>
            <label>
              To Account:
              <select
                required
                value={toAccountId}
                onChange={e => setToAccountId(e.target.value)}
                style={{ marginRight: 8, width: 150 }}
              >
                <option value="">Select</option>
                {accounts.map(acc => (
                  <option key={acc.account_id} value={acc.account_id}>
                    {acc.account_number} (ID: {acc.account_id})
                  </option>
                ))}
              </select>
            </label>
            <input
              type="number"
              placeholder="Amount"
              required
              min="500"
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
              style={{ marginRight: 8, width: 100 }}
            />
            <button type="submit" style={{ marginRight: 8 }}>Submit</button>
            <button
              type="button"
              onClick={() => { setShowTransfer(false); setTransferMsg(""); }}
              style={{ padding: "6px 12px", borderRadius: "5px", background: "#f0f0f0" }}
            >
              Cancel
            </button>
            {transferMsg && <div style={{ marginTop: 8 }}>{transferMsg}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f0f4ff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: { color: "#333" },
  text: { margin: "10px 0 20px", color: "#555" },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "370px",
    textAlign: "left",
  },
};

export default Dashboard;
