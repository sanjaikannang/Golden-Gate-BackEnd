import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

import connectDB from "./connectMongoDB.js";
import propertyRoutes from "./routes/PropertyRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

dotenv.config();
connectDB();

// console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
// console.log("API_KEY:", process.env.API_KEY);
// console.log("API_SECRET:", process.env.API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users', usersRoutes);
app.use('/api', propertyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
