const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const clientRouter = require("./routers/client");
const projectRouter = require("./routers/project");
const workprogramRouter = require("./routers/workprogram");
const subStreamRouter = require("./routers/subStream");
const riskRouter = require("./routers/risk");
const controlRouter = require("./routers/control");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(clientRouter);
app.use(projectRouter);
app.use(workprogramRouter);
app.use(subStreamRouter);
app.use(riskRouter);
app.use(controlRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const User = require("./models/user");

// const main = async () => {
//     // const task = await Task.findById('5c2e505a3253e18a43e612e6')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('5c2e4dcb5eac678a23725b5b')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main();
