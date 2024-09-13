import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import postRoute from "./routes/posts.js"

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

/*--connection--*/
const connection = async () => {
    try {
      mongoose.set("strictQuery", true);
      await mongoose.connect(process.env.MONGO_URI);
      app.listen(port, () => {
        console.log("Listening at port", port);
      });
    } catch (error) {
      throw error;
    }
  };
  connection();
  
  // middleware
  app.use(cors());
  app.use(express.json({ limit: "5mb" }));

  //rotues
  app.get("/", async (req, res) => {
    res.send("Server is runing");
  });

  app.use("/api/posts/", postRoute)


  //admindsports365
  //FKymGJiHY33GrtEW