import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

export default function TaskInfo ( props ) {

  const {
    navigation,
    taskId,
    task,
    currentUser,
    accessRights,
    companies,
    users,
    client,
  } = props;

  return (
    <Box>
      <Box marginTop="5">
        <Flex direction="row" justify="space-between">
          <Heading variant="list" size="sm">Description</Heading>
          <IconButton
            onPress={() => {}}
            p="0"
            variant="ghost"
            _icon={{
              as: Ionicons ,
              name: "pencil",
              color: "#0078d4"
            }}
            />
        </Flex>
        <Box bgColor="white" p="1">
          <Text>{task.description.length > 0 ? task.description : "No description"}</Text>
        </Box>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Tags</Heading>
        {
          task.tags.map((tag) => (
            <Badge
              key={tag.id}
              color="white"
              bgColor={tag.color}
              _text={{
                color: "white"
              }}
              >
              {tag.title}
            </Badge>
          ))
        }
        <Button variant="link" m="0" p="0" justifyContent="flex-start"> + Tags </Button>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Attachments</Heading>
        {
          task.taskAttachments.map((attachment) => (
            <Button variant="ghost" m="0" p="0" justifyContent="flex-start">
              {attachment.filename}
            </Button>
          ))
        }
        <Button variant="ghost" m="0" p="0" justifyContent="flex-start"> + Attachments </Button>
      </Box>
    </Box>
)
}
