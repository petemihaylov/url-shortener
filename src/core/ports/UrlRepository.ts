import { Url, CreateUrlDto } from '../entities/Url.js';

export interface UrlRepository {
  create(data: CreateUrlDto): Promise<Url>;
  findByShortCode(shortCode: string): Promise<Url | null>;
  findByOriginalUrl(originalUrl: string): Promise<Url | null>;
  incrementClicks(id: string): Promise<void>;
  getMostClicked(limit: number): Promise<Url[]>;
}