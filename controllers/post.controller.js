import postModel from "../models/post.model.js";

export const getNewsForUsers = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const filter = {
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.subcategory && { subcategory: req.query.subcategory }),
    ...(req.query.exclude === "সাক্ষাৎকার" && {
      category: { $ne: req.query.exclude },
    }),
  };
  try {
    const result = await postModel
      .find(filter)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select(["-status", "-writer.email", "-updatedAt"]);
    const count = await postModel.countDocuments(filter);
    console.log(filter);
    return res.status(200).send({ result, count });
  } catch (error) {
    throw error;
  }
};

export const getNewsBySlug = async (req, res) => {
  const slug = req.query.slug;
  try {
    const result = await postModel
      .findOne({ slug: slug })
      .select(["-status", "-writer.email", "-updatedAt"]);
    return res.status(200).send({ result });
  } catch (error) {}
};

export const getProductByQuery = async (req, res) => {
  const query = req.params;
  console.log(query);
  try {
    const result = await postModel.find({
      title: {
        $regex: query.search,
        $options: "i",
      },
    });
    return res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
};

export const updateCount = async (req, res) => {
  const body = req.body;

  try {
    const result = await postModel.findByIdAndUpdate(
      { _id: body.id },
      {
        $set: {
          count: body.count,
        },
      }
    );
    res.status(200).send({ message: "News Status Updated" });
  } catch (error) {
    throw error;
  }
};
