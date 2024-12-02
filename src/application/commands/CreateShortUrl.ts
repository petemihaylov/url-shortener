import { CreateUrlDto, Url } from '../../core/entities/Url.js';
import { UrlRepository } from '../../core/ports/UrlRepository.js';

export class CreateShortUrlCommand {
  constructor(private urlRepository: UrlRepository) {}

  async execute(data: CreateUrlDto): Promise<Url> {
    const existing = await this.urlRepository.findByOriginalUrl(data.originalUrl);
    if (existing) {
      return existing;
    }

    if (data.customAlias) {
      const existingAlias = await this.urlRepository.findByShortCode(data.customAlias);
      if (existingAlias) {
        throw new Error('Custom alias already exists');
      }
    }

    return this.urlRepository.create(data);
  }
}