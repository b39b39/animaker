// netlify/functions/get-tiers.js
import { neon } from '@netlify/neon';

export default async (req, context) => {
    const sql = neon();

    try {
        const tiers = await sql`
      SELECT 
        t.id,
        t.name,
        t.priority,
        COALESCE(
          json_agg(
            json_build_object(
              'id', i.id,
              'title', i.title,
              'description', i.description,
              'strength', i.strength,
              'weakness', i.weakness,
              'image_url', i.image_url,
              'thumbnail_url', i.thumbnail_url,
              'position', ti.position
            ) ORDER BY ti.position
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'
        ) as items
      FROM tiers t
      LEFT JOIN tier_items ti ON t.id = ti.tier_id
      LEFT JOIN items i ON ti.item_id = i.id
      GROUP BY t.id
      ORDER BY t.priority
    `;

        return new Response(JSON.stringify({
            success: true,
            data: tiers
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
