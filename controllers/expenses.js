const Expenses = require("../models/expenses");

exports.createExpenses = async (req, res) => {
  const expenses = new Expenses({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await expenses.save();
    res.status(201).send(expenses);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllExpenses = async (req, res) => {
  // const match = {};
  // const sort = {};

  // if(req.query.compound){
  //   match.completed = req.query.compound === "true";
  // }

  // if(req.query.sortBy){
  //   const parts = req.query.sortBy.split(':');
  //   sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  // }
  try {
    // first approach
    const expenses = await Expenses.find({ owner: req.user._id });

    // it can also be done this way;
    //   await req.user.populate({
    //     path:'expenses',
    //     match,
    //     options:{
    //       limit:parseInt(req.query.limit),
    //       skip:parseInt(req.query.skip),
    //       sort
    //     }
    //   }).execPopulate();

    res.send(expenses);
  } catch (error) {
    res.status(500).send();
  }
};

exports.getExpensesById = async (req, res) => {
  const _id = req.params.id;
  console.log(req.user);

  try {
    const expenses = await Expenses.findOne({ _id, owner: req.user._id });
    if (!expenses) {
      return res.status(404).send();
    }
    res.send(expenses);
  } catch (error) {
    res.status(500).send();
  }
};

exports.updateExpenses = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "compound", "amount"];

  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const expenses = await Expenses.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!expenses) {
      return res.status(404).send({ error: "cant find expenses" });
    }

    updates.forEach((update) => (expenses[update] = req.body[update]));

    await expenses.save();
    res.send(expenses);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.deleteExpenses = async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const expenses = await Expenses.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!expenses) {
      res.status(404).send();
    }

    res.send({ messages: "expenses deleteed", expenses });
  } catch (e) {
    res.status(500).send();
  }
};
