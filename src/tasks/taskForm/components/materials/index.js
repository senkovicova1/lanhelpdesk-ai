import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';


export default function TaskMaterial ( props ) {

  const {
    navigation,
    taskId,
    task,
  } = props;

  return (
    <Box>

      {
        task.materials.map((material) => (
          <Box key={material.id} marginTop="5">
            <Flex direction="row" justify="space-between">
              <Flex direction="row" justify="space-between" alignItems="center">
                {
                  material.done &&
                  <MaterialIcons name="check-box" size={24} color="black" />
                }
                {
                  !material.done &&
                  <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                }
                <Heading variant="list" size="sm">{material.title}</Heading>
              </Flex>
              <IconButton
                onPress={() => {navigation.navigate('MaterialAdd')}}
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
              <Text>{`${material.quantity} x ${material.price} = ${material.quantity*material.price}e`}</Text>
            </Flex>

            <Divider w="100%" marginTop="2"/>
          </Box>
        ))
      }

      <Box marginTop="5" alignItems="center">
        <IconButton
          onPress={() => {navigation.navigate('SubtaskAdd')}}
          variant="solid"
          width="50px"
          borderRadius="20"
          _icon={{
            as: AntDesign,
            name: "plus",
          }}
          />
      </Box>

    </Box>
  );
}
