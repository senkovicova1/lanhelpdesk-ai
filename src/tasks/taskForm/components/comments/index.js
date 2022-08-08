import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

export default function TaskComments ( props ) {

  const {
    navigation,
    taskId,
  } = props;

  return (
    <Box>
      <Box marginTop="5" bgColor="#e0f6df" p="2">
        <Flex direction="row" justify="space-between">
          <Heading variant="list" size="sm">Sonka</Heading>
          <Text>28.07.2022</Text>
        </Flex>
        <Text>Lorem ipsum</Text>
      </Box>
      <Box marginTop="5" bgColor="#e0f6df" p="2">
        <Flex direction="row" justify="space-between">
          <Heading variant="list" size="sm">Sonka</Heading>
          <Text>28.07.2022</Text>
        </Flex>
        <Text>Lorem ipsum</Text>
      </Box>
      <Box marginTop="5" alignItems="center">
        <IconButton
          onPress={() => {navigation.navigate('CommentAdd')}}
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
)
}
