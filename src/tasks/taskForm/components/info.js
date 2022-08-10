import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, TextArea } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import {
  toSelArr,
} from '../../../helperFunctions/select';

export default function TaskInfo ( props ) {

  const {
    task,
    autoUpdateTask,
    project,
    description,
    setDescription,
    tags,
    setTags,
  } = props;


  const [ editDescription, setEditDescription ] = useState(false);
  const [ tagsOpen, setTagsOpen ] = useState(false);
  console.log(tags);
  return (
    <Box>
      <Box marginTop="5">
        <Flex direction="row" justify="space-between">
          <Heading variant="list" size="sm">Description</Heading>
          <IconButton
            onPress={() => {
              if (editDescription){
                autoUpdateTask({ description });
              }
              setEditDescription(!editDescription);
            }}
            p="0"
            variant="ghost"
            _icon={
              editDescription ?
              {
                as: Ionicons ,
                name: "save",
                color: "#0078d4"
              } :
              {
                as: Ionicons ,
                name: "pencil",
                color: "#0078d4"
              }
            }
            />
        </Flex>
        <Box bgColor="white" p="1">
          {
            editDescription &&
            <TextArea
              value={description}
              onChangeText={(text) => {
                setDescription(text)
              }}
              />
          }
          {
            !editDescription &&
            <Text>{description.length > 0 ? description : "No description"}</Text>
          }
        </Box>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Tags</Heading>
        {
          (tagsOpen ? toSelArr(project === null ? [] : project.project.tags) : tags).map((tag) => (
            <Pressable
              key={tag.id}
              onPress={() => {
                if (tagsOpen && tags.find((t) => t.id === tag.id)){
                  setTags(tags.filter((t) => t.id !== tag.id));
                } else if (tagsOpen && !tags.find((t) => t.id === tag.id)){
                  setTags([...tags, tag]);
                }
              }}
              >
              <Badge
                key={tag.id}
                color="white"
                bgColor={tag.color}
                borderWidth="5px"
                borderColor={tagsOpen && tags.find((t) => t.id === tag.id) ? "#0078d4" : tag.color}
                mb="2"
                _text={{
                  color: "white"
                }}
                >
                {tag.title}
              </Badge>
            </Pressable>
          ))
        }
        <Button
          variant="link"
          m="0"
          p="0"
          justifyContent="flex-start"
          onPress={() => {
            if (tagsOpen){
              autoUpdateTask({ tags: tags.map((tag) => tag.id ) });
            }
            setTagsOpen(!tagsOpen);
          }}
          >
          {tagsOpen ? "Save tags" : "+ Tags"}
        </Button>
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
