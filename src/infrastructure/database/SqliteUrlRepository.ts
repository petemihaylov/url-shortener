import Database from 'better-sqlite3';
import { Url, CreateUrlDto } from '../../core/entities/Url.js';
import { UrlRepository } from '../../core/ports/UrlRepository.js';
import { nanoid } from 'nanoid';

export class SqliteUrlRepository implements UrlRepository {
  private db: Database.Database;

  constructor() {
    this.db = new Database(':memory:');
    this.initialize();
  }

  private initialize() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id TEXT PRIMARY KEY,
        originalUrl TEXT NOT NULL,
        shortCode TEXT UNIQUE NOT NULL,
        customAlias TEXT UNIQUE,
        createdAt TEXT NOT NULL,
        clicks INTEGER DEFAULT 0
      )
    `);
  }

  async create(data: CreateUrlDto): Promise<Url> {
    const shortCode = data.customAlias || nanoid(8);
    const url: Url = {
      id: nanoid(),
      originalUrl: data.originalUrl,
      shortCode,
      customAlias: data.customAlias,
      createdAt: new Date(),
      clicks: 0
    };

    const stmt = this.db.prepare(`
      INSERT INTO urls (id, originalUrl, shortCode, customAlias, createdAt, clicks)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      url.id,
      url.originalUrl,
      url.shortCode,
      url.customAlias,
      url.createdAt.toISOString(),
      url.clicks
    );

    return url;
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    const stmt = this.db.prepare('SELECT * FROM urls WHERE shortCode = ?');
    const row = stmt.get(shortCode);
    
    if (!row) return null;
    
    return {
      ...row,
      createdAt: new Date(row.createdAt)
    };
  }

  async findByOriginalUrl(originalUrl: string): Promise<Url | null> {
    const stmt = this.db.prepare('SELECT * FROM urls WHERE originalUrl = ?');
    const row = stmt.get(originalUrl);
    
    if (!row) return null;
    
    return {
      ...row,
      createdAt: new Date(row.createdAt)
    };
  }

  async incrementClicks(id: string): Promise<void> {
    const stmt = this.db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE id = ?');
    stmt.run(id);
  }

  async getMostClicked(limit: number): Promise<Url[]> {
    const stmt = this.db.prepare('SELECT * FROM urls ORDER BY clicks DESC LIMIT ?');
    const rows = stmt.all(limit);
    
    return rows.map(row => ({
      ...row,
      createdAt: new Date(row.createdAt)
    }));
  }
}