import React from 'react';
import { Center, Button, Checkbox, Input, Icon, FormControl, Stack, WarningOutlineIcon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';

import {
  useMutation,
} from "@apollo/client";
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

      <FormControl>
          <Stack mx="4">
            <Button
              shadow={2}
              onPress={() => {
                navigation.navigate('List');
              }}
              >
              Login
            </Button>
          </Stack>
      </FormControl>
    </Center>
  );
}
