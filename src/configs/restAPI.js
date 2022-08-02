// TODO: toto zmen na true pred push
export const testing = true;
const production = true;
const port = production ? 8082 : 8083;
// TODO: toto zmen na true pred push
export const testingTranslations = true;
//https://nodejs02.lanhelpdesk.com
//173.212.231.78
const protectedREST = `https://nodejs02.lanhelpdesk.com:${port}`;
const localREST = `http://localhost:4000`;
const protectedSocket = `wss://nodejs02.lanhelpdesk.com:${port}`;
const localSocket = `ws://localhost:4000`;

export const REST_URL = testing ? localREST : protectedREST;
export const SOCKET_URL = testing ? localSocket : protectedSocket;
