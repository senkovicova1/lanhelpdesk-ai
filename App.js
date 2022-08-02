import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, Box } from "native-base";
import LanHelpdeskTheme from './src/themeExtension';

import Navigation from './src/navigation';

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={LanHelpdeskTheme}>
        <Navigation />
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
