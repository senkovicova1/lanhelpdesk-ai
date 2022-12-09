import React from 'react';
import { useQuery, useSubscription } from '@apollo/client';

import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Heading } from 'native-base';

import Drawer from '../drawer';
import Login from './login';
import TaskDetail from '../tasks/taskForm/edit';
import TaskAdd from '../tasks/taskForm/add';
import CommentAdd from '../tasks/taskForm/components/comments/addForm';
import TaskAddSubtaskAdd from '../tasks/taskForm/addComponents/subtasks/addForm';
import TaskAddSubtaskEdit from '../tasks/taskForm/addComponents/subtasks/editForm';
import TaskAddMaterialAdd from '../tasks/taskForm/addComponents/materials/addForm';
import TaskAddMaterialEdit from '../tasks/taskForm/addComponents/materials/editForm';
import TaskEditSubtaskAdd from '../tasks/taskForm/components/subtasks/addForm';
import TaskEditSubtaskEdit from '../tasks/taskForm/components/subtasks/editForm';
import TaskEditMaterialAdd from '../tasks/taskForm/components/materials/addForm';
import TaskEditMaterialEdit from '../tasks/taskForm/components/materials/editForm';

import i18n from 'i18next';
import { getMyData } from '../helperFunctions';

import { GET_IS_LOGGED_IN } from '../apollo_copy/localSchema/queries';

import {
    GET_MY_DATA,
    USER_DATA_SUBSCRIPTION,
} from '../apollo_copy/globalQueries';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

export default function Navigation(props) {
    const { t } = useTranslation();

    const { data } = useQuery(GET_IS_LOGGED_IN);

    const {
        data: userDataData,
        loading: userDataLoading,
        refetch: userDataRefetch,
    } = useQuery(GET_MY_DATA, {
        fetchPolicy: 'network-only',
    });

    useSubscription(USER_DATA_SUBSCRIPTION, {
        onSubscriptionData: () => {
            userDataRefetch();
        },
    });

    const currentUser = getMyData();
    React.useEffect(() => {
        if (currentUser) {
            i18n.changeLanguage(currentUser.language);
            console.log(currentUser.language);
        }
    }, [
        currentUser,
        currentUser ? currentUser.language : null,
    ]);

    console.log('isLoggedIn', data.isLoggedIn);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            LanHelpdesk
                        </Heading>
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
                    headerShown: false,
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
                    headerTintColor: 'white',
                }}
            />

            <Stack.Screen
                name="TaskAdd"
                component={TaskAdd}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('addTask')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen
                name="CommentAdd"
                component={CommentAdd}
                options={({ navigation }) => ({
                    headerTitle: (props) => (
                        <Heading variant="main" ml="0">
                            {t('addComment')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                        margin: '0px !important',
                    },
                    headerTintColor: 'white',
                    headerTitleContainerStyle: {
                        backgroundColor: '#006581',
                        margin: '0px !important',
                    },
                    headerTitleStyle: {
                        backgroundColor: '#aa58f0',
                        margin: '0px !important',
                    },
                })}
            />
            <Stack.Screen
                name="TaskAddSubtaskAdd"
                component={TaskAddSubtaskAdd}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('addSubtask')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen
                name="TaskAddSubtaskEdit"
                component={TaskAddSubtaskEdit}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('editSubtask')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen
                name="TaskAddMaterialAdd"
                component={TaskAddMaterialAdd}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('addMaterial')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen
                name="TaskAddMaterialEdit"
                component={TaskAddMaterialEdit}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('editMaterial')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />

            <Stack.Screen
                name="TaskEditSubtaskAdd"
                component={TaskEditSubtaskAdd}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('addSubtask')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen
                name="TaskEditSubtaskEdit"
                component={TaskEditSubtaskEdit}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('editSubtask')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen
                name="TaskEditMaterialAdd"
                component={TaskEditMaterialAdd}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('addMaterial')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen
                name="TaskEditMaterialEdit"
                component={TaskEditMaterialEdit}
                options={{
                    headerTitle: (props) => (
                        <Heading variant="main">
                            {t('editMaterial')}
                        </Heading>
                    ),
                    headerStyle: {
                        backgroundColor: '#0078d4',
                    },
                    headerTintColor: 'white',
                }}
            />
        </Stack.Navigator>
    );
}
