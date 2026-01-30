import { auth } from '@deveco/auth';

export default defineEventHandler(async (event) => {
  try {
    const session = await auth.api.getSession({
      headers: event.headers,
    });
    event.context.session = session;
  } catch {
    event.context.session = null;
  }
});
