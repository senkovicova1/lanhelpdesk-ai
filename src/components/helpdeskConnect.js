import React from 'react';
import {
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
        helpdeskURL,
        setHelpdeskURL,
        port,
        setPort,
        connectToHelpdesk,
    } = props;
    const { t } = useTranslation();

    const [error, setError] = React.useState(null);

    async function check() {
        let result = null;
        try {
            let res = await axios.get(
                `http://${helpdeskURL}:${port}`
            );
            result = res.status;
            // Work with the response...
        } catch (err) {
            console.log(err);
            if (err.response) {
                // The client was given an error response (5xx, 4xx)
            } else if (err.request) {
                // The client never received a response, and the request was never left
            } else {
                // Anything else
            }
        }
        if (result) {
            connectToHelpdesk();
        } else {
            setError('Incorrect URL or port');
        }
    }

    return (
        <Center height={'100%'} width={'100%'}>
            <FormControl isRequired>
                <Stack mx="4">
                    <FormControl.Label>
                        LanHelpdesk URL
                    </FormControl.Label>
                    <Input
                        type="text"
                        defaultValue=""
                        value={helpdeskURL}
                        placeholder="company.lanhelpdesk.com"
                        onChangeText={(text) => {
                            setHelpdeskURL(text);
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

            <FormControl
                isDisabled={
                    port.length === 0 ||
                    helpdeskURL.length === 0
                }
            >
                <Stack mx="4">
                    <Button
                        shadow={2}
                        onPress={() => {
                            const regexHelpdesk =
                                /[a-z0-9]\.helpdesk\.com$/;
                            const regexPort = /^\d{4}$/;
                            /*  if (
                                !regexHelpdesk.test(
                                    helpdeskURL
                                )
                            ) {
                                setError('Wrong url');
                            }*/
                            if (!regexPort.test(port)) {
                                setError('Wrong port');
                            }
                            if (
                                /*  regexHelpdesk.test(
                                    helpdeskURL
                                ) &&*/
                                regexPort.test(port)
                            ) {
                                check();
                            }
                        }}
                    >
                        {t('Connect')}
                    </Button>
                    <FormControl.ErrorMessage
                        leftIcon={
                            <WarningOutlineIcon size="xs" />
                        }
                    >
                        {error ? error : 'AAA'}
                    </FormControl.ErrorMessage>
                </Stack>
            </FormControl>
        </Center>
    );
}
