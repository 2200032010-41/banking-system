import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#f4f4f9",
    padding: "32px 0"
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: "16px 0 24px 0",
  },
  select: {
    marginBottom: 16,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  table: {
    borderCollapse: "collapse",
    marginTop: 16,
    boxShadow: "0 0 12px 2px #eee"
  },
  th: {
    background: "#007bff",
    color: "#fff",
    padding: "10px",
    border: "1px solid #dee2e6",
    fontSize: "1rem"
  },
  td: {
    background: "#fff",
    padding: "10px",
    border: "1px solid #dee2e6",
    textAlign: "center"
  }
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    let user = null;
    try {
      const userJson = localStorage.getItem("user");
      if (userJson && userJson !== "undefined") user = JSON.parse(userJson);
    } catch {
      user = null;
    }
    if (!user) return;

    (async () => {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const res = await axios.get(`${backendUrl}/api/accounts/user/${user.id}`);
      setAccounts(res.data);
      if (res.data.length > 0) setAccountId(res.data[0].account_id);
    })();
  }, []);

  useEffect(() => {
    if (!accountId) return;
    const fetchTransactions = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const response = await axios.get(
          `${backendUrl}/api/transactions/history/${accountId}`
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [accountId]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧾 Transaction History</h2>
      <select
        value={accountId}
        onChange={e => setAccountId(e.target.value)}
        style={styles.select}
      >
        {accounts.map(acc => (
          <option key={acc.account_id} value={acc.account_id}>
            {acc.account_number} (ID: {acc.account_id})
          </option>
        ))}
      </select>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Sender Account</th>
            <th style={styles.th}>Receiver Account</th>
            <th style={styles.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => (
            <tr key={index}>
              <td style={styles.td}>{t.transaction_type}</td>
              <td style={styles.td}>{t.amount}</td>
              <td style={styles.td}>{t.from_account || "-"}</td>
              <td style={styles.td}>{t.to_account || "-"}</td>
              <td style={styles.td}>{new Date(t.transaction_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
