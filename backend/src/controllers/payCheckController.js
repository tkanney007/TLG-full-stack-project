const PayDay = require("../models/payDayModel");
const Bill = require("../models/billModel");
const PayCheck = require("../models/payCheckModel");
const Interval = require("../models/intervalModel");
const moment = require("moment");

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
        // "end_pay_date",
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

const addPayCheck = async (req, res) => {
  try {
    await PayCheck.create({
      pay_check_name: req.body.pay_check_name,
      start_pay_date: req.body.start_pay_date,
      //   end_pay_date: req.body.end_pay_date,
      budget_id: req.body.budget_id,
      contributor_id: req.body.contributor_id,
      interval_id: req.body.interval_id,
    });
    const result = await PayCheck.findOne({
      where: {
        pay_check_name: req.body.pay_check_name,
        budget_id: req.body.budget_id,
        contributor_id: req.body.contributor_id,
      },
      attributes: [
        ["id", "pay_check_id"],
        "pay_check_name",
        "start_pay_date",
        // "end_pay_date",
        "budget_id",
        "contributor_id",
        "interval_id",
      ],
    });

    if (result) {
      if (!createPayDays(result)) {
        await Paycheck.destroy({ where: { id: result.pay_check_id } });
        return res.status(500).json({
          message:
            "The following paycheck record was added but has subsequently been deleted because pay days couldn't be created for it:",
          result,
        });
      }
      return res.status(200).json(result);
    }
    return res.status(204).json({ message: "Couldn't return added paycheck" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const createPayDays = async (paycheck) => {
  try {
    const interval = await Interval.findByPk(paycheck.interval_id);
    if (interval) {
      // create an array of objects that will be flushed to PayDays table. Load with the first payday specified for PayCheck
      let paydays = [
        {
          pay_date: moment(paycheck.pay_date).format("L"),
          budget_id: paycheck.budget_id,
          contributor_id: paycheck.contributor_id,
        },
      ];
      // Get the next pay day date by adding the num_days from the paycheck interval.
      let nextPayDate = moment(paycheck.pay_date)
        .add(interval.num_days, "days")
        .format("L");
      // Use the number of pays indicated on the paycheck interval to create 1 years worth of paydays in the future.
      for (let i = 0; i < interval.num_pays; i++) {
        let payday = {
          pay_date: nextPayDate,
          budget_id: paycheck.budget_id,
          contributor_id: paycheck.contributor_id,
        };
        // Add the payday object to the paydays array of objects
        paydays.push(payday);
        // Get the next pay day date by adding the num_days from the paycheck interval.
        nextPayDate = moment(paycheck.pay_date)
          .add(interval.num_days, "days")
          .format("L");
      }
      // if the paydays array is empty return
      if (!paydays.length) {
        return false;
      }
      console.log(paydays);
      //Create all the paydays in the payday array
      await PayDay.bulkCreate(paydays);
      return true;
    }
  } catch (error) {
    console.log(
      `Error creating paydays for paycheck ${paycheck.pay_check_name} that belongs to contributor id ${paycheck.contributor_id} and belongs to budget id ${paycheck.budget_id}. Error message: ${error}.`
    );
    return false;
  }
};

const updatePayCheck = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  getPayCheckByContribID,
  addPayCheck,
  updatePayCheck,
};
