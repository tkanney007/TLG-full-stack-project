const express = require("express");
const router = express.Router();
const {
  getPayCheckByContribID,
  addPayCheck,
  updatePayCheck,
  deletePayCheck,
} = require("../controllers/payCheckController");

router.get("/:budget_id/:contributor_id", getPayCheckByContribID);
router.post("/", addPayCheck);
router.put("/", updatePayCheck);
router.delete("/:pay_check_id", deletePayCheck);

module.exports = router;
