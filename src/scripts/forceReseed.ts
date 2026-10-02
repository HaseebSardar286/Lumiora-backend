/**
 * Force-replace portfolio projects using the native Mongo collection.
 * Usage: npx ts-node --transpile-only src/scripts/forceReseed.ts
 */
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { initialProjects } from "../config/projectsSeed";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "lumiora" });
  const col = mongoose.connection.collection("projects");

  for (const project of initialProjects) {
    const result = await col.findOneAndUpdate(
      { slug: project.slug },
      { $set: { ...project, updatedAt: new Date() } },
      { upsert: true, returnDocument: "after" }
    );
    const doc = (result as { value?: { title?: string; problem?: string } })?.value
      || (result as { title?: string; problem?: string });
    console.log(
      `✓ ${project.slug} -> title="${(doc as { title?: string })?.title}" problem=${Boolean((doc as { problem?: string })?.problem)}`
    );
  }

  const verify = await col.findOne({ slug: "assetloop-rental-platform" });
  console.log("\nVerify AssetLoop:");
  console.log("  title:", verify?.title);
  console.log("  problem:", String(verify?.problem || "").slice(0, 90));
  console.log("  contribution:", String(verify?.contribution || "").slice(0, 90));

  await mongoose.disconnect();
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
