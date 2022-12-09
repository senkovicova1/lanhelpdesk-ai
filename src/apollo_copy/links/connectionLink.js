import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import localStorage from 'react-native-sync-localstorage';

import {
    REST_URL,
    SOCKET_URL,
} from '../../configs/restAPI';

const httpLink = new HttpLink({
    uri: `${REST_URL}/graphql`,
    credentials: 'include',
});

const socketLink = new GraphQLWsLink(
    createClient({
        url: `${SOCKET_URL}/subscriptions`,
        options: {
            reconnect: true,
        },
        connectionParams: () => ({
            authorization: `Bearer ${localStorage.getItem(
                'acctok'
            )}`,
        }),
    })
);

export const connectionLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    socketLink,
    httpLink
);
