import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { projectRoutes } from './routes/projects';
import { hardwareRoutes } from './routes/hardware';
import { contestRoutes } from './routes/contests';
import { communityRoutes } from './routes/communities';
import { userRoutes } from './routes/users';
import { searchRoutes } from './routes/search';

const app = Fastify({
  logger: true,
});

async function start() {
  // Plugins
  await app.register(cors, {
    origin: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'devEco.io Public API',
        description: 'Public REST API for the devEco.io Edge AI project platform',
        version: '1.0.0',
      },
      servers: [
        { url: 'http://localhost:3001', description: 'Development' },
        { url: 'https://api.deveco.io', description: 'Production' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Routes
  await app.register(projectRoutes, { prefix: '/api/v1/projects' });
  await app.register(hardwareRoutes, { prefix: '/api/v1/hardware' });
  await app.register(contestRoutes, { prefix: '/api/v1/contests' });
  await app.register(communityRoutes, { prefix: '/api/v1/communities' });
  await app.register(userRoutes, { prefix: '/api/v1/users' });
  await app.register(searchRoutes, { prefix: '/api/v1/search' });

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Start
  const port = parseInt(process.env.API_PORT || '3001', 10);
  const host = process.env.API_HOST || '0.0.0.0';

  await app.listen({ port, host });
  console.log(`devEco API running at http://${host}:${port}`);
  console.log(`Swagger docs at http://${host}:${port}/docs`);
}

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
