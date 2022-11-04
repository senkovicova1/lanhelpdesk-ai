import React from 'react';
import {
  useWindowDimensions,
} from 'react-native';

import {
  View,
  Heading,
  Text,
  Flex,
  Box,
  IconButton,
  Button,
} from "native-base";
import {
  AntDesign
} from '@expo/vector-icons';

import RenderHtml from 'react-native-render-html';

import {
  timestampToString
} from '../../../../helperFunctions/time';

export default function TaskComments(props) {

  const {
    navigation,
    userRights,
    taskId,
    comments,
  } = props;

  const {
    width
  } = useWindowDimensions();

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
            {
              comment.commentAttachments.length > 0 &&
              comment.commentAttachments.map((attachment) => (
                <Button
                  key={attachment.id}
                  variant="ghost"
                  m="0"
                  p="0"
                  justifyContent="flex-start"
                  onPress={() => { }}
                >
                  {attachment.filename}
                </Button>
              ))
            }
            <View></View>
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
              )
            }}
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