const express = require("express");
const server = express();
server.use(express.json());

const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3500;

// import connection from db.js in config file
const connection = require("./config/db");

// authentication middleware
const auth = require("./middleware/auth");

// user router
const userRouter = require("./routes/user.route.js");
server.use("/api/user", userRouter);

//course routes
const courseRouter = require("./routes/course.route");
server.use("/api/course", courseRouter);

server.get("/", async (req, res) => {
  try {
    // res.write("welcome to new adge Online Learning Platform");
    res
      .status(200)
      .send({ message: "welcome to new adge Online Learning Platform" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

server.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server is running on PORT: ${PORT} and db has been connected`);
  } catch (error) {
    console.log(error.message);
  }
});
