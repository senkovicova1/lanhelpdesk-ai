import React from 'react';
import { Text, View } from 'react-native';
import { Button } from "native-base";

export default function Calendar ( props ) {

  const {
    navigation
  } = props;

  return (
    <View>
      <Text>Hello, I am your calendar!</Text>
    </View>
  );
}
