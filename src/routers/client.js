const express = require("express");
const Client = require("../models/client");
const multer = require("multer");
const sharp = require("sharp");
const Project = require("../models/project");
const WorkProgram = require("../models/workprogram");
const SubStream = require("../models/SubStream");
const Risk = require("../models/risk");
const Control = require("../models/control");
const auth = require("../middleware/auth");
const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

router.post("/clients", upload.single("avatar"), async (req, res, err) => {
  const client = new Client(req.body);
  const project = new Project({ client: client.id, status: "Created" });

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  client.avatar = buffer;
  try {
    await client.save();
    await project.save();
    res.status(201).send(client);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/clients/:id", async (req, res) => {
  try {
    await Client.findByIdAndUpdate(
      { _id: req.params.id },
      { name: req.body.name, description: req.body.description }
    );
    res.status(201).send(res.data);
  } catch (e) {
    res.status(500).send("no");
  }
});

router.get("/clients/documents", async (req, res) => {
  var number = Client.count({}, function (err, count) {
    console.log(count);
    res.send({ documents: count }); // this will print the count to console
  });
});

router.get("/clients/all", async (req, res) => {
  const client = await Client.find();
  res.send(client);
});

router.get("/clients/:id", async (req, res) => {
  const client = await Client.findOne({ _id: req.params.id });
  res.send(client);
});

router.delete("/clients/:id", async (req, res) => {
  const client = await Client.findOne({ _id: req.params.id });
  const getProject = await Project.find({ client: req.params.id });
  const workProgram = await WorkProgram.find(getProject._id);
  const subStream = await SubStream.find(workProgram._id);
  const risk = await Risk.find(subStream._id);
  console.log(workProgram);

  try {
    await Control.deleteMany(risk._id);
    await Risk.deleteMany(subStream._id);
    await SubStream.deleteMany(workProgram._id);
    await WorkProgram.deleteMany(getProject._id);
    await Project.deleteMany({ client: req.params.id });
    await client.remove();
    res.status(201).send(client);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
