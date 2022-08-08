import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

export default function TaskAttributes ( props ) {

  const {
    navigation,
    taskId,
  } = props;

  return (
    <Box>
      <Box marginTop="5">
        <Heading variant="list" size="sm">Status</Heading>
        <Select
          defaultValue="web"
          bgColor="#00d462"
          >
          <Select.Item label="New" value="ux" />
          <Select.Item label="Open" value="web" />
          <Select.Item label="Pending" value="cross" />
          <Select.Item label="Closed" value="ui" />
          <Select.Item label="Invalid" value="backend" />
        </Select>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Project</Heading>
        <Select
          defaultValue="ux"
          >
          <Select.Item label="LanSystems" value="ux" />
        </Select>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Requester</Heading>
        <Select
          defaultValue="ux"
          >
          <Select.Item label="Sonka" value="ux" />
        </Select>
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Company</Heading>
        <Select
          defaultValue="ux"
          >
          <Select.Item label="FakeBridge" value="ux" />
        </Select>
      </Box>

      <Box marginTop="5">
          <Heading variant="list" size="sm">Assigned</Heading>
          <Select
            defaultValue="ux"
            >
            <Select.Item label="Sonka" value="ux" />
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
