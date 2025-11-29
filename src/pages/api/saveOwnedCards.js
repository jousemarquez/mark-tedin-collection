import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { ownedCards } = req.body;
    const client = await clientPromise;
    const db = client.db("mark-tedin-db");

    await db.collection("cardsCollection").updateOne(
      { _id: "userCollection" },
      { $set: { ownedCards } },
      { upsert: true }
    );

    res.status(200).json({ message: "Collection updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating collection" });
  }
}
