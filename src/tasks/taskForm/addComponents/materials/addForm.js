import React, { useState, useEffect } from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import {
    ScrollView,
    Select,
    Button,
    IconButton,
    TextArea,
    FormControl,
    Checkbox,
    Input,
    Stack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import {
    useMutation,
    useQuery,
    useApolloClient,
} from '@apollo/client';

import { ADD_MATERIAL } from '../../../../queries/materials';

import { GET_TASK } from '../../../../queries/tasks';
import { useTranslation } from 'react-i18next';

export default function MaterialAdd(props) {
    const { navigation, route } = props;

    const { taskId, addingTask, newMaterialOrder } =
        route.params;

    const { t } = useTranslation();

    const client = useApolloClient();

    const [addMaterial] = useMutation(ADD_MATERIAL);

    const [done, setDone] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [quantity, setQuantity] = React.useState('');
    const [price, setPrice] = React.useState('');

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <IconButton
                        onPress={() => {
                            if (title.length > 0) {
                                if (addingTask) {
                                    DeviceEventEmitter.emit(
                                        'event.addMaterial',
                                        {
                                            title,
                                            done,
                                            quantity,
                                            price,
                                        }
                                    );
                                    navigation.goBack();
                                } else {
                                    addMaterialFunc({
                                        title,
                                        done,
                                        quantity,
                                        price,
                                    });
                                }
                            }
                        }}
                        variant="ghost"
                        _icon={{
                            as: Ionicons,
                            name: 'save',
                            color: 'white',
                        }}
                    />
                </View>
            ),
        });
    }, [navigation, done, title, quantity, price]);

    const addMaterialFunc = (work) => {
        //  setSaving( true );

        addMaterial({
            variables: {
                title: work.title,
                done: work.done,
                quantity: isNaN(parseFloat(work.quantity))
                    ? 0
                    : parseFloat(work.quantity),
                price: isNaN(parseFloat(work.price))
                    ? 0
                    : parseFloat(work.price),
                order: newMaterialOrder,
                task: taskId,
                approved: false,
                margin: 0,
            },
        })
            .then((response) => {
                updateCasheStorage(
                    response.data.addMaterial,
                    'materials',
                    'ADD'
                );
                navigation.goBack();
                //    setSaving( false );
            })
            .catch((err) => {
                console.log(err);
                //  addLocalError( err );
                //    setSaving( false );
            });
    };

    const updateCasheStorage = (response, key, type) => {
        const task = client.readQuery({
            query: GET_TASK,
            variables: {
                id: taskId,
            },
        });

        let newTask = {
            ...task.task,
        };
        newTask[key] = [...newTask[key]];
        newTask[key].push(response);

        client.writeQuery({
            query: GET_TASK,
            variables: {
                id: taskId,
            },
            data: {
                task: newTask,
            },
        });
    };

    return (
        <ScrollView margin="5">
            <FormControl>
                <Stack>
                    <Checkbox
                        accessibilityLabel="Completed"
                        isChecked={done}
                        onChange={() => {
                            setDone(!done);
                        }}
                    >
                        {t('completed')}
                    </Checkbox>
                </Stack>
            </FormControl>

            <FormControl>
                <FormControl.Label>
                    {t('materialInfo')}
                </FormControl.Label>
                <TextArea
                    bgColor="white"
                    placeholder={t('writeMaterialDesc')}
                    value={title}
                    onChangeText={(text) => {
                        setTitle(text);
                    }}
                />
            </FormControl>

            <FormControl>
                <Stack>
                    <FormControl.Label>
                        {t('quantity')}
                    </FormControl.Label>
                    <Input
                        keyboardType="numeric"
                        bgColor="white"
                        value={quantity}
                        onChangeText={(num) => {
                            if (num[0] === '-') {
                                setQuantity(num);
                            }
                            if (
                                num.length > 0 &&
                                isNaN(num)
                            ) {
                                return;
                            }
                            setQuantity(num);
                        }}
                    />
                </Stack>
            </FormControl>

            <FormControl>
                <Stack>
                    <FormControl.Label>
                        {t('pricePerUnit')}
                    </FormControl.Label>
                    <Input
                        keyboardType="numeric"
                        bgColor="white"
                        value={price}
                        onChangeText={(num) => {
                            if (num[0] === '-') {
                                setPrice(num);
                            }
                            if (
                                num.length > 0 &&
                                isNaN(num)
                            ) {
                                return;
                            }
                            setPrice(num);
                        }}
                    />
                </Stack>
            </FormControl>
        </ScrollView>
    );
}
