/**
 * migrate.js — run ONCE, before seed.js, from inside your backend/ folder:
 *
 *   node migrate.js
 *
 * What it does: backfills `college`, `year`, and `isVerified` on any
 * EXISTING user documents created before those fields existed on the
 * schema. It never touches users/fields that already have values —
 * only fills in what's missing. Nothing is deleted.
 *
 * Safe to run more than once — the second run will just match 0 documents.
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { User } from "./models/User.js";

const run = async () => {
  await connectDB();

  const collegeResult = await User.updateMany(
    { college: { $exists: false } },
    { $set: { college: "Not specified" } }
  );

  const yearResult = await User.updateMany(
    { year: { $exists: false } },
    { $set: { year: "Not specified" } }
  );

  const verifiedResult = await User.updateMany(
    { isVerified: { $exists: false } },
    { $set: { isVerified: false } }
  );

  console.log("Migration complete:");
  console.log(`  college backfilled on ${collegeResult.modifiedCount} users`);
  console.log(`  year backfilled on ${yearResult.modifiedCount} users`);
  console.log(`  isVerified backfilled on ${verifiedResult.modifiedCount} users`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
