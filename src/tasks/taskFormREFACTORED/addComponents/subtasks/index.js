import React, {useState} from 'react';
import { DeviceEventEmitter } from "react-native"
import {
  useMutation,
  useQuery
} from "@apollo/client";
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

export default function TaskSubtasks ( props ) {

  const {
    navigation,
    subtasks,
    setSubtasks,
    assignedTo,
  } = props;

  const getMinId = () => {
    let minId = -1;
    for (var i = 0; i < subtasks.length; i++) {
      if (minId > subtasks[i].id) {
        minId = subtasks[i].id;
      }
    }
    return minId;
  }

  const addSubtask = (newSubtask) => {
    setSubtasks([...subtasks, {
      id: getMinId() - 1,
      title: newSubtask.title,
      done: newSubtask.done,
      quantity: isNaN(parseFloat(newSubtask.quantity)) ? 0 : parseFloat(newSubtask.quantity),
      assignedTo: newSubtask.assignedTo,
      order: subtasks.length,
      approved: false,
      discount: 0,
      scheduled: null,
      fromInvoice: false,
    }]);
  }

  const editSubtask = (newData) => {
    setSubtasks(subtasks.map((subtask) => {
      if (subtask.id === newData.id){
        return {
          ...subtask,
          ...newData,
        }
      }
      return subtask;
    }));
  }

  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => (subtask.id !== id)));
  }

  DeviceEventEmitter.addListener("event.addSubtask", (eventData) =>
  addSubtask(eventData));

  DeviceEventEmitter.addListener("event.editSubtask", (eventData) =>
  editSubtask(eventData));

  DeviceEventEmitter.addListener("event.removeSubtask", (eventData) =>
  removeSubtask(eventData));

  return (
    <Box mb="10">
      {
        subtasks.map((subtask) => (
          <Box key={subtask.id} marginTop="5">
            <Flex direction="row" justify="space-between">
              <Flex direction="row" justify="space-between" alignItems="center">
                {
                  subtask.done &&
                  <MaterialIcons name="check-box" size={24} color="black" />
                }
                {
                  !subtask.done &&
                  <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                }
                <Heading variant="list" size="sm">{subtask.title}</Heading>
              </Flex>
              <IconButton
                onPress={() => {
                  navigation.navigate('SubtaskEdit',
                    {
                      addingTask: true,
                      users: assignedTo,
                      subtaskId: subtask.id,
                      subtaskDone: subtask.done,
                      subtaskTitle: subtask.title,
                      subtaskAssignedTo: subtask.assignedTo,
                      subtaskQuantity: subtask.quantity,
                    }
                  )
                }}
                p="0"
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "pencil",
                  color: "#0078d4"
                }}
                />
            </Flex>

            <Flex direction="row" justify="space-between">
              <Text>{subtask.assignedTo.fullName}</Text>
              <Text>{`${subtask.quantity}h`}</Text>
            </Flex>

            <Divider w="100%" marginTop="2"/>
          </Box>
        ))
      }

      <Box marginTop="5" alignItems="center">
        {
          assignedTo.length === 0 &&
          <Text>You must first assign the task to someone!</Text>
        }
        {
          assignedTo.length > 0 &&
          <IconButton
            onPress={() => {
              navigation.navigate('SubtaskAdd',
                {
                  users: assignedTo,
                  addingTask: true,
                  newSubtaskOrder: subtasks.length
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
        }
      </Box>
    </Box>
  );
}
