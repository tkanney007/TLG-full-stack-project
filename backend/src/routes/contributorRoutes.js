const express = require("express");
const router = express.Router();
const {
  getContribByBudgetID,
  addContributor,
  updateContributor,
  deleteContributor,
} = require("../controllers/contributorController");

router.get("/:budget_id", getContribByBudgetID);
router.post("/", addContributor);
router.put("/", updateContributor);
router.delete("/:contributor_id", deleteContributor);

module.exports = router;
