import React, {useState} from 'react';
import { DeviceEventEmitter } from "react-native"
import { View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

export default function TaskMaterial ( props ) {

  const {
    navigation,
    materials,
    setMaterials,
  } = props;

  const getMinId = () => {
    let minId = -1;
    for (var i = 0; i < materials.length; i++) {
      if (minId > materials[i].id) {
        minId = materials[i].id;
      }
    }
    return minId;
  }

  const addMaterial = (newMaterial) => {
    setMaterials([...materials, {
      id: getMinId() - 1,
      title: newMaterial.title,
      done: newMaterial.done,
      quantity: isNaN(parseFloat(newMaterial.quantity)) ? 0 : parseFloat(newMaterial.quantity),
      price: newMaterial.price,
      order: materials.length,
      approved: false,
      margin: 0,
    }]);
  }

  const editMaterial = (newData) => {
    setMaterials(materials.map((material) => {
      if (material.id === newData.id){
        return {
          ...material,
          ...newData,
        }
      }
      return material;
    }));
  }

  const removeMaterial = (id) => {
    setMaterials(materials.filter((material) => (material.id !== id)));
  }

  DeviceEventEmitter.addListener("event.addMaterial", (eventData) =>
  addMaterial(eventData));

  DeviceEventEmitter.addListener("event.editMaterial", (eventData) =>
  editMaterial(eventData));

  DeviceEventEmitter.addListener("event.removeMaterial", (eventData) =>
  removeMaterial(eventData));

  return (
    <Box mb="10">
      {
        materials.map((material) => (
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
                onPress={() => {
                  navigation.navigate('MaterialEdit', {
                    addingTask: true,
                    materialId: material.id,
                    materialDone: material.done,
                    materialTitle: material.title,
                    materialQuantity: material.quantity,
                    materialPrice: material.price,
                  })
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
              <Text>{`${material.quantity} x ${material.price}€ = ${material.quantity*material.price}€`}</Text>
            </Flex>

            <Divider w="100%" marginTop="2"/>
          </Box>
        ))
      }

      <Box marginTop="5" alignItems="center">
        <IconButton
          onPress={() => {navigation.navigate('MaterialAdd',
            {
              addingTask: true,
              newMaterialOrder: materials.order,
            })}}
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
