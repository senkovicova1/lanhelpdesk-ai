import React from 'react';
import { Center, Button, Checkbox, Input, Icon, FormControl, Stack, WarningOutlineIcon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';

import localStorage from 'react-native-sync-localstorage';

import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  setIsLoggedIn,
  setTestedToken,
} from './apollo/localSchema/actions';
import refreshToken from './apollo/refreshToken';
import {
  GET_TESTED_TOKEN,
} from './apollo/localSchema/queries';
import {
  LOGIN_USER
} from './queries/login';


export default function Login ( props ) {

  const {
    navigation
  } = props;

  const [ loginUser ] = useMutation( LOGIN_USER );

  const [ email, setEmail ] = React.useState( '' );
  const [ password, setPassword ] = React.useState( '' );
  const [ showPassword, setShowPassword ] = React.useState(false);
  const [ signingIn, setSigningIn ] = React.useState( false );
  const [ error, setError ] = React.useState( null );

  const {
    data: testedTokenData,
    loading: testedTokenLoading
  } = useQuery( GET_TESTED_TOKEN );

  const login = () => {
    setSigningIn( true );
    setError( null );
    console.log("login");

    loginUser( {
        variables: {
          email,
          password
        }
      } )
      .then( ( response ) => {
        setSigningIn( false );
        console.log(localStorage);
        localStorage.setItem( "acctok", response.data.loginUser.accessToken );
        setIsLoggedIn( true );
        navigation.navigate('Drawer');
      } )
      .catch( ( err ) => {
        setSigningIn( false );
        setError( err.message );
        console.log("FAILED");
        console.log(err);
        console.log(err.message);
    } );
  }

  React.useEffect( () => {
    if ( !testedTokenData.testedToken ) {
      setTestedToken( true )
      tryLogin();
    }
  }, [ testedTokenLoading, testedTokenData.testedToken ] );

  const tryLogin = () => {
    setSigningIn( true );
    refreshToken()
      .then( ( response ) => {
        const {
          ok,
          accessToken
        } = response.data;
        if ( ok ) {
          localStorage.setItem( "acctok", accessToken );
          setIsLoggedIn( true )
          setSigningIn( false );
          navigation.navigate('Drawer');
        } else {
          localStorage.removeItem( "acctok" );
          setIsLoggedIn( false );
          setSigningIn( false );
        }
      } )
      .catch( ( error ) => {
        setIsLoggedIn( false );
        setSigningIn( false );
      } )
  }

  return (
    <Center
      height={"100%"}
      width={"100%"}
    >
      <FormControl isRequired>
          <Stack mx="4">
            <FormControl.Label>LanHelpdesk URL</FormControl.Label>
            <Input type="text" defaultValue=""/>
          </Stack>
      </FormControl>

      <FormControl isRequired>
          <Stack mx="4">
            <FormControl.Label>Login</FormControl.Label>
            <Input
              type="text"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
              }}
            />
          </Stack>
      </FormControl>

        <FormControl isRequired>
            <Stack mx="4">
              <FormControl.Label>Password</FormControl.Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  style={{width: "100%"}}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text)
                  }}
                  InputRightElement={
                    <Icon
                      as={
                        <MaterialIcons
                          name={showPassword ? "visibility" : "visibility-off"}
                          />
                      }
                      size={5}
                      mr="2"
                      color="muted.400"
                      onPress={() => setShowPassword(!showPassword)}
                      />
                  }
                  placeholder="Password"
                />
              <FormControl.HelperText>
                Must be atleast 6 characters.
              </FormControl.HelperText>
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Atleast 6 characters are required.
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>

      <FormControl isRequired>
          <Stack mx="4">
            <Checkbox
              accessibilityLabel="Enable autologin?"
              defaultIsChecked
              >
              Autologin
            </Checkbox>
        </Stack>
      </FormControl>

      <FormControl
        isDisabled={ signingIn || email.length === 0 || password.length === 0 }
      >
          <Stack mx="4">
            <Button
              shadow={2}
              onPress={() => {
                login();
              }}
              >
              Login
            </Button>
          </Stack>
      </FormControl>
    </Center>
  );
}
