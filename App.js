import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, Box } from "native-base";

import {
  ApolloProvider
} from '@apollo/client'
import createClient from './src/apollo/createClient';

import LanHelpdeskTheme from './src/themeExtension';

import Navigation from './src/navigation';

import initializeTranslations from './src/configs/translations';

const client = createClient();
const i18n = initializeTranslations();

export default function App() {

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <NativeBaseProvider theme={LanHelpdeskTheme}>
          <Navigation />
        </NativeBaseProvider>
      </NavigationContainer>
    </ApolloProvider>
  );
}
