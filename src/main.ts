import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { SqliteUrlRepository } from './infrastructure/database/SqliteUrlRepository.js';
import { urlRoutes } from './api/routes/urlRoutes.js';

const fastify = Fastify({
  logger: true
});

await fastify.register(cors);

await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'URL Shortener API',
      description: 'API for shortening URLs',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
});

await fastify.register(swaggerUi, {
  routePrefix: '/documentation'
});

const urlRepository = new SqliteUrlRepository();
await fastify.register(async (fastify) => {
  await urlRoutes(fastify, urlRepository);
});

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
  console.log('Server is running on http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}