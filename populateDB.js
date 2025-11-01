import { MongoClient } from "mongodb";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ No se encontró MONGODB_URI en .env");
  process.exit(1);
}

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db("mark-tedin-db");
    const collection = db.collection("cards");

    const data = fs.readFileSync("./public/cards.txt", "utf-8");
    const cards = data
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((name) => ({ name, owned: false }));

    for (const card of cards) {
      await collection.updateOne(
        { name: card.name },
        { $setOnInsert: card },
        { upsert: true }
      );
    }

    console.log("✅ Base de datos poblada correctamente!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
