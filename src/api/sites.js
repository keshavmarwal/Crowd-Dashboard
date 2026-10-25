import client from './client';

export async function getSites() {
  const { data } = await client.get('/api/sites');
  return data;
}
