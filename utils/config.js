import dotenv from "dotenv";

dotenv.config();
console.log(process.env.LO_API_KEY)
export const config = {
  apiKey: process.env.LO_API_KEY,
  baseUrl: process.env.LO_API
};