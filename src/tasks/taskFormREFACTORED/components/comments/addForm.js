import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Button,
  IconButton,
  TextArea,
  FormControl,
  Stack
} from "native-base";
import { Ionicons  } from '@expo/vector-icons';
import axios from 'react-native-axios';

import localStorage from 'react-native-sync-localstorage';

import {
  REST_URL,
} from '../../../../configs/restAPI';

export default function CommentAdd ( props ) {

  const {
    navigation,
    route,
  } = props;

  const {
    taskId,
  } = route.params;

  const [ body, setBody ] = useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{display: "flex", flexDirection: "row"}}>
          <IconButton
            onPress={() => {
              // TODO: add error if body empty
              submitComment(body);
              navigation.goBack();
            }}
            variant="ghost"
            _icon={{
              as: Ionicons ,
              name: "save",
              color: "white"
            }}
          />
      </View>
      ),
    });
  }, [taskId, navigation, body]);

  const convertToReactComponent = (text) => {
    /// TODO: convertToReactComponent
    return `<p>${text}</p>`;
  }

  const submitComment = (message) => {
    const formData = new FormData();
    //attachments.forEach( ( file ) => formData.append( `file`, file ) );
    //FORM DATA
    formData.append( "token", `Bearer ${localStorage.getItem('acctok')}` );
    formData.append( "taskId", taskId );
    formData.append( "message", convertToReactComponent(message) );
    formData.append( "parentCommentId", null );
    formData.append( "internal", false );
    formData.append( "fromInvoice", false );
    axios.post( `${REST_URL}/send-comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      } )
      .then( ( response ) => {
        if ( response.data.ok ) {
          //setAttachments( [] );
          setBody( `<br>${currentUser.signature.replace(/(?:\r\n|\r|\n)/g, '<br>')}` );
          navigation.goBack();
        /*  commentsRefetch( {
              task: taskId,
              page: 1,
              limit: 5,
            } );*/
        } else {
        /*  addLocalError( {
            message: response.data.error,
            name: 'Task e-mail error',
          } );*/
        }
    //    setSaving( false );
      } )
      .catch( ( err ) => {
      //  setSaving( false );
      //  addLocalError( err );
      } );
  }

  return (
    <ScrollView margin="5">
      <FormControl>
          <TextArea
            bgColor="white"
            placeholder="Write your comment here"
            value={body}
            onChangeText={(text) => {
              setBody(text)
            }}
          />
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
