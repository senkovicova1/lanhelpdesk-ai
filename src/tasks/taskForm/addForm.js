import React, {
  useState,
  useEffect
} from 'react';
import {
  DeviceEventEmitter
} from "react-native";
import {
  View,
  Pressable,
  Select,
  Divider,
  Heading,
  Text,
  Flex,
  Box,
  Stack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  Badge,
  CheckIcon
} from "native-base";
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  Entypo,
  AntDesign
} from '@expo/vector-icons';

import Info from './addComponents/info';
import Attributes from './addComponents/attributes';
import Subtasks from './addComponents/subtasks';
import Materials from './addComponents/materials';

export default function TaskForm(props) {

  const {
    title,
    setTitle,
    userRights
  } = props;

  const [displayCard, setDisplayCard] = useState("info");

  return (
    <View>

      <Stack>
        <Input
          type="text"
          defaultValue={title}
          onChangeText={(text) => setTitle(text)}
        />
      </Stack>
      <Flex direction="row" justify="space-between" marginTop="5">
        <IconButton
          onPress={() => {
            setDisplayCard("info");
            DeviceEventEmitter.removeAllListeners("event.addSubtask");
            DeviceEventEmitter.removeAllListeners("event.editSubtask");
            DeviceEventEmitter.removeAllListeners("event.removeSubtask");

            DeviceEventEmitter.removeAllListeners("event.addMaterial");
            DeviceEventEmitter.removeAllListeners("event.editMaterial");
            DeviceEventEmitter.removeAllListeners("event.removeMaterial");
          }}
          variant={displayCard === "info" ? "solid" : "ghost"}
          _icon={{
            as: FontAwesome5,
            name: "info-circle",
            color: displayCard === "info" ? "white" : "#0078d4",
          }}
        />
        <IconButton
          onPress={() => {
            setDisplayCard("attributes")
            DeviceEventEmitter.removeAllListeners("event.addSubtask");
            DeviceEventEmitter.removeAllListeners("event.editSubtask");
            DeviceEventEmitter.removeAllListeners("event.removeSubtask");

            DeviceEventEmitter.removeAllListeners("event.addMaterial");
            DeviceEventEmitter.removeAllListeners("event.editMaterial");
            DeviceEventEmitter.removeAllListeners("event.removeMaterial");
          }}
          variant={displayCard === "attributes" ? "solid" : "ghost"}
          _icon={{
            as: MaterialIcons,
            name: "menu",
            color: displayCard === "attributes" ? "white" : "#0078d4"
          }}
        />
        {
          userRights.rights.taskWorksRead &&
          <IconButton
            onPress={() => {
              setDisplayCard("subtasks");

              DeviceEventEmitter.removeAllListeners("event.addMaterial");
              DeviceEventEmitter.removeAllListeners("event.editMaterial");
              DeviceEventEmitter.removeAllListeners("event.removeMaterial");
            }}
            variant={displayCard === "subtasks" ? "solid" : "ghost"}
            _icon={{
              as: Entypo,
              name: "list",
              color: displayCard === "subtasks" ? "white" : "#0078d4"
            }}
          />
        }
        <IconButton
          onPress={() => {
            setDisplayCard("materials")
            DeviceEventEmitter.removeAllListeners("event.addSubtask");
            DeviceEventEmitter.removeAllListeners("event.editSubtask");
            DeviceEventEmitter.removeAllListeners("event.removeSubtask");
          }}
          variant={displayCard === "materials" ? "solid" : "ghost"}
          _icon={{
            as: FontAwesome5,
            name: "euro-sign",
            color: displayCard === "materials" ? "white" : "#0078d4"
          }}
        />
      </Flex>

      <Divider w="100%" />

      {
        displayCard === "info" &&
        <Info
          {...props}
        />
      }

      {
        displayCard === "attributes" &&
        <Attributes {...props} />
      }

      {
        displayCard === "subtasks" &&
        <Subtasks {...props} />
      }

      {
        displayCard === "materials" &&
        <Materials {...props} />
      }
    </View>
  );
}