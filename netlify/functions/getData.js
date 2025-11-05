import { MongoClient } from "mongodb";

export async function handler() {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB;
    const collectionName = process.env.MONGO_COLLECTION;
    const docId = process.env.MONGO_ID;

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const doc = await collection.findOne({ _id: docId });

        return {
            statusCode: 200,
            body: JSON.stringify(doc || {}),
        };
    } catch (err) {
        console.error("getData error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    } finally {
        await client.close();
    }
}
