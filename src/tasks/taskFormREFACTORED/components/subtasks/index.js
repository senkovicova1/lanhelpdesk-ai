import React, {useState} from 'react';
import { Platform } from 'react-native';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

export default function TaskSubtasks ( props ) {

  const {
    navigation,
    taskId,
    subtasks,
    setSaving,
    userRights,
  } = props;

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
              {
                userRights.rights.taskWorksWrite &&
                <IconButton
                  onPress={() => {
                    navigation.navigate('TaskEditSubtaskEdit',
                      {
                        users: props.users,
                        taskId,
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
              }
            </Flex>

            <Flex direction="row" justify="space-between">
              <Text>{subtask.assignedTo.fullName}</Text>
              <Text>{`${subtask.quantity}h`}</Text>
            </Flex>

            <Divider w="100%" marginTop="2"/>
          </Box>
        ))
      }

      {
        userRights.rights.taskWorksWrite &&
        <Box marginTop="5" alignItems="center">
          <IconButton
            onPress={() => {
              navigation.navigate('TaskEditSubtaskAdd',
                {
                  users: props.users,
                  newSubtaskOrder: subtasks.length,
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
  );
}
