const PayDay = require("../models/payDayModel");
const Bill = require("../models/billModel");
const Interval = require("../models/intervalModel");
const BillDueDates = require("../models/billDueDatesModel");
const moment = require("moment");

const getBillsByBudgetID = async (req, res) => {
  try {
    const result = await Bill.findAll({
      where: {
        budget_id: req.params.budget_id,
      },
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "monthly_same_day",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });
    if (!result.length) {
      return res.status(404).json({
        success: true,
        message: "No bills found for this budget.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bills retrieved for budget provided.",
      result,
    });
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred while fetching the bill record(s).",
        error: error,
      })
      .status(500);
  }
};

const addBill = async (req, res) => {
  try {
    await Bill.create({
      bill_name: req.body.bill_name,
      description: req.body.description,
      amt_due: req.body.amt_due,
      day_due: req.body.day_due,
      monthly_same_day: true, // need to change this but for times sake just defaulting to true req.body.monthly_same_day,
      start_date: req.body.start_date,
      website: req.body.website,
      website_login: req.body.website_login,
      active: req.body.active,
      budget_id: req.body.budget_id,
      interval_id: req.body.interval_id,
    });

    const billResult = await Bill.findOne({
      where: {
        bill_name: req.body.bill_name,
        budget_id: req.body.budget_id,
      },
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "monthly_same_day",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });

    if (billResult == null) {
      return res
        .json({
          success: true,
          message: "Couldn't return added bill.",
        })
        .status(204);
    }
    const interval = await Interval.findOne({
      where: { id: billResult.interval_id },
      attributes: [
        ["id", "interval_id"],
        "interval_name",
        "description",
        "num_days",
        "num_pays",
      ],
    });
    console.log(billResult);
    if (!createBillDueDates(billResult.dataValues, interval)) {
      await Bill.destroy({ where: { id: billResult.bill_id } });
      return res.status(500).json({
        message:
          "The following bill record was added but has subsequently been deleted because bill due dates couldn't be created for it:",
        billResult,
      });
    }
    return res
      .json({
        success: true,
        message: "Bill successfully added.",
        billResult,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when adding the bill record.",
        error: error,
      })
      .status(500);
  }
};

const createBillDueDates = (bill, interval) => {
  try {
    //const interval = await Interval.findByPk(bill.interval_id);
    if (interval != null) {
      // create an array of billduedate objects that will be flushed to bill_due_dates table.
      //Load with the due date specified for bill object being added.
      // console.log("**********************************", interval.num_days);
      // return false;
      moment.suppressDeprecationWarnings = true;
      let billDueDates = [
        {
          due_date: moment(bill.start_date).format("L"),
          budget_id: bill.budget_id,
          bill_id: bill.bill_id,
        },
      ];

      let nextBillDueDate;
      if (bill.monthly_same_day) {
        //get the dateparts of start date and subtract 1 from month as javascript months are 0 - 11
        let month = parseInt(moment(bill.start_date).format("MM"));
        let year = parseInt(moment(bill.start_date).format("YYYY"));
        let day = parseInt(moment(bill.start_date).format("DD"));
        //Create bill due dates for the next year on the same day for each month over that year.
        for (let i = 0; i < 12; i++) {
          //Create a date using moment from our date parts.
          let date = moment()
            .year(year)
            .month(month)
            .date(
              month == 1 && day > 28
                ? moment(year).isLeapYear()
                  ? 29
                  : 28
                : day
            ) // ternary logic to pick the last day of february if dat greater than 28
            .format("L");

          // Create bill due date object
          let billDueDate = {
            due_date: date,
            budget_id: bill.budget_id,
            bill_id: bill.bill_id,
          };
          // push bill due date object to the billDueDates array of objects.
          billDueDates.push(billDueDate);
          //increment the month for the next month bill due date
          month++;
          // if the month is greater than 11 (December) then we need to start over with zero (January) and increment the year.
          if (month > 11) {
            month = 0;
            year++;
          }
        }
      }
      // if the paydays array is empty return
      if (!billDueDates.length) {
        return false;
      }
      console.log(billDueDates);
      //Create all the paydays in the payday array
      const insertResult = BillDueDates.bulkCreate(billDueDates).then(() => {
        return true;
      });
      return insertResult;
    }
  } catch (error) {
    console.log(
      `Error creating bill due dates for bill ${bill.bill_name} that belongs to budget id ${bill.budget_id}. Error message: ${error}.`
    );
    return false;
  }
};

