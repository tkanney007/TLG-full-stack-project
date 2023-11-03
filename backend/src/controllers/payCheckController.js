const PayDay = require("../models/payDayModel");
const Bill = require("../models/billModel");
const PayCheck = require("../models/payCheckModel");
const Interval = require("../models/intervalModel");
const moment = require("moment");

const getPayCheckByContribID = async (req, res) => {
  try {
    const result = await PayCheck.findAll({
      where: {
        budget_id: req.params.budget_id,
        contributor_id: req.params.contributor_id,
      },
      attributes: [
        ["id", "pay_check_id"],
        "pay_check_name",
        "start_pay_date",
        "pay_amount_est",
        // "end_pay_date",
        "budget_id",
        "contributor_id",
        "interval_id",
      ],
    });
    if (!result) {
      return res.status(404).json({
        success: true,
        message: "No paychecks found for this contributor.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Paychecks retrieved for budget provided.",
      result,
    });
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred while fetching the paycheck record(s).",
        error: error,
      })
      .status(500);
  }
};

const addPayCheck = async (req, res) => {
  try {
    console.log(req.body);
    await PayCheck.create({
      pay_check_name: req.body.pay_check_name,
      start_pay_date: req.body.start_pay_date,
      pay_amount_est: req.body.pay_amount_est,
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
        "pay_amount_est",
        // "end_pay_date",
        "budget_id",
        "contributor_id",
        "interval_id",
      ],
    });

    if (result == null) {
      return res
        .json({
          success: true,
          message: "Couldn't return added paycheck.",
        })
        .status(204);
    }
    const interval = await Interval.findOne({
      where: { id: result.dataValues.interval_id },
      attributes: [
        ["id", "interval_id"],
        "interval_name",
        "description",
        "num_days",
        "num_pays",
      ],
    });
    if (!createPayDays(result.dataValues, interval.dataValues)) {
      await Paycheck.destroy({ where: { id: result.dataValues.pay_check_id } });
      return res.status(500).json({
        message:
          "The following paycheck record was added but has subsequently been deleted because pay days couldn't be created for it:",
        result,
      });
    }
    return res
      .json({
        success: true,
        message: "Paycheck successfully added.",
        result,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when adding the paycheck record.",
        error: error,
      })
      .status(500);
  }
};

