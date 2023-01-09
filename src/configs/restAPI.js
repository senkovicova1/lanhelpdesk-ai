import localStorage from 'react-native-sync-localstorage';

// TODO: toto zmen na true pred push
export const testing = false;
const production = true;
const port = production ? 8082 : 8083;

export const testingTranslations = testing;

//https://nodejs02.lanhelpdesk.com
//173.212.231.78
/*
const protectedREST = `https://nodejs02.lanhelpdesk.com:${port}`;
const localREST = localStorage.getItem('helpdeskURL')
    ? `http://${localStorage.getItem(
          'helpdeskURL'
      )}:${localStorage.getItem('port')}`
    : ''; // `http://192.168.1.13:4000`;
const protectedSocket = `wss://nodejs02.lanhelpdesk.com:${port}`;
const localSocket = localStorage.getItem('helpdeskURL')
    ? `ws://${localStorage.getItem(
          'helpdeskURL'
      )}:${localStorage.getItem('port')}`
    : ''; // `ws://192.168.1.13:4000`;

export const REST_URL = testing ? localREST : protectedREST;
export const SOCKET_URL = testing
    ? localSocket
    : protectedSocket;
*/

export const REST_URL = `${
    testing ? 'http' : 'https'
}://${localStorage.getItem(
    'helpdeskURL'
)}:${localStorage.getItem('port')}`;
export const SOCKET_URL = `${
    testing ? 'ws' : 'wss'
}://${localStorage.getItem(
    'helpdeskURL'
)}:${localStorage.getItem('port')}`;
