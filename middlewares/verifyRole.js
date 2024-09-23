import authorModel from "../models/author.model.js";

export const isWriter = async (req, res, next) => {
  const requrester = req.params.email;
  const requesterAccount = await authorModel.findOne({ email: requrester });
  if (requesterAccount?.role !== "writer") {
    return res.status(403).send({ message: "Forbidden Access" });
  } else {
    next();
  }
};
