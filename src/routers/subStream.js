const express = require("express");
const SubStream = require("../models/SubStream");
const auth = require("../middleware/auth");
const Risk = require("../models/risk");
const Control = require("../models/control");
const router = new express.Router();
const WorkProgram = require("../models/workprogram");

router.post("/subStream/:workprogram", async (req, res) => {
  const subStream = new SubStream({
    name: req.body.name,
    workprogram: req.params.workprogram,
  });
  try {
    await subStream.save();
    res.status(201).send(subStream);
  } catch (e) {
    res.status(400).send(e);
  }
});


router.get("/subStream/all", async (req, res) => {
  const subStream = await SubStream.find();
  res.send(subStream);
});

router.get("/subStream/:workprogram", async (req, res) => {
  try {
    const subStream = await SubStream.find({
      workprogram: req.params.workprogram,
    });
    res.status(201).send(subStream);
  } catch (e) {
    res.status(500).send();
  }
});


router.delete("/subStream/:id", async (req, res) => {
  const subStream = await SubStream.findOne({ _id: req.params.id });
  const risk = await Risk.find({ subStream: req.params.id });

  // const control = await Control.deleteMany({ subStream: req.params.id });
  console.log(subStream);
  try {
    await Control.deleteMany(risk._id);
    await Risk.deleteMany({ subStream: req.params.id });
    await subStream.remove();
    res.status(201).send(subStream);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
