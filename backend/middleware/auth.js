const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async function (req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const decoded = await jwt.verify(token, "secretkey");
    const user = await User.findOne({ _id: decoded.id });
    if (!user) throw new Error("No such user");
    // if(!user.isVerified)
    //     throw new Error("Please verify your email first")
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    //console.log(e.message)
    //logger.warn(e)
    //return res.sendStatus(401).json({error:'login'});
    return next({
      status: 401,
      message: "do login first",
    });
  }
};

module.exports = auth;
