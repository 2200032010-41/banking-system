import db from "../db.js";

// Deposit money
export const depositMoney = (req, res) => {
  const { account_id, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const updateBalance = "UPDATE accounts SET balance = balance + ? WHERE account_id = ?";
  const insertTransaction = `
    INSERT INTO transactions (from_account, transaction_type, amount)
    VALUES (?, 'credit', ?)
  `;

  db.query(updateBalance, [amount, account_id], (err) => {
    if (err) return res.status(500).json({ message: "Error updating balance" });

    db.query(insertTransaction, [account_id, amount], (err2) => {
      if (err2) return res.status(500).json({ message: "Error saving transaction" });
      res.json({ message: "Deposit successful" });
    });
  });
};

// Withdraw money
export const withdrawMoney = (req, res) => {
  const { account_id, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const getBalance = "SELECT balance FROM accounts WHERE account_id = ?";
  db.query(getBalance, [account_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching balance" });
    if (results.length === 0) return res.status(404).json({ message: "Account not found" });

    const currentBalance = results[0].balance;
    if (currentBalance < amount) return res.status(400).json({ message: "Insufficient funds" });

    const updateBalance = "UPDATE accounts SET balance = balance - ? WHERE account_id = ?";
    const insertTransaction = `
      INSERT INTO transactions (from_account, transaction_type, amount)
      VALUES (?, 'debit', ?)
    `;

    db.query(updateBalance, [amount, account_id], (err2) => {
      if (err2) return res.status(500).json({ message: "Error updating balance" });

      db.query(insertTransaction, [account_id, amount], (err3) => {
        if (err3) return res.status(500).json({ message: "Error saving transaction" });
        res.json({ message: "Withdrawal successful" });
      });
    });
  });
};

// Transfer money
export const transferMoney = (req, res) => {
  const { from_account, to_account, amount } = req.body;
  if (!from_account || !to_account || amount <= 0)
    return res.status(400).json({ message: "Invalid input" });

  // Check both accounts exist
  db.query(
    "SELECT account_id, balance FROM accounts WHERE account_id IN (?, ?)",
    [from_account, to_account],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error finding accounts" });
      if (results.length < 2)
        return res.status(404).json({ message: "Either sender or receiver account not found" });

      const sender = results.find(acc => acc.account_id === from_account);
      if (!sender) return res.status(404).json({ message: "Sender account not found" });
      if (sender.balance < amount)
        return res.status(400).json({ message: "Insufficient funds" });

      db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: "Transaction start error" });

        db.query(
          "UPDATE accounts SET balance = balance - ? WHERE account_id = ?",
          [amount, from_account],
          (err2) => {
            if (err2) return db.rollback(() => res.status(500).json({ message: "Error deducting sender balance" }));

            db.query(
              "UPDATE accounts SET balance = balance + ? WHERE account_id = ?",
              [amount, to_account],
              (err3) => {
                if (err3) return db.rollback(() => res.status(500).json({ message: "Error updating receiver balance" }));

                db.query(
                  "INSERT INTO transactions (from_account, to_account, transaction_type, amount) VALUES (?, ?, 'debit', ?)",
                  [from_account, to_account, amount],
                  (err4) => {
                    if (err4) return db.rollback(() => res.status(500).json({ message: "Error logging sender transaction" }));

                    db.query(
                      "INSERT INTO transactions (from_account, to_account, transaction_type, amount) VALUES (?, ?, 'credit', ?)",
                      [to_account, from_account, amount],
                      (err5) => {
                        if (err5) return db.rollback(() => res.status(500).json({ message: "Error logging receiver transaction" }));

                        db.commit((err6) => {
                          if (err6) return db.rollback(() => res.status(500).json({ message: "Commit error" }));
                          res.json({ message: "Transfer successful" });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    }
  );
};

// History
export const getUserTransactions = (req, res) => {
  const { account_id } = req.params;
  const query = `
    SELECT transaction_id, transaction_type, amount, from_account, to_account, transaction_date
    FROM transactions
    WHERE from_account = ? OR to_account = ?
    ORDER BY transaction_date DESC
  `;
  db.query(query, [parseInt(account_id, 10), parseInt(account_id, 10)], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching transactions" });
    res.json(results);
  });
};
