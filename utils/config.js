import dotenv from "dotenv";

dotenv.config();
export const config = {
  apiKey: process.env.LO_API_KEY,
  baseUrl: process.env.LO_API
};