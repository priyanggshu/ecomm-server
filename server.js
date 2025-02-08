import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.use("/auth", authRoutes);
server.use("/products", productRoutes);
server.use("/orders", orderRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.error(`DB connection error: ${err}`));

server.listen(process.env.PORT, () => {
  console.log(`server connected on port ${PORT}`);
});
