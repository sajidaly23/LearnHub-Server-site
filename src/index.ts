import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectedDb";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});