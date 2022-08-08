import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import Info from './components/info';
import Attributes from './components/attributes';
import Comments from './components/comments';
import Subtasks from './components/subtasks';
import Materials from './components/materials';

export default function TaskForm ( props ) {

  const {
    navigation,
    taskId,
  } = props;

  const [displayCard, setDisplayCard] = useState("info");

  return (
    <View>
      <Flex direction="row" justify="space-between">
        <Heading variant="list" size="md">12: Task title</Heading>
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
      <Flex direction="row" justify="space-between"  marginTop="5">
        <IconButton
          onPress={() => setDisplayCard("info")}
          variant={displayCard === "info" ? "solid" : "ghost"}
          _icon={{
            as: FontAwesome5 ,
            name: "info-circle",
            color: displayCard === "info" ? "white" : "#0078d4",
          }}
          />
        <IconButton
          onPress={() => setDisplayCard("attributes")}
          variant={displayCard === "attributes" ? "solid" : "ghost"}
          _icon={{
            as: MaterialIcons ,
            name: "menu",
            color: displayCard === "attributes" ? "white" : "#0078d4"
          }}
          />
        <IconButton
          onPress={() => setDisplayCard("comments")}
          variant={displayCard === "comments" ? "solid" : "ghost"}
          _icon={{
            as: Ionicons  ,
            name: "chatbubbles-sharp",
            color: displayCard === "comments" ? "white" : "#0078d4"
          }}
          />
        <IconButton
          onPress={() => setDisplayCard("subtasks")}
          variant={displayCard === "subtasks" ? "solid" : "ghost"}
          _icon={{
            as: Entypo  ,
            name: "list",
            color: displayCard === "subtasks" ? "white" : "#0078d4"
          }}
          />
        <IconButton
          onPress={() => setDisplayCard("materials")}
          variant={displayCard === "materials" ? "solid" : "ghost"}
          _icon={{
            as: FontAwesome5  ,
            name: "euro-sign",
            color: displayCard === "materials" ? "white" : "#0078d4"
          }}
          />
      </Flex>

      <Divider w="100%" />

      {
        displayCard === "info" &&
        <Info />
      }

      {
        displayCard === "attributes" &&
        <Attributes />
      }

      {
        displayCard === "comments" &&
        <Comments />
      }

      {
        displayCard === "subtasks" &&
        <Subtasks />
      }

      {
        displayCard === "materials" &&
        <Materials />
      }
    </View>
  );
}
