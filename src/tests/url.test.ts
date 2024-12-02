import { describe, it, expect, beforeEach } from 'vitest';
import { SqliteUrlRepository } from '../infrastructure/database/SqliteUrlRepository.js';
import { CreateShortUrlCommand } from '../application/commands/CreateShortUrl.js';
import { GetUrlByShortCodeQuery } from '../application/queries/GetUrlByShortCode.js';

describe('URL Shortener', () => {
  let repository: SqliteUrlRepository;
  let createCommand: CreateShortUrlCommand;
  let getQuery: GetUrlByShortCodeQuery;

  beforeEach(() => {
    repository = new SqliteUrlRepository();
    createCommand = new CreateShortUrlCommand(repository);
    getQuery = new GetUrlByShortCodeQuery(repository);
  });

  it('should create a short URL', async () => {
    const url = await createCommand.execute({
      originalUrl: 'https://example.com'
    });

    expect(url.originalUrl).toBe('https://example.com');
    expect(url.shortCode).toBeDefined();
    expect(url.clicks).toBe(0);
  });

  it('should create a short URL with custom alias', async () => {
    const url = await createCommand.execute({
      originalUrl: 'https://example.com',
      customAlias: 'custom'
    });

    expect(url.shortCode).toBe('custom');
  });

  it('should retrieve and increment clicks', async () => {
    const created = await createCommand.execute({
      originalUrl: 'https://example.com'
    });

    const retrieved = await getQuery.execute(created.shortCode);
    expect(retrieved?.clicks).toBe(1);
  });
});