import { neon } from '@netlify/neon';

export default async (req, context) => {
    const sql = neon(); // Netlify가 자동으로 DATABASE_URL 환경변수 사용

    try {
        // 🎨 tier + item + 관계 LEFT JOIN (아이템 없는 tier도 포함)
        const rows = await sql`
            SELECT
                t.id AS tier_id,
                t.name AS tier_name,
                t.color AS tier_color,
                t.priority,
                i.id AS item_id,
                i.title,
                i.description,
                i.image_url,
                i.thumbnail_url,
                i.types
            FROM tiers t
                     LEFT JOIN tier_items ti ON t.id = ti.tier_id
                     LEFT JOIN items i ON ti.item_id = i.id
            ORDER BY t.priority ASC, ti.position ASC NULLS LAST, i.id ASC
        `;

        // 📦 tier별로 데이터 그룹화
        const tiers = {};
        for (const row of rows) {
            if (!tiers[row.tier_id]) {
                tiers[row.tier_id] = {
                    id: row.tier_id,
                    name: row.tier_name,
                    color: row.tier_color,
                    priority: row.priority,
                    items: [],
                };
            }
            if (row.item_id) { // 아이템이 있는 경우만 추가
                tiers[row.tier_id].items.push({
                    id: row.item_id,
                    title: row.title,
                    description: row.description,
                    image_url: row.image_url,
                    thumbnail_url: row.thumbnail_url,
                    types: row.types,
                });
            }
        }

        return new Response(JSON.stringify({
            success: true,
            data: Object.values(tiers),
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('❌ Neon DB Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
