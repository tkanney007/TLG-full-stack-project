const PayDay = require("../models/payDayModel");
const Bill = require("../models/billModel");
const PayCheck = require("../models/payCheckModel");

const getPayCheckByContribID = async (req, res) => {
  try {
    const result = await PayCheck.findAll({
      where: {
        budget_id: req.body.budget_id,
        contributor_id: req.body.contributor_id,
      },
      attributes: [
        ["id", "pay_check_id"],
        "pay_check_name",
        "start_pay_date",
        "end_pay_date",
        "budget_id",
        "contributor_id",
        "interval_id",
      ],
    });
    if (result) {
      return res.status(200).json(result);
    }
    return res
      .status(400)
      .json({ message: "No paychecks found for this contributor." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
