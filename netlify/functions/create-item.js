// netlify/functions/create-item.js
import { neon } from '@netlify/neon';

export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const sql = neon();

    try {
        const { title, description, strength, weakness, image_url, thumbnail_url, tags } = await req.json();

        // 아이템 생성
        const [item] = await sql`
      INSERT INTO items (title, description, strength, weakness, image_url, thumbnail_url)
      VALUES (${title}, ${description}, ${strength}, ${weakness}, ${image_url}, ${thumbnail_url})
      RETURNING *
    `;

        // 태그 연결
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                const [tag] = await sql`
          INSERT INTO tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;

                await sql`
          INSERT INTO item_tags (item_id, tag_id)
          VALUES (${item.id}, ${tag.id})
          ON CONFLICT DO NOTHING
        `;
            }
        }

        return new Response(JSON.stringify({
            success: true,
            data: item
        }), {
            status: 201,
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
