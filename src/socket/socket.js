import { io } from 'socket.io-client';

// `import.meta.env` is undefined outside Vite (e.g. in node tests), hence the fallback.
const env = import.meta.env ?? {};


export const SOCKET_URL =
  env.VITE_SOCKET_URL || env.VITE_API_BASE_URL || 'https://hiring-dev.internal.kloudspot.com';

export function createSocket(token, url = SOCKET_URL) {
  return io(url, {
    path: env.VITE_SOCKET_PATH || '/socket.io',
    transports: ['websocket'], 
    auth: { token },
    reconnectionDelayMax: 10_000,
  });
}
