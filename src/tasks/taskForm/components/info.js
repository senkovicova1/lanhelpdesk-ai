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
    taskId,
    task,
    autoUpdateTask,
    project,
    description,
    setDescription,
    tags,
    setTags,
    attachments,
  } = props;

  const client = useApolloClient();

  const [ editDescription, setEditDescription ] = useState(false);
  const [ tagsOpen, setTagsOpen ] = useState(false);

  const [singleFile, setSingleFile] = useState(null);

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync();
      // Printing the log realted to the file
      console.log("------------------------");
      console.log(res);
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      setSingleFile(res);
      uploadImage(res);
    } catch (err) {
      setSingleFile(null);
      console.log(err);
    }
  };
  //// TODO: download attachment
  const uploadImage = async (file) => {
    // Check if any file is selected or not
    if (file != null) {
      console.log("appending file");
      // If file selected then create FormData
      let fileToUpload = {
        type: file.mimeType,
        name: file.name,
        uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
      };
      const formData = new FormData();
      formData.append( `file`, fileToUpload );
      formData.append( "token", `Bearer ${localStorage.getItem('acctok')}` );
      formData.append( "taskId", taskId );
      formData.append( "fromInvoice", false );

      console.log("posting w/ axios", formData);
      // Please change file upload URL
      axios.post( `${REST_URL}/upload-attachments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          transformRequest: (data, headers) => {
            return formData; // this is doing the trick
          },
        } )
        .then( ( response ) => {
          console.log("JEEEJ");
          const newAttachments = response.data.attachments.map( ( attachment ) => ( {
            ...attachment,
            __typename: "TaskAttachment",
          } ) )
          const oldTask = client.readQuery( {
              query: GET_TASK,
              variables: {
                id: taskId
              }
            } )
            .task;
          client.writeQuery( {
            query: GET_TASK,
            variables: {
              id: taskId
            },
            data: {
              task: {
                ...oldTask,
                taskAttachments: [ ...oldTask.taskAttachments, ...newAttachments ]
              }
            }
          } )
        } )
    }
  };

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
          attachments.map((attachment) => (
            <Button key={attachment.id} variant="ghost" m="0" p="0" justifyContent="flex-start">
              {attachment.filename}
            </Button>
          ))
        }
        <Button key="addAttachment" variant="ghost" m="0" p="0" justifyContent="flex-start" onPress={selectFile}> + Attachments </Button>
      </Box>
    </Box>
)
}
