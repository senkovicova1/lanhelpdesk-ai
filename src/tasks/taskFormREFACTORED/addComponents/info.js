import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, TextArea } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import {
  toSelArr,
} from '../../../helperFunctions/select';

import * as DocumentPicker from 'expo-document-picker';
import localStorage from 'react-native-sync-localstorage';

import axios from 'react-native-axios';
import {
  useApolloClient,
} from "@apollo/client";

import {
  REST_URL,
} from '../../../configs/restAPI';

import {
  GET_TASK,
} from '../../../queries/tasks';

export default function TaskInfo ( props ) {

  const {
    description,
    setDescription,
    project,
    tags,
    setTags,
    attachments,
    addAttachment,
    removeAttachment,
  } = props;

  const client = useApolloClient();

  const [ tagsOpen, setTagsOpen ] = useState(false);

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync();
      addAttachment(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Box marginTop="5">
        <Heading variant="list" size="sm">Description</Heading>
        <Box bgColor="white" p="1">
          <TextArea
            value={description}
            onChangeText={(text) => {
              setDescription(text)
            }}
          />
        </Box>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Tags</Heading>
        {
          (tagsOpen ? toSelArr(project === null ? [] : project.tags) : tags).map((tag) => (
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
            setTagsOpen(!tagsOpen);
          }}
          >
          {tagsOpen ? "Save tags" : "+ Tags"}
        </Button>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Attachments</Heading>
        {
          attachments.map((attachment, index) => (
            <Flex direction="row" justify="space-between">
              <Button key={attachment.id} variant="ghost" m="0" p="0" justifyContent="flex-start">
                {attachment.filename}
              </Button>
              <IconButton
                onPress={() => {
                  removeAttachment(index);
                }}
                p="0"
                variant="ghost"
                _icon={{
                    as: Ionicons ,
                    name: "trash",
                    color: "#0078d4"
                }}
                />
            </Flex>
          ))
        }
        <Button key="addAttachment" variant="ghost" m="0" p="0" justifyContent="flex-start" onPress={selectFile}> + Attachments </Button>
      </Box>
    </Box>
)
}
