import { listFederationActivity } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  requireFeature('admin');
  requireAdmin(event);
  const db = useDB();

  const query = getQuery(event);
  return listFederationActivity(db, {
    direction: query.direction as 'inbound' | 'outbound' | undefined,
    status: query.status as 'pending' | 'delivered' | 'failed' | 'processed' | undefined,
    type: query.type as string | undefined,
    limit: query.limit ? parseInt(query.limit as string, 10) : 50,
    offset: query.offset ? parseInt(query.offset as string, 10) : 0,
  });
});
