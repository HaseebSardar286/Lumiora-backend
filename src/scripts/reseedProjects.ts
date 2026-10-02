/**
 * Force-upsert all portfolio projects from the seed file.
 * Usage: npx ts-node --transpile-only src/scripts/reseedProjects.ts
 */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import mongoose from "mongoose";
import { seedProjects } from "../config/projectsSeed";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "lumiora" });
  console.log("Connected to MongoDB (lumiora).");
  await seedProjects(true);
  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
