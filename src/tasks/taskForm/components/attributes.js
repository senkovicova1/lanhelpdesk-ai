import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import {
  toSelArr,
} from '../../../helperFunctions/select';

export default function TaskAttributes ( props ) {

  const {
    navigation,
    taskId,
    task,
    currentUser,
    accessRights,
    companies,
    users,
    projects,
    client,
  } = props;

  const project = task.project === null ? null : projects.find( ( project ) => project.id === task.project.id );
  const availableProjects = projects.filter( ( project ) => project.right.taskProjectWrite );
  const requesters = ( project && project.project.lockedRequester ? toSelArr( project.usersWithRights.map( ( userWithRights ) => userWithRights.user ), 'fullName' ) : users );
  const assignedTos = project ? users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) ) : [];

  return (
    <Box>
      <Box marginTop="5">
        <Heading variant="list" size="sm">Status</Heading>
        <Select
          defaultValue={task.status.id}
          bgColor={task.status.color}
          >
          {
            (project ? toSelArr(project.project.statuses).filter((status)=>status.action !== 'Invoiced') : []).map((status) => (
              <Select.Item
                key={status.id}
                label={status.label}
                value={status.id}
              />
            ))
          }
        </Select>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Project</Heading>
        <Select
          defaultValue={task.project.id}
          >
          {
            availableProjects.map((project) => (
              <Select.Item
                key={project.id}
                label={project.label}
                value={project.id}
              />
            ))
          }
        </Select>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Requester</Heading>
        <Select
          defaultValue={task.requester.id}
          >
          {
            requesters.map((user) => (
              <Select.Item
                key={user.id}
                label={user.label}
                value={user.id}
              />
            ))
          }
        </Select>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Company</Heading>
        <Select
          defaultValue={task.requester.id}
          >
          {
            requesters.map((user) => (
              <Select.Item
                key={user.id}
                label={user.label}
                value={user.id}
              />
            ))
          }
        </Select>
      </Box>

      <Box marginTop="5">
          <Heading variant="list" size="sm">Assigned</Heading>
          <Select
            defaultValue={task.assignedTo[0].id}
            >
            {
              assignedTos.map((user) => (
                <Select.Item
                  key={user.id}
                  label={user.label}
                  value={user.id}
                />
              ))
            }
          </Select>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Deadline</Heading>
        <Input type="datetime" defaultValue=""/>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Repeats</Heading>
        <Text>No repeat</Text>
      </Box>
    </Box>
  )
}