const createPayDays = (paycheck, interval) => {
  try {
    console.log("Create Paydays!", paycheck);
    if (interval != null) {
      moment.suppressDeprecationWarnings = true;
      // create an array of objects that will be flushed to PayDays table. Load with the first payday specified for PayCheck
      let paydays = [
        {
          pay_date: moment(paycheck.start_pay_date).format("L"),
          pay_amount_act: paycheck.pay_amount_est,
          budget_id: paycheck.budget_id,
          contributor_id: paycheck.contributor_id,
          pay_check_id: paycheck.pay_check_id,
        },
      ];
      // Get the next pay day date by adding the num_days from the paycheck interval.
      let nextPayDate = moment(paycheck.start_pay_date)
        .add(interval.num_days, "days")
        .format("L");
      // Use the number of pays indicated on the paycheck interval to create 1 years worth of paydays in the future.
      for (let i = 0; i < interval.num_pays; i++) {
        let payday = {
          pay_date: nextPayDate,
          pay_amount_act: paycheck.pay_amount_est,
          budget_id: paycheck.budget_id,
          contributor_id: paycheck.contributor_id,
          pay_check_id: paycheck.pay_check_id,
        };
        // Add the payday object to the paydays array of objects
        paydays.push(payday);

        moment.suppressDeprecationWarnings = true;
        // Get the next pay day date by adding the num_days from the paycheck interval.
        let subsequentPayDate = moment(nextPayDate)
          .add(interval.num_days, "days")
          .format("L");
        nextPayDate = subsequentPayDate;
      }
      // if the paydays array is empty return
      if (!paydays.length) {
        return false;
      }
      console.log(paydays);
      //Create all the paydays in the payday array
      const insertResult = PayDay.bulkCreate(paydays).then(() => {
        return true;
      });
      return insertResult;
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
    // get the paycheck that will be updated so we can see what is different from db record and req object
    const payCheckResult = await PayCheck.findByPk(req.body.pay_check_id, {
      attributes: [
        ["id", "pay_check_id"],
        "pay_check_name",
        "start_pay_date",
        "pay_amount_est",
        // "end_pay_date",
        "budget_id",
        "contributor_id",
        "interval_id",
      ],
    });
    // Check if we found a paycheck record
    if (payCheckResult == null) {
      //No paycheck return success false and message
      return res
        .json({
          success: false,
          message:
            "Cannot update paycheck because it was not found with the given paycheck id.",
        })
        .status(404);
    }
    // If we found a paycheck issue the update sent in request
    await PayCheck.update(
      {
        pay_check_name: req.body.pay_check_name,
        start_pay_date: req.body.start_pay_date,
        pay_amount_est: req.body.pay_amount_est,
        budget_id: req.body.budget_id,
        contributor_id: req.body.contributor_id,
        interval_id: req.body.interval_id,
      },
      { where: { id: payCheckResult.dataValues.pay_check_id } }
    );
    // Get the updated paycheck
    const payCheckUpdated = await PayCheck.findByPk(req.body.pay_check_id, {
      attributes: [
        ["id", "pay_check_id"],
        "pay_check_name",
        "start_pay_date",
        "pay_amount_est",
        // "end_pay_date",
        "budget_id",
        "contributor_id",
        "interval_id",
      ],
    });

    // Make sure we can get the updated record before we proceed.
    if (payCheckUpdated == null) {
      return res
        .json({
          success: false,
          message:
            "Cannot return paycheck after it was updated. Because of this the paycheck payday records have not been updated. Please try update again.",
          payCheckResult,
        })
        .status(404);
    }
    moment.suppressDeprecationWarnings = true;

    // Check if the paycheck start date changed
    if (
      moment(payCheckResult.dataValues.start_pay_date).format("L") !==
      moment(payCheckUpdated.dataValues.start_pay_date).format("L")
    ) {
      console.log("DELETE HHHERREEEEEREEREREREREREEREREREREREE");
      // If the paycheck start date changed we need to delete all the child paydays
      // and then recreate them starting with the new start date.
      await PayDay.destroy({
        where: { pay_check_id: payCheckResult.dataValues.pay_check_id },
      });

      const interval = await Interval.findOne({
        where: { id: payCheckResult.dataValues.interval_id },
        attributes: [
          ["id", "interval_id"],
          "interval_name",
          "description",
          "num_days",
          "num_pays",
        ],
      });

      console.log(payCheckUpdated.dataValues);
      //Create all the paydays starting with the new start_date
      if (!createPayDays(payCheckUpdated.dataValues, interval.dataValues)) {
        // If the new paydays can't be created delete the paycheck and make the user recreate it.
        // ****This should be reevaluated for a better way in the future****
        await Paycheck.destroy({
          where: { id: payCheckResult.dataValues.pay_check_id },
        });

        return res.status(500).json({
          success: false,
          message:
            "The following paycheck record was updated but has subsequently been deleted because pay days couldn't be created/updated for it after the paycheck updates. Please re-add the paycheck.:",
          payCheckResult,
        });
      }
    }
    // Return the updated record
    return res
      .json({
        success: true,
        message: "Paycheck successfully updated.",
        payCheckUpdated,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when updating the paycheck record.",
        error: error,
      })
      .status(500);
  }
};

const deletePayCheck = async (req, res) => {
  try {
    const payCheckResult = await PayCheck.findByPk(req.params.pay_check_id, {
      attributes: [
        ["id", "pay_check_id"],
        "pay_check_name",
        "start_pay_date",
        "pay_amount_est",
        // "end_pay_date",
        "budget_id",
        "contributor_id",
        "interval_id",
      ],
    });
    console.log(payCheckResult);
    if (payCheckResult == null) {
      return res
        .json({
          success: false,
          message:
            "Couldn't delete paycheck record because it could not be found.",
        })
        .status(404);
    }

    await Paycheck.destroy({
      where: { id: payCheckResult.dataValues.pay_check_id },
    });

    //return success true and delete message with the record that was deleted
    return res
      .json({
        success: true,
        message: "Paycheck successfully deleted.",
        payCheckResult,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when deleting the paycheck record.",
        error: error,
      })
      .status(500);
  }
};

module.exports = {
  getPayCheckByContribID,
  addPayCheck,
  updatePayCheck,
  deletePayCheck,
};
