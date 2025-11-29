import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("mark-tedin-db");

    const doc = await db.collection("cardsCollection").findOne({ _id: "userCollection" });
    res.status(200).json({ ownedCards: doc?.ownedCards || {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ownedCards: {} });
  }
}
