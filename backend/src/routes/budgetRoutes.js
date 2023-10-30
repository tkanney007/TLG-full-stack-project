const express = require("express");
const router = express.Router();
const {
  getBudgetsByUserID,
  addBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.get("/", getBudgetsByUserID);
router.post("/", addBudget);
router.put("/", updateBudget);
router.delete("/", deleteBudget);

module.exports = router;
