import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";

import {
  timestampToString
} from '../../../../helperFunctions/time';

export default function TaskComments ( props ) {

  const {
    navigation,
    taskId,
    comments,
    users,
    userRights,
    disabled,
  } = props;

  const convertToNativeComponents = (text) => {
    // TODO: convertToNativeComponents
    return text;
  }

  return (
    <Box>
      {
        comments.map((comment) => (
          <Box key={comment.id} marginTop="5" bgColor="#e0f6df" p="2">
            <Flex direction="row" justify="space-between">
              <Heading variant="list" size="sm">{comment.user.fullName}</Heading>
              <Text>{timestampToString(comment.createdAt)}</Text>
            </Flex>
            <Text>{convertToNativeComponents(comment.message)}</Text>
          </Box>
        ))
      }
      <Box marginTop="5" alignItems="center">
        <IconButton
          onPress={() => {
            navigation.navigate('CommentAdd',
            {
              taskId,
            }
          )}}
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
