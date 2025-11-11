// netlify/functions/getData.js
import { neon } from "@netlify/neon";

export default async function handler(req, res) {
    try {
        const sql = neon(); // 자동으로 NETLIFY_DATABASE_URL을 읽음

        // 간단하게 테이블 전체 조회
        const tiers = await sql`SELECT * FROM tiers ORDER BY priority ASC;`;
        const items = await sql`SELECT * FROM items;`;
        const tags = await sql`SELECT * FROM tags;`;

        return res.status(200).json({ tiers, items, tags });
    } catch (error) {
        console.error("DB Fetch Error:", error);
        return res.status(500).json({ error: "Failed to fetch data" });
    }
}
