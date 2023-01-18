import React from 'react';
import {
    Center,
    Button,
    Checkbox,
    Input,
    Icon,
    FormControl,
    Stack,
    WarningOutlineIcon,
    Text,
} from 'native-base';
import { DeviceEventEmitter } from 'react-native';
import {
    MaterialIcons,
    Ionicons,
} from '@expo/vector-icons';

import localStorage from 'react-native-sync-localstorage';

import { useMutation, useQuery } from '@apollo/client';
import {
    setIsLoggedIn,
    // setTestedToken,
} from '../apollo_copy/localSchema/actions'; /*
import refreshToken from '../apollo_copy/refreshToken';
import { GET_TESTED_TOKEN } from '../apollo_copy/localSchema/queries';*/
import { LOGIN_USER } from '../queries/login';
import { useTranslation } from 'react-i18next';

export default function Login(props) {
    const { navigation } = props;

    const { t } = useTranslation();

    const [loginUser] = useMutation(LOGIN_USER);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] =
        React.useState(false);
    const [signingIn, setSigningIn] = React.useState(false);
    const [error, setError] = React.useState(null);
    /*
    const {
        data: testedTokenData,
        loading: testedTokenLoading,
    } = useQuery(GET_TESTED_TOKEN);
*/
    const login = () => {
        setSigningIn(true);
        setError(null);

        loginUser({
            variables: {
                email: email.trim(),
                password,
            },
        })
            .then((response) => {
                setSigningIn(false);
                setError(null);
                localStorage.setItem(
                    'acctok',
                    response.data.loginUser.accessToken
                );
                setIsLoggedIn(true);
                navigation.navigate('Drawer');
            })
            .catch((err) => {
                console.log(err);
                setSigningIn(false);
                setError(err.message);
            });
    };
    /*
    React.useEffect(() => {
         if (!testedTokenData.testedToken) {
            setTestedToken(true);
            tryLogin();
        }
    }, [testedTokenLoading, testedTokenData.testedToken]);*/
    /*
    const tryLogin = () => {
        setSigningIn(true);

        refreshToken()
            .then((response) => {
                const { ok, accessToken } = response.data;
                if (ok) {
                    localStorage.setItem(
                        'acctok',
                        accessToken
                    );
                    setIsLoggedIn(true);
                    setSigningIn(false);
                    navigation.navigate('Drawer');
                } else {
                    localStorage.removeItem('acctok');
                    setIsLoggedIn(false);
                    setSigningIn(false);
                }
            })
            .catch((error) => {
                setIsLoggedIn(false);
                setSigningIn(false);
                setError(err.message);
            });
    };
*/
    return (
        <Center height={'100%'} width={'100%'}>
            <FormControl
                isDisabled={
                    signingIn ||
                    email.length === 0 ||
                    password.length === 0
                }
            >
                <Stack mx="4">
                    <Button
                        variant="ghost"
                        onPress={() => {
                            DeviceEventEmitter.emit(
                                'event.logOut',
                                null
                            );
                        }}
                        leftIcon={
                            <Icon
                                as={Ionicons}
                                name="arrow-back"
                                size="sm"
                            />
                        }
                    >
                        {t('return')}
                    </Button>
                </Stack>
            </FormControl>

            <FormControl isRequired>
                <Stack mx="4">
                    <FormControl.Label>
                        {t('username')}
                    </FormControl.Label>
                    <Input
                        type="text"
                        value={email}
                        placeholder={t('username')}
                        onChangeText={(text) => {
                            setEmail(text);
                            setError(null);
                        }}
                    />
                </Stack>
            </FormControl>

            <FormControl isRequired>
                <Stack mx="4">
                    <FormControl.Label>
                        {t('password')}
                    </FormControl.Label>
                    <Input
                        type={
                            showPassword
                                ? 'text'
                                : 'password'
                        }
                        style={{ width: '100%' }}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setError(null);
                        }}
                        InputRightElement={
                            <Icon
                                as={
                                    <MaterialIcons
                                        name={
                                            showPassword
                                                ? 'visibility'
                                                : 'visibility-off'
                                        }
                                    />
                                }
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            />
                        }
                        placeholder={t('password')}
                    />
                    <FormControl.HelperText>
                        {t('atLeast6Char')}
                    </FormControl.HelperText>
                    <FormControl.ErrorMessage
                        leftIcon={
                            <WarningOutlineIcon size="xs" />
                        }
                    >
                        {t('atLeast6CharReq')}
                    </FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <Text>{error}</Text>

            <FormControl
                isDisabled={
                    signingIn ||
                    email.length === 0 ||
                    password.length === 0
                }
            >
                <Stack mx="4">
                    <Button
                        shadow={2}
                        onPress={() => {
                            login();
                        }}
                    >
                        {t('login')}
                    </Button>
                </Stack>
            </FormControl>
        </Center>
    );
}
