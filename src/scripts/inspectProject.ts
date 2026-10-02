import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string, { dbName: "lumiora" });
  const col = mongoose.connection.collection("projects");
  const doc = await col.findOne({ slug: "assetloop-rental-platform" });
  console.log(JSON.stringify({
    title: doc?.title,
    problem: doc?.problem?.slice?.(0, 60),
    contribution: doc?.contribution?.slice?.(0, 60),
    keys: doc ? Object.keys(doc) : [],
  }, null, 2));
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
