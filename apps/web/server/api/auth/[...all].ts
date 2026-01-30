import { auth } from '@deveco/auth';
import { toWebRequest, sendWebResponse } from 'h3';

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  const response = await auth.handler(request);
  return sendWebResponse(event, response);
});
