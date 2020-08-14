const Asset = require("../models/assets");

exports.createAsset = async (req, res) => {
  console.log(req.user);
  const asset = new Asset({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await asset.save();
    res.status(201).send(asset);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAssets = async (req, res) => {
  try {
    console.log(req.user);
    // first approach
    const asset = await Asset.find({ owner: req.user._id });
    // console.log(asset);
    // it can also be done this way;
    // await req.user.populate({
    //   path:'asset',
    //   match,
    //   options:{
    //     limit:parseInt(req.query.limit),
    //     skip:parseInt(req.query.skip),
    //     sort
    //   }
    // }).execPopulate();

    res.json(asset);
  } catch (error) {
    res.status(500).send();
  }
};

exports.getAssetById = async (req, res) => {
  const _id = req.params.id;
  console.log(req.user);

  try {
    const asset = await Asset.findOne({ _id, owner: req.user._id });
    if (!asset) {
      return res.status(404).send();
    }
    res.send(asset);
  } catch (error) {
    res.status(500).send();
  }
};

exports.updateAssets = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "compound", "amount"];

  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const asset = await Asset.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!asset) {
      return res.status(404).send({ error: "cant find assets" });
    }

    updates.forEach((update) => (asset[update] = req.body[update]));

    await asset.save();
    res.send(asset);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteAssets = async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const asset = await Asset.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!asset) {
      res.status(404).send();
    }

    res.send({ message: "asset deleted", asset });
  } catch (e) {
    res.status(404).send();
  }
};
