import trendingPostModel from "../models/trendingPost.model.js";

export const getTrendingPost = async (req, res) => {
  try {
    const result = await trendingPostModel.find().sort({ index: 1 });
    return res.status(200).send({ result });
  } catch (error) {
    throw error;
  }
};

export const updateTrendings = async (req, res) => {
  try {
    const result = await trendingPostModel.updateOne(
      { index: req.query.index },
      {
        $set: {
          post: req.body.post,
        },
      },
      {
        new: true,
      }
    ).select();
    if (result.modifiedCount === 1) {
      return res
        .status(200)
        .send({
          message: `News set to Trending News index ${req.query.index}`,
        });
    }
  } catch (error) {}
};
