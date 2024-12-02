import { FastifyInstance } from 'fastify';
import { CreateShortUrlCommand } from '../../application/commands/CreateShortUrl.js';
import { GetUrlByShortCodeQuery } from '../../application/queries/GetUrlByShortCode.js';
import { UrlRepository } from '../../core/ports/UrlRepository.js';
import { z } from 'zod';

const createUrlSchema = z.object({
  originalUrl: z.string().url(),
  customAlias: z.string().min(3).max(16).optional()
});

export async function urlRoutes(
  fastify: FastifyInstance,
  urlRepository: UrlRepository
) {
  const createCommand = new CreateShortUrlCommand(urlRepository);
  const getQuery = new GetUrlByShortCodeQuery(urlRepository);

  fastify.post('/api/urls', {
    schema: {
      body: {
        type: 'object',
        required: ['originalUrl'],
        properties: {
          originalUrl: { type: 'string', format: 'uri' },
          customAlias: { type: 'string', minLength: 3, maxLength: 16 }
        }
      }
    }
  }, async (request, reply) => {
    const validation = createUrlSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.code(400).send({ errors: validation.error.errors });
    }

    try {
      const url = await createCommand.execute(validation.data);
      return reply.code(201).send(url);
    } catch (error) {
      if (error instanceof Error && error.message === 'Custom alias already exists') {
        return reply.code(409).send({ error: error.message });
      }
      throw error;
    }
  });

  fastify.get('/:shortCode', async (request, reply) => {
    const { shortCode } = request.params as { shortCode: string };
    const url = await getQuery.execute(shortCode);
    
    if (!url) {
      return reply.code(404).send({ error: 'URL not found' });
    }

    return reply.redirect(301, url.originalUrl);
  });

  fastify.get('/api/urls/most-clicked', async (request, reply) => {
    const urls = await urlRepository.getMostClicked(10);
    return reply.send(urls);
  });
}