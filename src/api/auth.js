import client from './client';

export async function loginRequest(email, password) {
  const { data } = await client.post('/api/auth/login', { email, password });
  return data.token;
}
