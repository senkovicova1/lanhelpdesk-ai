import React, {useState} from 'react';
import { useWindowDimensions } from 'react-native';
import { View, Pressable, AlertDialog, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, TextArea } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import {
  toSelArr,
} from '../../../helperFunctions/select';
import RenderHtml from 'react-native-render-html';

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
    taskId,
    task,
    addingTask,
    onSubmit,
    project,
    description,
    setDescription,
    tags,
    setTags,
    attachments,
    addAttachment,
    removeAttachment,
  } = props;

  const { width } = useWindowDimensions();

  const [ editDescription, setEditDescription ] = useState(false);
  const [ tagsOpen, setTagsOpen ] = useState(false);

  const [ attachmentToDelete, setAttachmentToDelete ] = useState(null);

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync();
      addAttachment(res);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelRef = React.useRef(null);

  if (attachmentToDelete){
    return (
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={attachmentToDelete !== null} onClose={() => setAttachmentToDelete(null)}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete an attachment</AlertDialog.Header>
          <AlertDialog.Body>
            {`Are you sure you want to delete attachment ${attachmentToDelete.filename}?`}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={() => setAttachmentToDelete(null)} ref={cancelRef}>
                Cancel
              </Button>
              <Button
                colorScheme="danger"
                onPress={() => {
                  removeAttachment(attachmentToDelete);
                  setAttachmentToDelete(null);
                }}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    )
  }

  return (
    <Box>
      <Box marginTop="5">
        <Flex direction="row" justify="space-between">
          <Heading variant="list" size="sm">Description</Heading>
            <IconButton
              onPress={() => {
                if (editDescription){
                  onSubmit({ description });
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
            description.length > 0 &&
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${description}`
                }}
              />
          }
          {
            !editDescription &&
            description.length === 0 &&
            <Text>No description</Text>
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
              onSubmit({ tags: tags.map((tag) => tag.id ) });
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
          attachments.map((attachment, index) => (
            <Flex direction="row" justify="space-between">
              {
                //// TODO: download attachment
              }
              <Button
                key={attachment.id}
                variant="ghost"
                m="0"
                p="0"
                justifyContent="flex-start"
                onPress={() => {}}
                >
                {attachment.filename}
              </Button>
              <IconButton
                onPress={() => {
                  setAttachmentToDelete(attachment);
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
