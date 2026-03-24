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
  const raw = await parseBody(event, extendedProfileSchema);
  // Convert empty strings to null for URL fields (avoids <img src="">)
  const input = {
    ...raw,
    avatarUrl: raw.avatarUrl || undefined,
    bannerUrl: raw.bannerUrl || undefined,
    website: raw.website || undefined,
  };

  const profile = await updateUserProfile(db, user.id, input);

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' });
  }

  return profile;
});
