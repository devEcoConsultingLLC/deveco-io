import type { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '@deveco/db';
import { users } from '@deveco/db';

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.get('/:username', {
    handler: async (request, reply) => {
      const { username } = request.params as { username: string };
      const user = await db.query.users.findFirst({
        where: eq(users.username, username),
      });
      if (!user) return reply.status(404).send({ error: 'User not found' });

      // Omit sensitive fields
      const { email, ...publicUser } = user;
      return { data: publicUser };
    },
  });
};
