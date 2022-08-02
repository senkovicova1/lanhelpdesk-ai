import React from 'react';
import { ScrollView, Button, TextArea, FormControl, Checkbox, Input, Stack  } from "native-base";

export default function CompanyAdd ( props ) {

  const {
    navigation
  } = props;

  return (
      <ScrollView margin="5">
        <FormControl>
          <FormControl.Label>Company name</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>Tax</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>ICO</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>DIC</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>IC DPH</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>Counrty</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>City</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
          <FormControl.Label>Street</FormControl.Label>
          <Input type="text" bgColor="white" defaultValue=""/>
        </FormControl>

        <FormControl>
            <Stack>
              <Button
                shadow={2}
                onPress={() => {}}
                >
                Delete company
              </Button>
            </Stack>
        </FormControl>
      </ScrollView>
  );
}
