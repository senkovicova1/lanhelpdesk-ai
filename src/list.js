import React, { useState } from 'react';
import { ScrollView, Pressable, Divider, IconButton, Heading, Text, Flex, Box, View, Button } from "native-base";
//https://www.npmjs.com/package/react-native-calendars
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { FontAwesome, FontAwesome5, AntDesign, MaterialIcons, Ionicons, Feather, MaterialCommunityIcons  } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

import Settings from './settings';

function CustomDrawerContent(props) {

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

      <Box>
        <Flex direction="row" alignItems="center" mt="5" mx="5">
          <AntDesign name="folder1" size={16} color="black"/>
          <Heading variant="list" size="md" ml="2">Project</Heading>
        </Flex>

        <Text mx="5" pt="2" fontSize="md">All projects</Text>

        <Box m="5">
          <Divider/>
        </Box>

        <Flex direction="row" alignItems="center"  mx="5">
          <AntDesign name="filter" size={16} color="black" />
          <Heading variant="list" size="md" ml="2">Filter</Heading>
        </Flex>

        <Box bgColor="#dae5ee" px="5" mt="2"><Text fontSize="md">My tasks</Text></Box>
        <Box px="5" mt="2"><Text fontSize="md">Assigned tasks</Text></Box>
        <Box px="5" mt="2"><Text fontSize="md">Repeated tasks</Text></Box>
        <Box px="5" mt="2"><Text fontSize="md">All tasks</Text></Box>

        <Box m="5">
          <Divider/>
        </Box>

      </Box>

      <Box>
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

        <Button variant="ghost" px="5" pt="2" width="fit-content" onPress={() => {}}>
          <Flex direction="row" alignItems="center">
            <Box mr="2" w="5" alignItems="center">
              <AntDesign name="plus" size={16} color="#0078d4"/>
            </Box>
            <Text fontSize="md" color="#0078d4">Konto</Text>
          </Flex>
        </Button>

      </Box>

    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
export default function MyDrawer(props) {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
              onPress={() => navigation.navigate('CalendarView')}
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
          marginLeft: "10px"
        },
      })}
      />
      <Drawer.Screen
        name="CalendarView"
        component={CalendarView}
        options={({navigation}) => ({
          headerTitle: (props) => (
          <Heading variant="main">Calendar view</Heading>
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
          marginLeft: "10px"
        },
      })}
        />
    </Drawer.Navigator>
  );
}

function List ( props ) {
  const {
    navigation
  } = props;

  return (
    <ScrollView>
      <Pressable
        onPress={() => navigation.navigate('TaskDetail')}
        margin="5"
        marginBottom="0"
        >
        <Flex direction="row" justify="space-between">
        <Box>
          <Heading variant="list" size="md">Item title</Heading>
          <Text>Item attribute</Text>
        </Box>
        <Box>
          <Text>Item attribute</Text>
          <Text>Item attribute</Text>
        </Box>
      </Flex>
        <Divider mt="5"/>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('TaskDetail')}
        margin="5"
        marginBottom="0"
        >
        <Flex direction="row" justify="space-between">
        <Box>
          <Heading variant="list" size="md">Item title</Heading>
          <Text>Item attribute</Text>
        </Box>
        <Box>
          <Text>Item attribute</Text>
          <Text>Item attribute</Text>
        </Box>
      </Flex>
        <Divider mt="5"/>
      </Pressable>

    </ScrollView>
  );
}

function CalendarView ( props ) {
  const {
    navigation
  } = props;

  const [ markedDates, setMarkedDays ] = useState({});

  return (
    <ScrollView>

      <Calendar
        markedDates={markedDates}
        onDayPress={day => {
          // Handler which gets executed on day press. Default = undefined
        //  console.log('selected day', day);
          let newMarkedDates = {};
          newMarkedDates[day.dateString] = {selected: true, marked: true, selectedColor: '#dae5ee'};

          setMarkedDays(newMarkedDates);
        }}
        onDayLongPress={day => {
          // Handler which gets executed on day long press. Default = undefined
          console.log('selected day', day);
        }}
        monthFormat={'MMMM yyyy'}
        onMonthChange={month => {
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          console.log('month changed', month);
        }}
        firstDay={1}
        showWeekNumbers={true}
        onPressArrowLeft={(subtractMonth) => {
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          // subtractMonth()
        }}
        onPressArrowRight={(addMonth) => {
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          // addMonth()
        }}
        enableSwipeMonths={true}
      />

      <Pressable
        onPress={() => navigation.navigate('TaskDetail')}
        margin="5"
        marginBottom="0"
        >
        <Flex direction="row" justify="space-between">
        <Box>
          <Heading variant="list" size="md">Item title</Heading>
          <Text>Item attribute</Text>
        </Box>
        <Box>
          <Text>Item attribute</Text>
          <Text>Item attribute</Text>
        </Box>
      </Flex>
        <Divider mt="5"/>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('TaskDetail')}
        margin="5"
        marginBottom="0"
        >
        <Flex direction="row" justify="space-between">
        <Box>
          <Heading variant="list" size="md">Item title</Heading>
          <Text>Item attribute</Text>
        </Box>
        <Box>
          <Text>Item attribute</Text>
          <Text>Item attribute</Text>
        </Box>
      </Flex>
        <Divider mt="5"/>
      </Pressable>

    </ScrollView>
  );
}
