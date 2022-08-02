import React from 'react';
import { ScrollView, Button, TextArea, FormControl, Stack  } from "native-base";

export default function CommentAdd ( props ) {

  const {
    navigation
  } = props;

  return (
    <ScrollView margin="5">
      <FormControl>
            <TextArea bgColor="white" placeholder="Write your comment here"/>
      </FormControl>

      <FormControl>
          <Stack>
            <Button
              variant="ghost"
              m="0"
              p="0"
              justifyContent="flex-start"
              onPress={() => {}}
              >
              + Attachment
            </Button>
          </Stack>
      </FormControl>
    </ScrollView>
  );
}
