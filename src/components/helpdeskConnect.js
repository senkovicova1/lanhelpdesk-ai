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

    async function check() {
        try {
            await fetch(
                `https://${helpdeskPrefix}.lantask.eu:${responsePort}`
            );
            connectToHelpdesk();
        } catch (e) {
            setError(`Incorrect URL or port`);
        }
    }

    return (
        <Center height={'100%'} width={'100%'}>
            <FormControl isRequired>
                <Stack mx="4">
                    <FormControl.Label>
                        Lantask Prefix
                    </FormControl.Label>
                    <Input
                        type="text"
                        defaultValue=""
                        value={helpdeskPrefix}
                        placeholder=""
                        onChangeText={(text) => {
                            setHelpdeskPrefix(text);
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

            <Text>{error}</Text>

            <FormControl
                isDisabled={helpdeskPrefix.length === 0}
            >
                <Stack mx="4">
                    <Button
                        shadow={2}
                        onPress={() => {
                            const regexHelpdesk =
                                /[a-z0-9]\.lantask\.eu$/;
                            if (
                                !regexHelpdesk.test(
                                    helpdeskPrefix +
                                        '.lantask.eu'
                                )
                            ) {
                                setError('Wrong url');
                            }
                            if (
                                regexHelpdesk.test(
                                    helpdeskPrefix +
                                        '.lantask.eu'
                                )
                            ) {
                                check();
                            }
                        }}
                    >
                        {t('Connect')}
                    </Button>
                </Stack>
            </FormControl>
        </Center>
    );
}
