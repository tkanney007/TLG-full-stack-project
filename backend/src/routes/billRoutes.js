const express = require("express");
const router = express.Router();
const {
  getBillsByBudgetID,
  addBill,
  updateBill,
  deleteBill,
} = require("../controllers/billController");

router.get("/", getBillsByBudgetID);
router.post("/", addBill);
router.put("/", updateBill);
router.delete("/", deleteBill);

module.exports = router;
