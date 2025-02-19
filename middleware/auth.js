const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) {
      return res.status(404).send({ message: "token not found" });
    }

    const decoded = jwt.verify(token, process.env.secretKey);
    if (!decoded) {
      return res.status(404).send({ message: "token not found" });
    }
    const user = await UserModel.findById({ _id: decoded.id });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = auth;
