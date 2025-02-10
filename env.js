import { config } from "dotenv";

config({ path: ".env" });

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const NEXT_URL = process.env.NEXT_PUBLIC_URL;

console.log("base url: ", BASE_URL, NEXT_URL);
