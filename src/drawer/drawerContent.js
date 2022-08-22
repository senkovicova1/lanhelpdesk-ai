import React from 'react';
import { Platform } from 'react-native';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Pressable,
  Text,
} from "native-base";
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import DrawerContentFilters from './components/filters';
import DrawerContentProjects from './components/projects';

export default function CustomDrawerContent(props) {

  const {
    navigation
  } = props;

  return (
    <DrawerContentScrollView {...props}>
      <Box bgColor="#0078d4" p="5" >
        <Flex direction="row" alignItems="center">
          <IconButton
            onPress={(props) => navigation.toggleDrawer()}
            variant="subtle"
            mr="5"
            _icon={{
              as: MaterialIcons,
              name: "menu",
              color: "#0078d4"
            }}
          />
        <Heading variant="main" size="md" >LanHelpdeskApp</Heading>
        </Flex>
        <Heading variant="main" size="sm" mt="2">lansystems.lanhelpdesk.com</Heading>
      </Box>

      <Box
        flexGrow="1"
        bgColor="white"
        >

      <Box>
        <DrawerContentProjects />

        <Box m="5">
          <Divider/>
        </Box>

        <DrawerContentFilters />

        <Box m="5">
          <Divider/>
        </Box>

      </Box>

      <Box>
        <Button
          variant="ghost"
          px="5"
          pt="2"
          width="110px"
          onPress={() => {navigation.navigate("TaskAdd")}}
          >
          <Flex direction="row" alignItems="center">
            <Box mr="2" w="5" alignItems="center">
              <AntDesign name="plus" size={16} color="#0078d4"/>
            </Box>
            <Text fontSize="md" color="#0078d4">Task</Text>
          </Flex>
        </Button>

        <Flex direction="row" alignItems="center" mx="5">
          <Box mr="2" w="5" alignItems="center">
            <Feather name="settings" size={16} color="black"/>
          </Box>
          <Heading variant="list" size="md">Settings</Heading>
        </Flex>

        <Pressable px="5" pt="2" onPress={() => navigation.navigate("UserList")}>
          <Flex direction="row" alignItems="center">
            <Box mr="2" w="5" alignItems="center">
            <FontAwesome5 name="users-cog" size={16} color="black"/>
          </Box>
            <Text fontSize="md">Users</Text>
          </Flex>
        </Pressable>

        <Pressable px="5" pt="2" onPress={() => navigation.navigate("CompanyList")}>
          <Flex direction="row" alignItems="center">
            <Box mr="2" w="5" alignItems="center">
            <MaterialCommunityIcons name="office-building-cog" size={16} color="black"/>
          </Box>
            <Text fontSize="md">Companies</Text>
          </Flex>
        </Pressable>

        <Pressable px="5" pt="2" onPress={() => navigation.navigate("CompanyList")}>
          <Flex direction="row" alignItems="center">
            <Box mr="2" w="5" alignItems="center">
              <FontAwesome5 name="user" size={16} color="black"/>
          </Box>
            <Text fontSize="md">Sonka</Text>
          </Flex>
        </Pressable>

        <Pressable px="5" pt="2" onPress={() => navigation.navigate("CompanyList")}>
          <Flex direction="row" alignItems="center">
            <Box mr="2" w="5" alignItems="center">
              <MaterialIcons name="logout" size={16} color="black" />
            </Box>
            <Text fontSize="md">Logout</Text>
          </Flex>
        </Pressable>

        <Button
          variant="ghost"
          px="5"
          pt="2"
          width="110px"
          onPress={() => {}}
          >
          <Flex direction="row" alignItems="center">
            <Box mr="2" w="5" alignItems="center">
              <AntDesign name="plus" size={16} color="#0078d4"/>
            </Box>
            <Text fontSize="md" color="#0078d4">Konto</Text>
          </Flex>
        </Button>

      </Box>
    </Box>

    </DrawerContentScrollView>
  );
}
