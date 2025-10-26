import bcrypt from "bcryptjs";
import db from "../db.js";

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  // Validate token and expiry
  db.query(
    "SELECT * FROM users WHERE reset_token=? AND reset_token_expiry > NOW()",
    [token],
    async (err, users) => {
      if (err || !users || users.length === 0) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "UPDATE users SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE user_id=?",
        [hashedPassword, users[0].user_id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ message: "Could not reset password." });
          }
          return res.json({ message: "Password updated successfully!" });
        }
      );
    }
  );
};
