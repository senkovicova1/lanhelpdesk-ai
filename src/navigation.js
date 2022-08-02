import React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, IconButton, Heading } from "native-base";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { FontAwesome, FontAwesome5, AntDesign  } from '@expo/vector-icons';
import {
  useQuery
} from '@apollo/client'

import List from './list';
import Login from './login';
import Calendar from './calendar';
import TaskDetail from './taskDetail';
import CommentAdd from './addComment';
import SubtaskAdd from './subtaskAdd';
import MaterialAdd from './materialAdd';
import Settings from './settings';
import UserList from './userList';
import UserAdd from './userAdd';
import CompanyList from './companyList';
import CompanyAdd from './companyAdd';

import {
  GET_IS_LOGGED_IN,
} from './apollo/localSchema/queries';

const Stack = createNativeStackNavigator();

export default function Navigation (props) {

  const {
    data
  } = useQuery( GET_IS_LOGGED_IN );
  console.log("HI");
  console.log(data.isLoggedIn);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: (props) => (
            <Heading variant="main">LanHelpdesk</Heading>
          ),
          headerStyle: {
            backgroundColor: '#0078d4',
          },
        }}
      />
      <Stack.Screen
        name="List"
        component={List}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerTitle: (props) => <Text>Calendar</Text>,
          headerRight: () => (
            <Heading style={{display: "flex", flexDirection: "row"}}>
              <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#fff"
              />
              <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#fff"
              />
          </Heading>
          ),
          headerLeft: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Info"
              color="#fff"
            />
          ),
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#0078d4',
          },
        }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetail}
        options={{
          headerTitle: (props) => (
            <Heading size="sm">
              <Text></Text>
            </Heading>
          ),
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
      <Stack.Screen
        name="CommentAdd"
        component={CommentAdd}
        options={({navigation}) => ({
          headerTitle: (props) => <Heading variant="main" ml="0">Add a comment</Heading>,
          headerRight: () => (
            <View style={{display: "flex", flexDirection: "row"}}>
              <IconButton
                onPress={() => {}}
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "save",
                  color: "white"
                }}
                />
          </View>
          ),
          headerStyle: {
            backgroundColor: '#0078d4',
            margin: "0px !important",
          },
          headerTintColor: "white",
          headerTitleContainerStyle: {
            backgroundColor: '#006581',
            margin: "0px !important",
          },
            headerTitleStyle: {
              backgroundColor: '#aa58f0',
            margin: "0px !important",
            },
        })}
      />
      <Stack.Screen
        name="SubtaskAdd"
        component={SubtaskAdd}
        options={{
          headerTitle: (props) => <Heading variant="main">Add a subtask</Heading>,
          headerRight: () => (
            <View style={{display: "flex", flexDirection: "row"}}>
              <IconButton
                onPress={() => {}}
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "save",
                  color: "white"
                }}
                />
          </View>
          ),
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
      <Stack.Screen
        name="MaterialAdd"
        component={MaterialAdd}
        options={{
          headerTitle: (props) => <Heading variant="main">Add a material</Heading>,
          headerRight: () => (
            <View style={{display: "flex", flexDirection: "row"}}>
              <IconButton
                onPress={() => {}}
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "save",
                  color: "white"
                }}
                />
          </View>
          ),
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: (props) => <Text>Settings</Text>,
          headerStyle: {
            backgroundColor: '#0078d4',
          },
        }}
      />
      <Stack.Screen
        name="UserList"
        component={UserList}
        options={{
          headerTitle: (props) => <Heading variant="main">Users</Heading>,
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
      <Stack.Screen
        name="UserAdd"
        component={UserAdd}
        options={{
          headerTitle: (props) => <Heading variant="main">Add a user</Heading>,
          headerRight: () => (
            <View style={{display: "flex", flexDirection: "row"}}>
              <IconButton
                onPress={() => {}}
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "save",
                  color: "white"
                }}
                />
          </View>
          ),
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
      <Stack.Screen
        name="CompanyList"
        component={CompanyList}
        options={{
          headerTitle: (props) => <Heading variant="main">Companies</Heading>,
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
      <Stack.Screen
        name="CompanyAdd"
        component={CompanyAdd}
        options={{
          headerTitle: (props) => <Heading variant="main">Add a company</Heading>,
          headerRight: () => (
            <View style={{display: "flex", flexDirection: "row"}}>
              <IconButton
                onPress={() => {}}
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "save",
                  color: "white"
                }}
                />
          </View>
          ),
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
    </Stack.Navigator>
  );
}
