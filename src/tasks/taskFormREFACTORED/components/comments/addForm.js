import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Button,
  IconButton,
  TextArea,
  FormControl,
  Stack,
  WarningOutlineIcon
} from "native-base";
import { Ionicons  } from '@expo/vector-icons';
import axios from 'react-native-axios';

import localStorage from 'react-native-sync-localstorage';

import {
  REST_URL,
} from '../../../../configs/restAPI';
import {
  useTranslation
} from "react-i18next";

export default function CommentAdd ( props ) {

  const {
    navigation,
    route,
  } = props;

  const {
    taskId,
  } = route.params;

  const {
    t
  } = useTranslation();

  const [ body, setBody ] = useState("");
  const [ showError, setShowError ] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{display: "flex", flexDirection: "row"}}>
          <IconButton
            onPress={() => {
              if (body.length === 0){
                setShowError(true);
              } else {
                submitComment(body);
                navigation.goBack();
              }
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

  const submitComment = (message) => {
    const formData = new FormData();
    //attachments.forEach( ( file ) => formData.append( `file`, file ) );
    //FORM DATA
    formData.append( "token", `Bearer ${localStorage.getItem('acctok')}` );
    formData.append( "taskId", taskId );
    formData.append( "message", `<p>${message}</p>` );
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
          setShowError(false);
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
            placeholder={t('writeComment')}
            value={body}
            onChangeText={(text) => {
              setBody(text)
            }}
          />
          {
            showError &&
            body.length === 0 &&
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {t('commentCantBeEmpty')}
            </FormControl.ErrorMessage>
          }
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
            {t('plusAttachments')}
          </Button>
        </Stack>
      </FormControl>
    </ScrollView>
  );
}
