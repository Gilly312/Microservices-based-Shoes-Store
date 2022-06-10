const jwt = require("jsonwebtoken");
const User = require("./User");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = await User.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
      throw new Error("User not login");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};
module.exports = auth;
