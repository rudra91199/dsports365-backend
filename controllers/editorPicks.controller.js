import editorPicksModel from "../models/editorPicks.model.js";

export const getEditorPicks = async (req, res) => {
  try {
    const result = await editorPicksModel.find().sort({ index: 1 });
    return res.status(200).send({ result });
  } catch (error) {
  }
};

export const updateEditorPicks = async (req, res) => {
    try {
      const result = await editorPicksModel.updateOne(
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
            message: `News set to Editor Picks index ${req.query.index}`,
          });
      }
    } catch (error) {}
  };