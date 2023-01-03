const express = require("express");
const WorkProgram = require("../models/workprogram");
const SubStream = require("../models/SubStream");
const Risk = require("../models/risk");
const Control = require("../models/control");
const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/workprograms/sort/update/:junior", async (req, res) => {
  const workprogram = await WorkProgram.find({
    junior: req.params.junior,
  })
    .populate({
      path: "project",
      populate: {
        path: "client",
      },
    })
    .sort({ updatedAt: "desc" })
    .limit(20);

  res.send(workprogram);
});

router.get("/workprograms/sort/deadline/:junior", async (req, res) => {
  const workprogram = await WorkProgram.find({
    junior: req.params.junior,
  })
    .populate({
      path: "project",
      populate: {
        path: "client",
      },
    })
    .sort({
      deadline: "desc",
    })
    .limit(20);

  res.send(workprogram);
});

router.patc;

router.post("/workprogram/:project", async (req, res) => {
  var newWorkProgram = {
    project: req.params.project,
    senior: req.body.senior,
    junior: req.body.junior,
    name: req.body.name,
    description: req.body.description,
    priority: req.body.priority,
    deadline: req.body.deadline,
  };

  const workprogram = new WorkProgram(newWorkProgram);
  try {
    await workprogram.save();
    res.status(201).send(workprogram);
  } catch (e) {
    console.log(workprogram);
    res.status(400).send(workprogram);
  }
});

// router.get("/workprograms/all", async (req, res) => {
//   const workprogram = await WorkProgram.find().populate("client");

//   res.send(workprogram);
// });

router.get("/workprogram/edit/:id", async (req, res) => {
  const workprogram = await WorkProgram.findOne({
    _id: req.params.id,
  })
    .populate("junior")
    .populate("senior")
    .populate({
      path: "project",
      populate: {
        path: "client",
      },
    });

  res.send(workprogram);
});

router.get("/workprogram/export/:id", async (req, res) => {
  const workprogram = await WorkProgram.findOne({
    _id: req.params.id,
  });
  const substream = await SubStream.find({ workprogram: req.params.id });
  const risk = await Risk.find(substream._id);
  const control = await Control.find(risk._id).populate({
    path: "risk",
    populate: {
      path: "subStream",
    },
  });
  res.send(control);
  // res.json({ success: true, risk: risk, control: control });
});

router.get("/workprograms/:project", async (req, res) => {
  const workprogram = await WorkProgram.find({
    project: req.params.project,
  })
    .populate("junior")
    .populate("senior")
    .populate({
      path: "project",
      populate: {
        path: "client",
      },
    });

  res.send(workprogram);
});

router.delete("/workprograms/:id", async (req, res) => {
  const workprogram = await WorkProgram.findOne({ _id: req.params.id });
  const subStream = await SubStream.find({ workprogram: req.params.id });
  const risk = await Risk.find(subStream._id);
  console.log(workprogram);
  try {
    await Control.deleteMany(risk._id);
    await Risk.deleteMany(subStream._id);
    await SubStream.deleteMany({ workprogram: req.params.id });
    await workprogram.remove();
    res.status(201).send(workprogram);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/workprograms/deleteMany/:id", async (req, res) => {
  try {
    const workprogram = await WorkProgram.deleteMany({ _id: req.params.id });
    res.status(201).send(workprogram);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/workprograms/updateTimeStamp/:id", async (req, res) => {
  try {
    const updateTimeStamp = await WorkProgram.findOneAndUpdate(
      { _id: req.params.id },
      { timestamps: true }
    );
    res.status(201).send(updateTimeStamp);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.patch("/workprograms/edit/:id", async (req, res) => {
  try {
    await WorkProgram.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        senior: req.body.senior,
        junior: req.body.junior,
        priority: req.body.priority,
        deadline: req.body.deadline,
        description: req.body.description,
      }
    );
    res.status(201).send(res.data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/workprograms/priority/charts", async (req, res) => {
  const workprogram = await WorkProgram.aggregate([
    {
      $group: {
        _id: "$priority", // group by the month *number*, mongodb doesn't have a way to format date as month names
        numberofdocuments: { $sum: 1 },
      },
    },
  ]);

  res.send(workprogram);
});

router.get("/workprogram/documents", async (req, res) => {
  var number = WorkProgram.count({}, function (err, count) {
    console.log(count);
    res.send({ documents: count }); // this will print the count to console
  });
});

module.exports = router;
