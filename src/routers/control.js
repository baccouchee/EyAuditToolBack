const express = require("express");
const Control = require("../models/control");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/control/:risk", async (req, res) => {
  const control = new Control({
    control: req.body.control,
    risk: req.params.risk,
  });
  try {
    await control.save();
    res.status(201).send(control);
  } catch (e) {
    res.status(400).send(control);
  }
});

router.patch("/control/testPro/:id", async (req, res) => {
  try {
    await Control.findByIdAndUpdate(
      { _id: req.params.id },
      {
        testPro: req.body.testPro,
      }
    );
    res.status(201).send(res.data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/control/all", async (req, res) => {
  const control = await Control.find();
  res.send(risk);
});

router.get("/control/:risk", async (req, res) => {
  const control = await Control.find({ risk: req.params.risk });
  res.send(control);
});

router.get("/control/name/:id", async (req, res) => {
  const control = await Control.findOne({ _id: req.params.id });
  res.send(control);
});

router.delete("/control/:id", async (req, res) => {
  const control = await Control.findOne({ _id: req.params.id });

  try {
    await control.remove();
    res.status(201).send(control);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
