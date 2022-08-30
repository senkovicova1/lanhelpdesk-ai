import React, {useState} from 'react';
import { useWindowDimensions } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import RenderHtml from 'react-native-render-html';

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
    userRights,
    taskId,
    comments,
    users,
    disabled,
  } = props;

  const convertToNativeComponents = (text) => {
    // TODO: convertToNativeComponents
    return text;
  }

  const { width } = useWindowDimensions();

  return (
    <Box>
      {
        comments.map((comment) => (
          <Box key={comment.id} marginTop="5" bgColor="#e0f6df" p="2">
            <Flex direction="row" justify="space-between">
              <Heading variant="list" size="sm">{comment.user.fullName}</Heading>
              <Text>{timestampToString(comment.createdAt)}</Text>
            </Flex>
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `
                ${comment.message}`
                }}
              />
          </View>
          </Box>
        ))
      }
      {
        userRights.rights.addComments &&
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
      }
    </Box>
)
}
