import { MongoClient } from "mongodb";

export async function handler(event) {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB;
    const collectionName = process.env.MONGO_COLLECTION;
    const docId = process.env.MONGO_ID;

    const client = new MongoClient(uri);

    try {
        const body = JSON.parse(event.body); // { tiers: [...], items: {...} }

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        await collection.updateOne(
            { _id: docId },
            { $set: body },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (err) {
        console.error("setData error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    } finally {
        await client.close();
    }
}
