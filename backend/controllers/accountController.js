import db from "../db.js";

/**
 * Create a new account for a user with opening balance.
 */
export const createAccount = (req, res) => {
  const { userId, accountType, openingBalance } = req.body;
  if (!userId || !accountType)
    return res.status(400).json({ message: "Missing userId or accountType" });

  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const initialBalance = openingBalance ? parseFloat(openingBalance) : 0.00;

  const query = `
    INSERT INTO accounts (user_id, account_number, account_type, balance)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [userId, accountNumber, accountType, initialBalance], (err) => {
    if (err) {
      console.error("Database error on create:", err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(201).json({ message: "Account created successfully!" });
  });
};

/**
 * Get all accounts for a user
 */
export const getUserAccounts = (req, res) => {
  const { user_id } = req.params;
  const query = `
    SELECT account_id, account_number, account_type, balance
    FROM accounts
    WHERE user_id = ?
  `;
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Database error on fetch:", err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.json(results);
  });
};

/**
 * Get a specific account balance by account number
 */
export const getAccountBalance = (req, res) => {
  const { account_number } = req.params;
  const query = `
    SELECT account_type, balance
    FROM accounts
    WHERE account_number = ?
  `;
  db.query(query, [account_number], (err, results) => {
    if (err) {
      console.error("Database error on fetch balance:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0)
      return res.status(404).json({ message: "Account not found" });
    return res.json(results[0]);
  });
};
