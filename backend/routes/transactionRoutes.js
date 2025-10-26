import express from "express";
import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getUserTransactions
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/deposit", depositMoney);
router.post("/withdraw", withdrawMoney);
router.post("/transfer", transferMoney);
router.get("/history/:account_id", getUserTransactions);

export default router;