const updateBill = async (req, res) => {
  try {
    // get the bill that will be updated so we can see what is different from db record and req object
    const billResult = await Bill.findByPk(req.body.bill_id, {
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "monthly_same_day",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });
    // Check if we found a bill record
    console.log(billResult);
    console.log("**************", billResult.dataValues.bill_id);
    if (billResult == null) {
      return res
        .json({
          success: false,
          message:
            "Cannot update bill because it was not found with the given bill id.",
        })
        .status(404);
    }
    // If we found a bill issue the update sent in request
    await Bill.update(
      {
        bill_name: req.body.bill_name,
        description: req.body.description,
        amt_due: req.body.amt_due,
        day_due: req.body.day_due,
        monthly_same_day: true, // need to change this but for times sake just defaulting to true req.body.monthly_same_day,
        start_date: req.body.start_date,
        website: req.body.website,
        website_login: req.body.website_login,
        active: req.body.active,
        budget_id: req.body.budget_id,
        interval_id: req.body.interval_id,
      },
      {
        where: {
          id: billResult.dataValues.bill_id,
          budget_id: billResult.dataValues.budget_id,
        },
      }
    );
    // Get the updated bill
    const billUpdated = await Bill.findByPk(billResult.dataValues.bill_id, {
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "monthly_same_day",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });

    if (billUpdated == null) {
      return res
        .json({
          success: false,
          message:
            "Cannot return bill after it was updated. Because of this the bill due date records have not been updated. Please try update again.",
        })
        .status(404);
    }
    // Check if the bill start date, day_due, amt_due changed
    if (
      moment(billResult.dataValues.start_pay_date).format("L") !==
        moment(billUpdated.dataValues.start_pay_date).format("L") ||
      billResult.dataValues.day_due !== billUpdated.dataValues.day_due ||
      billResult.dataValues.amt_due !== billUpdated.dataValues.amt_due
    ) {
      // If the bill start date, day_due, amt_due changed we need to delete all
      // the child bill due dates
      // and then recreate them with the new properties.

      await BillDueDates.destroy({
        where: {
          bill_id: billResult.dataValues.bill_id,
          budget_id: billResult.dataValues.budget_id,
        },
      });

      const interval = await Interval.findOne({
        where: { id: billResult.dataValues.interval_id },
        attributes: [
          ["id", "interval_id"],
          "interval_name",
          "description",
          "num_days",
          "num_pays",
        ],
      });
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^", billUpdated.dataValues);
      //Create all the bills with the new properties
      if (!createBillDueDates(billUpdated.dataValues, interval)) {
        // If the new bill can't be created delete the bill and make the user recreate it.
        // ****This should be reevaluated for a better way in the future****
        await Bill.destroy({
          where: {
            id: billResult.dataValues.bill_id,
            budget_id: billResult.dataValues.budget_id,
          },
        });
        return res.status(500).json({
          success: false,
          message:
            "The following bill record was updated but has subsequently been deleted because bill due dates couldn't be created/updated for it after the bill updates. Please re-add the bill.",
          billResult,
        });
      }
    }
    // Return the updated record
    console.log("HHHERREEEEEREEREREREREREEREREREREREE");
    return res
      .json({
        success: true,
        message: "Bill successfully updated.",
        billUpdated,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when updating the Bill record.",
        error: error,
      })
      .status(500);
  }
};

const deleteBill = async (req, res) => {
  try {
    //Find bill to delete to make sure it exists
    const billResult = await Bill.findByPk(req.params.bill_id, {
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "monthly_same_day",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });
    console.log(billResult);
    //Check if the bill was returned
    if (billResult == null) {
      //Bill not found return success false and message
      return res
        .json({
          success: false,
          message: "Couldn't delete bill record because it could not be found.",
        })
        .status(404);
    }
    // Bill found so go ahead and delete it
    await Bill.destroy({
      where: {
        id: billResult.dataValues.bill_id,
        budget_id: billResult.dataValues.budget_id,
      },
    });
    //return success true and delete message with the record that was deleted
    return res
      .json({
        success: true,
        message: "Bill successfully deleted.",
        billResult,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when deleting the bill record.",
        error: error,
      })
      .status(500);
  }
};

module.exports = { getBillsByBudgetID, addBill, updateBill, deleteBill };
