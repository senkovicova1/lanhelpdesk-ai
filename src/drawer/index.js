import React from 'react';
import {
  Heading,
  IconButton,
  View
} from "native-base";
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {
  DrawerActions
} from '@react-navigation/native';
import {
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';

import Settings from '../settings';
import List from '../tasks/list';
import Calendar from '../tasks/calendar';
import CustomDrawerContent from './drawerContent';

const Drawer = createDrawerNavigator();

export default function MyDrawer(props) {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#0078d4',
        },
      }}
      >
      <Drawer.Screen
        name="List"
        component={List}
        options={({navigation}) => ({
          headerTitle: (props) => (
          <Heading variant="main">List</Heading>
        ),
        headerRight: () => (
          <View style={{display: "flex", flexDirection: "row"}}>
            <IconButton
              onPress={() => navigation.navigate('Calendar')}
              variant="ghost"
              _icon={{
                as: FontAwesome5 ,
                name: "calendar-alt",
                color: "white"
              }}
              />
            <IconButton
              onPress={() => alert('This is a button!')}
              variant="ghost"
              pr="5"
              _icon={{
                as: FontAwesome,
                name: "search",
                color: "white"
              }}
            />
        </View>
        ),
        headerLeft: () => <IconButton
          onPress={(props) => navigation.toggleDrawer()}
          variant="ghost"
          pl="5"
          size="lg"
          _icon={{
            as: MaterialIcons,
            name: "menu",
            color: "white",
          }}
        />,
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#0078d4',
        },
      })}
      />
      <Drawer.Screen
        name="Calendar"
        component={Calendar}
        options={({navigation}) => ({
          headerTitle: (props) => (
          <Heading variant="main">Calendar</Heading>
        ),
        headerRight: () => (
          <View style={{display: "flex", flexDirection: "row"}}>
            <IconButton
              onPress={() => navigation.navigate('List')}
              variant="ghost"
              _icon={{
                as: FontAwesome5 ,
                name: "list-ul",
                color: "white"
              }}
              />
            <IconButton
              onPress={() => alert('This is a button!')}
              variant="ghost"
              pr="5"
              _icon={{
                as: FontAwesome,
                name: "search",
                color: "white"
              }}
            />
        </View>
        ),
        headerLeft: () => <IconButton
          onPress={(props) => navigation.toggleDrawer()}
          variant="ghost"
          pl="5"
          size="lg"
          _icon={{
            as: MaterialIcons,
            name: "menu",
            color: "white"
          }}
        />,
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#0078d4',
        },
      })}
        />
    </Drawer.Navigator>
  );
}
