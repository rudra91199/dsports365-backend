import authorModel from "../models/author.model.js";

const isAdmin = async (req, res, next) => {
  const requester = req.userInfo.email;
  const requesterAccount = await authorModel.findOne({ email: requester });
  if (requesterAccount?.role !== "admin") {
    return res.status(403).send({ message: "Forbidden Access." });
  } else {
    next();
  }
};

export default isAdmin;
