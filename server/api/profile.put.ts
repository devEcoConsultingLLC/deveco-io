import { updateUserProfile } from '@commonpub/server';
import type { UserProfile } from '@commonpub/server';
import { updateProfileSchema } from '@commonpub/schema';

export default defineEventHandler(async (event): Promise<UserProfile> => {
  const db = useDB();
  const user = requireAuth(event);
  const input = await parseBody(event, updateProfileSchema);

  const profile = await updateUserProfile(db, user.id, input);

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' });
  }

  return profile;
});
