import React from 'react';
import { ScrollView, Button, TextArea, FormControl, Checkbox, Input, Stack  } from "native-base";

export default function SubtaskAdd ( props ) {

  const {
    navigation
  } = props;

  return (
      <ScrollView margin="5">
        <FormControl>
            <Stack>
              <Checkbox
                accessibilityLabel="Completed"
                defaultIsChecked
                >
                Completed
              </Checkbox>
          </Stack>
        </FormControl>

        <FormControl>
          <FormControl.Label>Subtask info</FormControl.Label>
          <TextArea bgColor="white" placeholder="Write subtask description here"/>
        </FormControl>

        <FormControl>
            <Stack>
              <FormControl.Label>Amount</FormControl.Label>
              <Input type="number" bgColor="white" defaultValue=""/>
            </Stack>
        </FormControl>


        <FormControl>
            <Stack>
              <FormControl.Label>Assigned user</FormControl.Label>
              <Input type="text" bgColor="white" defaultValue=""/>
            </Stack>
        </FormControl>
      </ScrollView>
  );
}
