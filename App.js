import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, Text } from 'native-base';

import {
    ApolloProvider,
    ApolloClient,
    from as ApolloFrom,
    split,
    HttpLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import {
    cache,
    processErrors,
} from './src/apollo_copy/createClient';

import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as graphqlCreateClient } from 'graphql-ws';

import { setContext } from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
import { setIsLoggedIn } from './src/apollo_copy/localSchema/actions';
import { afterNowFNS } from './src/helperFunctions';
//import refreshToken from '.src/apollo_copy/refreshToken';

//import { ApolloProvider } from '@apollo/client';
//import createClient from './src/apollo_copy/createClient';

import LanHelpdeskTheme from './src/themeExtension';

import Navigation from './src/components/navigation';
import HelpdeskConnect from './src/components/helpdeskConnect';

import initializeTranslations from './src/configs/translations';
import axios from 'react-native-axios';
import localStorage from 'react-native-sync-localstorage';
import { DeviceEventEmitter } from 'react-native';
/*
import {
    REST_URL,
    SOCKET_URL,
} from './src/configs/restAPI';*/

initializeTranslations();

export default function App() {
    const [client, setClient] = useState(null);

    const [helpdeskPrefix, setHelpdeskPrefix] =
        useState('');
    const [port, setPort] = useState('');

    const REST_URL =
        helpdeskPrefix === 'localhost'
            ? `http://192.168.1.13:${port}`
            : `https://${helpdeskPrefix}.lantask.eu:${port}`;
    const SOCKET_URL =
        helpdeskPrefix === 'localhost'
            ? `ws://192.168.1.13:${port}`
            : `wss://${helpdeskPrefix}.lantask.eu:${port}`;

    console.log(REST_URL, SOCKET_URL);

    /*Create client*/
    function createClient() {
        /*Connection link*/
        const httpLink = new HttpLink({
            uri: `${REST_URL}/graphql`,
            credentials: 'include',
        });

        const socketLink = new GraphQLWsLink(
            graphqlCreateClient({
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

        const connectionLink = split(
            ({ query }) => {
                const definition = getMainDefinition(query);
                return (
                    definition.kind ===
                        'OperationDefinition' &&
                    definition.operation === 'subscription'
                );
            },
            socketLink,
            httpLink
        );

        /*Auth Link*/
        const authLink = setContext(
            async (_, { headers }) => {
                let token = localStorage.getItem('acctok');
                if (!token) {
                    return headers;
                }
                if (!afterNowFNS(jwtDecode(token).exp)) {
                    const { ok, accessToken } = (
                        await refreshToken()
                    ).data;
                    if (ok) {
                        token = accessToken;
                        localStorage.setItem(
                            'acctok',
                            accessToken
                        );
                    } else {
                        localStorage.removeItem('acctok');
                        setIsLoggedIn(false);
                    }
                }
                return {
                    headers: {
                        ...headers,
                        authorization: `Bearer ${token}`,
                    },
                };
            }
        );

        const client = new ApolloClient({
            cache,
            link: ApolloFrom([
                onError(processErrors),
                authLink,
                connectionLink,
            ]),
        });
        return client;
    }

    /*Refresh Token*/
    async function refreshToken() {
        return axios.request({
            url: `${REST_URL}/refresh_token`,
            method: 'post',
            withCredentials: true,
        });
    }

    const connectToHelpdesk = () => {
        localStorage.setItem(
            'helpdeskURL',
            helpdeskPrefix === 'localhost'
                ? `192.168.1.13`
                : `${helpdeskPrefix}.lantask.eu`
        );
        localStorage.setItem('port', port);

        setClient(createClient());
    };

    DeviceEventEmitter.addListener('event.logOut', () => {
        setClient(null);
    });

    console.log(client ? Object.keys(client) : 'no');

    if (!client) {
        return (
            <NativeBaseProvider theme={LanHelpdeskTheme}>
                <HelpdeskConnect
                    helpdeskPrefix={helpdeskPrefix}
                    setHelpdeskPrefix={setHelpdeskPrefix}
                    port={port}
                    setPort={setPort}
                    connectToHelpdesk={connectToHelpdesk}
                />
            </NativeBaseProvider>
        );
    }

    return (
        <ApolloProvider client={client}>
            <NavigationContainer>
                <NativeBaseProvider
                    theme={LanHelpdeskTheme}
                >
                    <Navigation
                        returnToConnection={() => {
                            setClient(null);
                        }}
                    />
                </NativeBaseProvider>
            </NavigationContainer>
        </ApolloProvider>
    );
}
