const express = require("express");
const router = express.Router();
const {
  getBillsByBudgetID,
  addBill,
  updateBill,
  deleteBill,
} = require("../controllers/billController");

router.get("/:budget_id", getBillsByBudgetID);
router.post("/", addBill);
router.put("/", updateBill);
router.delete("/:bill_id", deleteBill);

module.exports = router;
