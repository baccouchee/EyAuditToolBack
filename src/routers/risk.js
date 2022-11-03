const express = require("express");
const Risk = require("../models/risk");
const Control = require("../models/control");
const auth = require("../middleware/auth");
const WorkProgram = require("../models/workprogram");

const router = new express.Router();

router.post("/risk/:subStream", async (req, res) => {
  const risk = new Risk({
    name: req.body.name,
    subStream: req.params.subStream,
  });
  try {
    await risk.save();
    res.status(201).send(risk);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/risk/all", async (req, res) => {
  const risk = await Risk.find();
  res.send(risk);
});

router.get("/risk/:subStream", async (req, res) => {
  const risk = await Risk.find({ subStream: req.params.subStream });
  res.send(risk);
});

router.get("/risk/name/:id", async (req, res) => {
  const risk = await Risk.findOne({ _id: req.params.id });
  res.send(risk);
});

router.delete("/risk/:id", async (req, res) => {
  const risk = await Risk.findOne({ _id: req.params.id });
  const control = await Control.deleteMany({ risk: req.params.id });
  console.log(risk);
  try {
    await risk.remove();
    res.status(201).send(risk);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/risk/probability/:id", async (req, res) => {
  try {
    await Risk.findByIdAndUpdate(
      { _id: req.params.id },
      {
        probability: req.body.probability,
      }
    );
    res.status(201).send(res.data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.patch("/risk/impact/:id", async (req, res) => {
  try {
    await Risk.findByIdAndUpdate(
      { _id: req.params.id },
      {
        impact: req.body.impact,
      }
    );
    res.status(201).send(res.data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
