import React from 'react';
import { Heading, IconButton, View } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import {
    FontAwesome,
    FontAwesome5,
    MaterialIcons,
} from '@expo/vector-icons';

import Calendar from '../tasks/calendar';
import CustomDrawerContent from './drawerContent';

const Drawer = createDrawerNavigator();

export default function MyDrawer(props) {
    return (
        <Drawer.Navigator
            useLegacyImplementation
            drawerContent={(props) => (
                <CustomDrawerContent {...props} />
            )}
            screenOptions={{
                drawerStyle: {
                    backgroundColor: '#0078d4',
                },
            }}
        >
            <Drawer.Screen
                name="List"
                component={Calendar}
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <IconButton
                            onPress={(props) =>
                                navigation.toggleDrawer()
                            }
                            variant="ghost"
                            pl="5"
                            size="lg"
                            _icon={{
                                as: MaterialIcons,
                                name: 'menu',
                                color: 'white',
                            }}
                        />
                    ),
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
