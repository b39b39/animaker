// netlify/functions/create-schema.js
import { neon } from '@netlify/neon';

export default async (req, context) => {
    const sql = neon();

    try {
        // 1. Tags 테이블
        await sql`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // 2. Items 테이블
        await sql`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        strength TEXT,
        weakness TEXT,
        image_url TEXT,
        thumbnail_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // 3. Tiers 테이블
        await sql`
      CREATE TABLE IF NOT EXISTS tiers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        priority INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // 4. Item-Tag 관계 테이블
        await sql`
      CREATE TABLE IF NOT EXISTS item_tags (
        item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (item_id, tag_id)
      )
    `;

        // 5. Tier-Item 관계 테이블
        await sql`
      CREATE TABLE IF NOT EXISTS tier_items (
        tier_id INTEGER NOT NULL REFERENCES tiers(id) ON DELETE CASCADE,
        item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
        position INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (tier_id, item_id)
      )
    `;

        // 인덱스 생성
        await sql`CREATE INDEX IF NOT EXISTS idx_items_title ON items(title)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_tiers_priority ON tiers(priority)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_item_tags_item ON item_tags(item_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_item_tags_tag ON item_tags(tag_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_tier_items_tier ON tier_items(tier_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_tier_items_item ON tier_items(item_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_tier_items_position ON tier_items(tier_id, position)`;

        // updated_at 트리거
        await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

        await sql`DROP TRIGGER IF EXISTS update_items_updated_at ON items`;

        await sql`
      CREATE TRIGGER update_items_updated_at
      BEFORE UPDATE ON items
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `;

        return new Response(JSON.stringify({
            success: true,
            message: 'Database schema created successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Schema creation error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
