import React from 'react';
import { ScrollView, Button, TextArea, FormControl, Checkbox, Input, Stack  } from "native-base";

export default function MaterialAdd ( props ) {

  const {
    navigation
  } = props;

  return (
      <ScrollView margin="5">
        <FormControl>
          <FormControl.Label>Material info</FormControl.Label>
          <TextArea bgColor="white" placeholder="Write material description here"/>
        </FormControl>

        <FormControl>
            <Stack>
              <FormControl.Label>Amount</FormControl.Label>
              <Input type="number" bgColor="white" defaultValue=""/>
            </Stack>
        </FormControl>

        <FormControl>
            <Stack>
              <FormControl.Label>Price per unit</FormControl.Label>
              <Input type="number" bgColor="white" defaultValue=""/>
              <FormControl.HelperText>
                Total: 20e
              </FormControl.HelperText>
            </Stack>
        </FormControl>
      </ScrollView>
  );
}
