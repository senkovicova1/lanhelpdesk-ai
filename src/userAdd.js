import React from 'react';
import { ScrollView, Button, TextArea, FormControl, Checkbox, Input, Stack  } from "native-base";

export default function UserAdd ( props ) {

  const {
    navigation
  } = props;

  return (
      <ScrollView margin="5">
        <FormControl>
          <FormControl.Label>Role</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>Username</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>Surname</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>Password</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
            <Stack>
              <Button
                shadow={2}
                onPress={() => {}}
                >
                Delete user
              </Button>
            </Stack>
        </FormControl>

        <FormControl>
            <Stack>
              <Button
                shadow={2}
                onPress={() => {}}
                >
                Reset password
              </Button>
            </Stack>
        </FormControl>
      </ScrollView>
  );
}
