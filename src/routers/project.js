const express = require("express");
const Project = require("../models/project");
const WorkProgram = require("../models/workprogram");
const SubStream = require("../models/SubStream");
const Risk = require("../models/risk");
const Control = require("../models/control");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/projects", async (req, res) => {
  const project = new Project({
    manager: req.body.manager,
    deadline: req.body.deadline,
    description: req.body.description,
    status: "In progress",
    client: req.body.client,
  });
  try {
    await project.save();
    res.status(201).send(project);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/projects/all", async (req, res) => {
  const project = await Project.find().populate("client");

  res.send(project);
});

router.get("/projects/documents", async (req, res) => {
  var number = Project.count({}, function (err, count) {
    console.log(count);
    res.send({ documents: count }); // this will print the count to console
  });
});

router.get("/projects/month", async (req, res) => {
  const project = await Project.aggregate([
    // User is the model of userSchema
    {
      $group: {
        _id: { $month: "$createdAt" }, // group by the month *number*, mongodb doesn't have a way to format date as month names
        numberofdocuments: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false, // remove _id
        month: {
          // set the field month as the month name representing the month number
          $arrayElemAt: [
            [
              "", // month number starts at 1, so the 0th element can be anything
              "january",
              "february",
              "march",
              "april",
              "may",
              "june",
              "july",
              "august",
              "september",
              "october",
              "november",
              "december",
            ],
            "$_id",
          ],
        },
        numberofdocuments: true, // keep the count
      },
    },
  ]);

  res.send(project);
});

router.get("/projects/:id", async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id });
  res.send(project);
});

router.delete("/projects/:id", async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id });
  const workProgram = await WorkProgram.find({ project: req.params.id });
  const subStream = await SubStream.find(workProgram._id);
  const risk = await Risk.find(subStream._id);
  console.log(workProgram);
  try {
    await Control.deleteMany(risk._id);
    await Risk.deleteMany(subStream._id);
    await SubStream.deleteMany(workProgram._id);
    await WorkProgram.deleteMany({ project: req.params.id });
    await project.remove();
    res.status(201).send(project);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndUpdate(
      { _id: req.params.id },
      {
        manager: req.body.manager,
        description: req.body.description,
        deadline: req.body.deadline,
        status: "In progress",
      }
    );
    res.status(201).send(res.data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
