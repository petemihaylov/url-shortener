import { Url } from '../../core/entities/Url.js';
import { UrlRepository } from '../../core/ports/UrlRepository.js';

export class GetUrlByShortCodeQuery {
  constructor(private urlRepository: UrlRepository) {}

  async execute(shortCode: string): Promise<Url | null> {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (url) {
      await this.urlRepository.incrementClicks(url.id);
    }
    return url;
  }
}