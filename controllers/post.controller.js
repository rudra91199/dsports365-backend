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

export const getNewsByid = async (req, res) => {
  const id = req.query.id;
  try {
    const result = await postModel
      .findById(id)
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

export const newsCountByCategory = async (req, res) => {
  const query = ["ক্রিকেট", "ফুটবল", "আরও খেলা"];
  const counts = [];
  try {
    for (let i = 0; i < query.length; i++) {
      const count = await postModel.countDocuments({ category: query[i] });
      const categoryName = query[i];
      counts.push({ categoryName, count });
    }
    return res.status(200).send({ counts });
  } catch (error) {
    console.log(error);
  }
};

export const popularNews = async (req, res) => {
  const limit = req.query.limit;
  try {
    const result = await postModel.find().sort({ count: -1 }).limit(limit);
    return res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
};


