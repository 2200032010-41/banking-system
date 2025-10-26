import express from "express";
import {
  createAccount,
  getUserAccounts,
  getAccountBalance
} from "../controllers/accountController.js";

const router = express.Router();

router.post("/create", createAccount);
router.get("/user/:user_id", getUserAccounts);
router.get("/balance/:account_number", getAccountBalance);

export default router;
