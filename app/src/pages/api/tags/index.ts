// tags API: GET, POST /api/tags
import type { APIRoute } from 'astro';
import pg from 'pg';

const { Client } = pg;

const TAG_NAME_MAX_LENGTH = 32;

export const GET: APIRoute = async () => {
  const url = process.env['PG_URL'] || process.env['DATABASE_URL'];
  if (!url) {
    return new Response(JSON.stringify({ error: 'Database URL not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const client = new Client(url);
  try {
    await client.connect();
    const result = await client.query('SELECT id, name FROM tags ORDER BY id ASC');
    // Return as { [id]: name }
    const tagMap: Record<string, string> = {};
    for (const row of result.rows) {
      tagMap[row.id] = row.name;
    }
    return new Response(JSON.stringify(tagMap), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.end();
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) {
    return new Response(JSON.stringify({ error: 'Tag name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (name.length > TAG_NAME_MAX_LENGTH) {
    return new Response(JSON.stringify({ error: `Tag name must be <= ${TAG_NAME_MAX_LENGTH} chars` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = process.env['PG_URL'] || process.env['DATABASE_URL'];
  if (!url) {
    return new Response(JSON.stringify({ error: 'Database URL not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = new Client(url);
  try {
    await client.connect();

    // Check for duplicate
    const dup = await client.query('SELECT id FROM tags WHERE name = $1', [name]);
    if (dup.rows.length > 0) {
      return new Response(JSON.stringify({ error: 'Tag already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert new tag
    const result = await client.query(
      'INSERT INTO tags (name) VALUES ($1) RETURNING id, name',
      [name]
    );
    const tag = result.rows[0];
    return new Response(JSON.stringify(tag), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.end();
  }
};