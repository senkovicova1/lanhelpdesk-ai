import React, {useState} from 'react';
import { Platform } from 'react-native';
import { ScrollView, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';
import Form from './form.js';

export default function EditContainer ( props ) {

  const {
    navigation,
    taskId,
  } = props;

  return (
    <ScrollView margin="5">

      <Form taskInfo={null} />

    </ScrollView>
  );
}
