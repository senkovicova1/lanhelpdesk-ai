import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';


export default function TaskMaterial ( props ) {

  const {
    navigation,
    taskId,
  } = props;

  return (
    <Box>
      <Box marginTop="5">
        <Flex direction="row" justify="space-between">
          <Heading variant="list" size="sm">Toner</Heading>
          <IconButton
            onPress={() => {navigation.navigate('MaterialAdd')}}
            p="0"
            variant="ghost"
            _icon={{
              as: Ionicons ,
              name: "pencil",
              color: "#0078d4"
            }}
            />
        </Flex>
        <Text>1x10e = 10e</Text>
        <Divider w="100%" marginTop="2"/>
      </Box>

      <Box marginTop="5" alignItems="center">
        <IconButton
          onPress={() => {navigation.navigate('MaterialAdd')}}
          variant="solid"
          width="50px"
          borderRadius="20"
          _icon={{
            as: AntDesign,
            name: "plus",
          }}
          />
      </Box>
    </Box>
  );
}
