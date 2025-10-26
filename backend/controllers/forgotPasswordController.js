import db from "../db.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Always reply the same message to prevent user enumeration
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, users) => {
    if (err || !users || users.length === 0) {
      return res.status(200).json({ message: "If an account exists, a reset link will be sent to your email." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour expiry

    // Save token and expiry in database
    db.query(
      "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?",
      [token, expires, email],
      (updateErr, updateResult) => {
        if (updateErr || updateResult.affectedRows === 0) {
          console.error("DB UPDATE ERROR or no user updated");
          return;
        }

        // Set up email transporter
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          tls: { rejectUnauthorized: false },
        });

        // Build reset URL dynamically from environment variable
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Password Reset Link",
          html: `<p>Click <a href="${resetUrl}">${resetUrl}</a> to reset your password.</p>`
        };

        // Send email (background task)
        transporter.sendMail(mailOptions, (mailErr, info) => {
          if (mailErr) {
            console.error("MAIL ERROR:", mailErr);
          } else {
            console.log("Reset email sent:", info.response);
          }
        });
        // No need to wait, response already sent
        return res.status(200).json({ message: "If an account exists, a reset link will be sent to your email." });
      }
    );
  });
};
