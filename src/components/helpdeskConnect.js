import React from 'react';
import {
    Text,
    Center,
    Button,
    Input,
    FormControl,
    Stack,
    WarningOutlineIcon,
} from 'native-base';
import { useTranslation } from 'react-i18next';
import axios from 'react-native-axios';

export default function HelpdeskConnect(props) {
    const {
        helpdeskPrefix,
        setHelpdeskPrefix,
        port,
        setPort,
        connectToHelpdesk,
    } = props;
    const { t } = useTranslation();

    const [error, setError] = React.useState(null);

    async function check() {
        /*  const URL =
            helpdeskPrefix === 'localhost'
                ? `http://192.168.1.13:${port}`
                : `https://${helpdeskPrefix}.lantask.eu:${port}`;
        */

        // druha https na testovanie https://nodejs02.lanhelpdesk.com:8080/
        //'http://nodejs02.lanhelpdesk.com:8099/'
        // https://dummyjson.com/products/1
        /*
        fetch(URL, {
            method: 'GET',
            mode: 'no-cors',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => {
                console.log(Object.keys(response));

                Object.keys(response).map((key) =>
                    console.log(response[key])
                );
                //     connectToHelpdesk();
            })
            .catch((error) => {
                console.log(error);
                setError('Incorrect URL or port');
            });
            */

        connectToHelpdesk();
    }

    return (
        <Center height={'100%'} width={'100%'}>
            <FormControl isRequired>
                <Stack mx="4">
                    <FormControl.Label>
                        Lantask prefix
                    </FormControl.Label>
                    <Input
                        type="text"
                        defaultValue=""
                        value={helpdeskPrefix}
                        placeholder="My company"
                        onChangeText={(text) => {
                            setHelpdeskPrefix(text);
                            setError(null);
                        }}
                    />
                    <FormControl.ErrorMessage
                        leftIcon={
                            <WarningOutlineIcon size="xs" />
                        }
                    >
                        {t('itemRequired')}
                    </FormControl.ErrorMessage>
                </Stack>
            </FormControl>

            <FormControl isRequired>
                <Stack mx="4">
                    <FormControl.Label>
                        Port
                    </FormControl.Label>
                    <Input
                        keyboard="numeric"
                        value={port}
                        placeholder={'0000'}
                        onChangeText={(text) => {
                            setPort(text);
                            setError(null);
                        }}
                    />
                    <FormControl.ErrorMessage
                        leftIcon={
                            <WarningOutlineIcon size="xs" />
                        }
                    >
                        {t('itemRequired')}
                    </FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <Text>{error}</Text>

            <FormControl
                isDisabled={
                    port.length === 0 ||
                    helpdeskPrefix.length === 0
                }
            >
                <Stack mx="4">
                    <Button
                        shadow={2}
                        onPress={() => {
                            /* const regexHelpdesk =
                                /[a-z0-9]\.lantask\.eu$/;
                            const regexPort = /^\d{4}$/;
                            if (
                                helpdeskPrefix !==
                                    'localhost' &&
                                !regexHelpdesk.test(
                                    `${helpdeskPrefix}.lantask.eu`
                                )
                            ) {
                                setError('Wrong prefix');
                            }
                            if (!regexPort.test(port)) {
                                setError('Wrong port');
                            }
                            if (
                                (helpdeskPrefix ===
                                    'localhost' ||
                                    regexHelpdesk.test(
                                        `${helpdeskPrefix}.lantask.eu`
                                    )) &&
                                regexPort.test(port)
                            ) {
                                check();
                            }*/
                            check();
                        }}
                    >
                        {t('Connect')}
                    </Button>
                </Stack>
            </FormControl>
        </Center>
    );
}
