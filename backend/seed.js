
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { User } from "./models/User.js";
import { Request } from "./models/Request.js";
import { Session } from "./models/Session.js";
import { Rating } from "./models/Rating.js";

const COLLEGES = ["DU", "DTU", "NSUT", "VIPS", "IITD", "IIITD"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const SUBJECTS = [
  { subject: "DBMS", topics: ["Normalization", "Transactions", "Indexing"] },
  { subject: "Operating Systems", topics: ["Deadlocks", "Scheduling", "Memory Management"] },
  { subject: "Computer Networks", topics: ["TCP handshake", "Routing", "Subnetting"] },
  { subject: "OOP Concepts", topics: ["Polymorphism", "Inheritance", "Design Patterns"] },
  { subject: "Data Structures", topics: ["Trees", "Graphs", "Dynamic Programming"] },
  { subject: "Circuit Theory", topics: ["Thevenin's theorem", "Norton's theorem"] },
  { subject: "Digital Logic", topics: ["K-Maps", "Flip Flops"] },
  { subject: "Thermodynamics", topics: ["2nd Law", "Entropy"] },
  { subject: "Python", topics: ["Decorators", "Generators"] },
  { subject: "React.js", topics: ["Hooks", "Context API"] },
  { subject: "Machine Learning", topics: ["Gradient Descent", "Overfitting"] },
  { subject: "Linear Algebra", topics: ["Eigenvalues", "Matrix transforms"] },
  
];

const FEEDBACK_QUOTES = [
  "Explained it way better than my professor did — used a real example instead of just the textbook definition.",
  "Was stuck for an hour before this. Cleared it up in like 10 minutes.",
  "Really patient, let me ask follow-up questions instead of rushing through it.",
  "Drew it out on screen share instead of just talking — made it click instantly.",
  "Went in confused and came out actually understanding why, not just what.",
  "Answered at 1AM before my exam, absolute lifesaver.",
  "Broke down a hard topic into small steps I could actually follow.",
  "Gave me a shortcut way to remember it, not just the formal explanation.",
];

const FIRST_NAMES = ["Ananya", "Rohan", "Ishaan", "Meera", "Karan", "Priya", "Aman", "Kavya", "Dev", "Rhea", "Arjun", "Sanya", "Vikram", "Neha", "Yash", "Riya", "Aditya", "Simran"];
const LAST_NAMES = ["Rao", "Sharma", "Verma", "Iyer", "Mehta", "Singh", "Gupta", "Nair", "Kapoor", "Bose", "Reddy", "Chatterjee"];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const run = async () => {
  await connectDB();

  console.log("Creating users...");
  const users = [];

  for (let i = 0; i < 18; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = randomFrom(LAST_NAMES);
    const username = `${first.toLowerCase()}${last.toLowerCase()}${i}`;
    const email = `${username}@gmail.com`;

    const user = await User.create({
      username,
      email,
      password: "Password123!", // pre-save hook hashes this automatically
      college: randomFrom(COLLEGES),
      year: randomFrom(YEARS),
      isVerified: true,
      skillsOffered: [randomFrom(SUBJECTS).subject, randomFrom(SUBJECTS).subject],
      coins: randomInt(80, 300),
    });

    users.push(user);
  }

  console.log(`Created ${users.length} users.`);

  console.log("Creating requests, sessions, and ratings...");
  const helperRatingBuckets = {}; // helperId -> [stars, stars, ...]

  for (let i = 0; i < 14; i++) {
    const { subject, topics } = randomFrom(SUBJECTS);
    const topic = randomFrom(topics);

    const requester = randomFrom(users);
    let helper = randomFrom(users);
    while (helper._id.equals(requester._id)) {
      helper = randomFrom(users);
    }

    const mode = Math.random() > 0.5 ? "paid" : "barter";
    const coinAmount = mode === "paid" ? randomInt(20, 60) : 0;

    const request = await Request.create({
      requester: requester._id,
      description: `Can someone help me with ${topic.toLowerCase()}? Getting confused with the concept.`,
      subject,
      mode,
      coinAmount,
      barterOffer: mode === "barter" ? randomFrom(SUBJECTS).subject : undefined,
      topics: [topic],
      status: "completed",
    });

    const session = await Session.create({
      request: request._id,
      learner: requester._id,
      helper: helper._id,
      meetLink: `https://meet.skillswap.dev/room-${request._id}`,
      learnerConfirmed: true,
      helperConfirmed: true,
      coinAmount,
      status: "completed",
    });

    // Most sessions get a written review; a few get stars only, matching real usage.
    const hasWrittenReview = Math.random() > 0.2;
    const stars = randomInt(4, 5);

    await Rating.create({
      session: session._id,
      reviewer: requester._id,
      reviewee: helper._id,
      stars,
      review: hasWrittenReview ? randomFrom(FEEDBACK_QUOTES) : undefined,
    });

    const helperKey = helper._id.toString();
    if (!helperRatingBuckets[helperKey]) helperRatingBuckets[helperKey] = [];
    helperRatingBuckets[helperKey].push(stars);
  }

  console.log("Updating helper rating averages...");
  for (const [helperId, starsArray] of Object.entries(helperRatingBuckets)) {
    const total = starsArray.reduce((sum, s) => sum + s, 0);
    const average = total / starsArray.length;

    await User.findByIdAndUpdate(helperId, {
      rating: average,
      ratingCount: starsArray.length,
    });
  }

  console.log("Seed complete.");
  console.log(`  ${users.length} users`);
  console.log(`  14 requests + completed sessions`);
  console.log(`  14 ratings (~80% with written feedback)`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
