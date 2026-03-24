import { updateUserProfile } from '@commonpub/server';
import type { UserProfile } from '@commonpub/server';
import { updateProfileSchema } from '@commonpub/schema';
import { z } from 'zod';

// Extend the upstream schema to include image URLs that it's missing
const extendedProfileSchema = updateProfileSchema.extend({
  avatarUrl: z.string().url().optional().or(z.literal('')),
  bannerUrl: z.string().url().optional().or(z.literal('')),
});

export default defineEventHandler(async (event): Promise<UserProfile> => {
  const db = useDB();
  const user = requireAuth(event);
  const input = await parseBody(event, extendedProfileSchema);

  const profile = await updateUserProfile(db, user.id, input);

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' });
  }

  return profile;
});
