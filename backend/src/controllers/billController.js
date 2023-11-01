const PayDay = require("../models/payDayModel");
const Bill = require("../models/billModel");
const Interval = require("../models/intervalModel");
const moment = require("moment");

const getBillsByBudgetID = async (req, res) => {
  try {
    const result = await Bill.findAll({
      where: {
        budget_id: req.body.budget_id,
      },
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });
    if (result) {
      return res.status(200).json(result);
    }
    return res.status(400).json({ message: "No bills found for this budget." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const addBill = async (req, res) => {
  try {
    await Bill.create({
      bill_name: req.body.bill_name,
      description: req.body.description,
      amt_due: req.body.amt_due,
      day_due: req.body.day_due,
      monthly_same_day: req.body.monthly_same_day,
      start_date: req.body.start_date,
      website: req.body.website,
      website_login: req.body.website_login,
      active: req.body.active,
      budget_id: req.body.budget_id,
      interval_id: req.body.interval_id,
    });
    const billResult = await Bill.findOne({
      where: {
        bill_name: req.body.pay_check_name,
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

    if (billResult) {
      if (!createBillDueDates(billResult)) {
        await Bill.destroy({ where: { id: billResult.bill_id } });
        return res.status(500).json({
          message:
            "The following bill record was added but has subsequently been deleted because bill due dates couldn't be created for it:",
          billResult,
        });
      }
      return res.status(200).json(billResult);
    }
    return res.status(204).json({ message: "Couldn't return added bill." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const createBillDueDates = async (bill) => {
  try {
    const interval = await Interval.findByPk(bill.interval_id);
    if (interval) {
      // create an array of billduedate objects that will be flushed to bill_due_dates table.
      //Load with the due date specified for bill object being added.
      let billDueDates = [
        {
          due_date: moment(bill.start_date).format("L"),
          budget_id: bill.budget_id,
          bill_id: bill.bill_id,
        },
      ];

      let nextBillDueDate;
      if (bill.monthly_same_day) {
        let startMonth = moment(bill.start_date).format("MM");
        let startYear = moment(bill.start_date).format("YYYY");
      }

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

const updateBill = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const deleteBill = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = { getBillsByBudgetID, addBill, updateBill, deleteBill };
