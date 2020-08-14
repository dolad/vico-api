const Services = require("../models/services");

exports.createServices = async (req, res) => {
  const services = new Services({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await services.save();
    res.status(201).send(services);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllServices = async (req, res) => {
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
    const services = await Services.find({ owner: req.user._id });

    //   // it can also be done this way;
    //   await req.user.populate({
    //     path:'services',
    //     match,
    //     options:{
    //       limit:parseInt(req.query.limit),
    //       skip:parseInt(req.query.skip),
    //       sort
    //     }
    //   }).execPopulate();

    res.send(services);
  } catch (error) {
    res.status(500).send();
  }
};

exports.getServicesById = async (req, res) => {
  const _id = req.params.id;
  console.log(req.user);

  try {
    const services = await Services.findOne({ _id, owner: req.user._id });
    if (!services) {
      return res.status(404).send();
    }
    res.send(services);
  } catch (error) {
    res.status(500).send();
  }
};

exports.updateServices = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "compound", "amount"];

  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const services = await Services.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!services) {
      return res.status(404).send({ error: "cant find services" });
    }

    updates.forEach((update) => (services[update] = req.body[update]));

    await services.save();
    res.send(services);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.deleteServices = async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const services = await Services.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!services) {
      res.status(404).send();
    }

    res.send({ message: "services deleted", services });
  } catch (e) {
    res.status(500).send();
  }
};
