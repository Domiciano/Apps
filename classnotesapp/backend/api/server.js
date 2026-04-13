/* eslint-env node */

import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import cors from 'cors';

const { Pool } = pg;
const app = express();

const PORT = process.env.PORT || 3001;
const BASE_PATH = process.env.BASE_PATH || '/appsprovider';

// Middlewares
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

const extractTitleFromLessonContent = (content) => {
  if (typeof content !== 'string') return null;

  const line = content
    .split(/\r?\n/g)
    .map((l) => l.trim())
    .find((l) => l.startsWith('[t]'));

  if (!line) return null;
  return line.slice(3).trim() || null;
};

// Test DB connection (optional but useful)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Successfully connected to the database at:', res.rows[0].now);
  }
});

// Router scoped under base path
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get lesson metadata (slug + title extracted from content)
// Optional query: ?slugs=slug1,slug2,slug3
router.get('/api/lessons/meta', async (req, res) => {
  const { slugs: slugsParam } = req.query;
  const slugs =
    typeof slugsParam === 'string' && slugsParam.trim() !== ''
      ? slugsParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : null;

  try {
    const result = slugs?.length
      ? await pool.query(
          'SELECT slug, content FROM lessons WHERE slug = ANY($1::text[])',
          [slugs],
        )
      : await pool.query('SELECT slug, content FROM lessons');

    res.json(
      result.rows.map((row) => ({
        slug: row.slug,
        title: extractTitleFromLessonContent(row.content),
      })),
    );
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific lesson by slug
router.get('/api/lessons/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT content FROM lessons WHERE slug = $1', [slug]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Lesson not found' });
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all lesson slugs (useful for building navigation or TOC)
router.get('/api/lessons', async (req, res) => {
  try {
    const result = await pool.query('SELECT slug FROM lessons');
    res.json(result.rows.map((row) => row.slug));
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mount router under base path
app.use(BASE_PATH, router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${BASE_PATH}`);
});

