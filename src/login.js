import React from 'react';
import { Center, Button, Checkbox, Input, Icon, FormControl, Stack, WarningOutlineIcon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';

export default function Login ( props ) {

  const {
    navigation
  } = props;

  const [show, setShow] = React.useState(false);

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
            <Input type="text" defaultValue=""/>
          </Stack>
      </FormControl>

        <FormControl isRequired>
            <Stack mx="4">
              <FormControl.Label>Password</FormControl.Label>
                <Input
                  type={show ? "text" : "password"}
                  style={{width: "100%"}}
                  InputRightElement={
                    <Icon
                      as={
                        <MaterialIcons
                          name={show ? "visibility" : "visibility-off"}
                          />
                      }
                      size={5}
                      mr="2"
                      color="muted.400"
                      onPress={() => setShow(!show)}
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
