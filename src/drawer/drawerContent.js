import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useMutation } from '@apollo/client';
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    IconButton,
    Pressable,
    Text,
} from 'native-base';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
    AntDesign,
    Feather,
    FontAwesome5,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons';
import DrawerContentFilters from './components/filters';
import DrawerContentProjects from './components/projects';
import localStorage from 'react-native-sync-localstorage';

import { LOGOUT_USER } from '../queries/login';
import { useTranslation } from 'react-i18next';

export default function CustomDrawerContent(props) {
    const { navigation } = props;

    const { t } = useTranslation();

    const [logoutUser] = useMutation(LOGOUT_USER);

    return (
        <DrawerContentScrollView {...props}>
            <Box bgColor="#0078d4" p="5">
                <Flex direction="row" alignItems="center">
                    <IconButton
                        onPress={(props) =>
                            navigation.toggleDrawer()
                        }
                        variant="subtle"
                        mr="5"
                        _icon={{
                            as: MaterialIcons,
                            name: 'menu',
                            color: '#0078d4',
                        }}
                    />
                    <Heading variant="main" size="md">
                        Lantask
                    </Heading>
                </Flex>
                <Heading variant="main" size="sm" mt="2">
                    {localStorage.getItem('helpdeskURL')}
                </Heading>
            </Box>

            <Box flexGrow="1" bgColor="white">
                <Box>
                    <DrawerContentProjects />

                    <Box m="5">
                        <Divider />
                    </Box>

                    <DrawerContentFilters />

                    <Box m="5">
                        <Divider />
                    </Box>
                </Box>

                <Box mb="10">
                    <Pressable
                        px="5"
                        pt="2"
                        onPress={() =>
                            navigation.navigate('TaskAdd')
                        }
                    >
                        <Flex
                            direction="row"
                            alignItems="center"
                        >
                            <Box
                                mr="2"
                                w="5"
                                alignItems="center"
                            >
                                <AntDesign
                                    name="plus"
                                    size={16}
                                    color="#0078d4"
                                />
                            </Box>
                            <Text
                                fontSize="md"
                                color="#0078d4"
                            >
                                {t('task')}
                            </Text>
                        </Flex>
                    </Pressable>

                    <Pressable
                        px="5"
                        pt="2"
                        onPress={() => {
                            logoutUser().then(() => {
                                DeviceEventEmitter.emit(
                                    'event.logOut',
                                    null
                                );
                                props.navigation.reset({
                                    index: 0,
                                    routes: [
                                        { name: 'Login' },
                                    ],
                                });
                            });
                        }}
                    >
                        <Flex
                            direction="row"
                            alignItems="center"
                        >
                            <Box
                                mr="2"
                                w="5"
                                alignItems="center"
                            >
                                <MaterialIcons
                                    name="logout"
                                    size={16}
                                    color="black"
                                />
                            </Box>
                            <Text fontSize="md">
                                {t('logout')}
                            </Text>
                        </Flex>
                    </Pressable>
                </Box>
            </Box>
        </DrawerContentScrollView>
    );
}
