import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";

import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, IconButton, Heading } from "native-base";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { FontAwesome, FontAwesome5, AntDesign  } from '@expo/vector-icons';

import Drawer from './drawer';
import Login from './login';
import TaskDetail from './tasks/taskForm/editContainer';
import CommentAdd from './tasks/taskForm/components/comments/addForm';
import SubtaskAdd from './tasks/taskForm/components/subtasks/addForm';
import SubtaskEdit from './tasks/taskForm/components/subtasks/editForm';
import MaterialAdd from './tasks/taskForm/components/materials/addForm';
import MaterialEdit from './tasks/taskForm/components/materials/editForm';
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


  console.log("isLoggedIn", data.isLoggedIn);

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
        name="Drawer"
        component={Drawer}
        options={{
          headerShown: false
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
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
      <Stack.Screen
        name="SubtaskEdit"
        component={SubtaskEdit}
        options={{
          headerTitle: (props) => <Heading variant="main">Edit a subtask</Heading>,
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
          headerStyle: {
            backgroundColor: '#0078d4',
          },
          headerTintColor: "white"
        }}
      />
      <Stack.Screen
        name="MaterialEdit"
        component={MaterialEdit}
        options={{
          headerTitle: (props) => <Heading variant="main">Edit a material</Heading>,
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
