import React, {
  useState
} from 'react';
import {
  DeviceEventEmitter
} from 'react-native';
import {
  ScrollView,
  View,
  Button,
  IconButton,
  TextArea,
  FormControl,
  Stack,
  WarningOutlineIcon,
  Flex,
} from "native-base";
import {
  useApolloClient,
} from "@apollo/client";
import {
  Ionicons
} from '@expo/vector-icons';
import axios from 'react-native-axios';
import * as DocumentPicker from 'expo-document-picker';
import {
  getMyData,
} from '../../../../helperFunctions/userData';

import moment from 'moment';
import localStorage from 'react-native-sync-localstorage';

import {
  REST_URL,
} from '../../../../configs/restAPI';

import {
  GET_COMMENTS,
} from '../../../../queries/comments';

import {
  useTranslation
} from "react-i18next";

let fakeID = -1;

export default function CommentAdd(props) {

  const {
    navigation,
    route,
  } = props;

  const {
    taskId,
  } = route.params;

  const currentUser = getMyData();

  const {
    t
  } = useTranslation();

  const client = useApolloClient();

  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showError, setShowError] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ display: "flex", flexDirection: "row" }}>
          <IconButton
            onPress={() => {
              if (body.length === 0) {
                setShowError(true);
              } else {
                //DeviceEventEmitter.emit("event.submitComment", { body, attachments });
                submitComment(body, attachments);
                //DeviceEventEmitter.emit("event.displayLoader", null);
              }
            }}
            variant="ghost"
            _icon={{
              as: Ionicons,
              name: "save",
              color: "white"
            }}
          />
        </View>
      ),
    });
  }, [taskId, navigation, body, attachments]);

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync();
      const time = moment().valueOf();
      let fileToUpload = {
        id: fakeID--,
        type: res.mimeType,
        name: res.name,
        filename: res.name,
        uri: Platform.OS === 'android' ? res.uri : res.uri.replace('file://', ''),
        time,
      };
      setAttachments([...attachments, fileToUpload]);
    } catch (err) {
      console.log(err);
    }
  };

  const submitComment = (message, newAttachemnts) => {

    const formData = new FormData();
    newAttachemnts.forEach((file) => formData.append(`file`, file));
    //FORM DATA
    formData.append("token", `Bearer ${localStorage.getItem('acctok')}`);
    formData.append("taskId", taskId);
    formData.append("message", `<p>${message}</p>`);
    formData.append("parentCommentId", null);
    formData.append("internal", false);
    formData.append("fromInvoice", false);
    axios.post(`${REST_URL}/send-comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if (response.data.ok) {

          /*
          setAttachments([]);
          setBody(`<br>${currentUser.signature.replace(/(?:\r\n|\r|\n)/g, '<br>')}`);
          setShowError(false);
          */

          const comments = client.readQuery({
            query: GET_COMMENTS,
            variables: {
              task: taskId,
              page: 1,
              limit: 50,
            },
          });

          let newComments = [
            ...comments['comments'],
            {
              __typename: "Comment",
              childComments: [],
              commentAttachments: attachments.map((attachment) => ({
                ...attachment,
                mimetype: "",
                path: "",
                size: 0,
              })),
              createdAt: moment().valueOf(),
              emailError: null,
              emailSend: false,
              html: null,
              id: response.data.comment.id,
              internal: false,
              isEmail: false,
              message: response.data.comment.message,
              messageCount: comments['comments'].length,
              subject: null,
              tos: [],
              user: {
                __typename: "BasicUser",
                email: currentUser.email,
                fullName: currentUser.fullName,
                id: 2,
              },
            }
          ];

          client.writeQuery({
            query: GET_COMMENTS,
            variables: {
              task: taskId,
              page: 1,
              limit: 50,
            },
            data: {
              comments: newComments
            }
          });

          navigation.goBack();
        } else {}
        //    setSaving( false );
      })
      .catch((err) => {
        console.log(err);
        //  setSaving( false );
      });
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

      {
        attachments.map((attachment, index) => (
          <Flex key={attachment.id} direction="row" justify="space-between">
            <Button key={attachment.id} variant="ghost" m="0" p="0" justifyContent="flex-start">
              {attachment.filename}
            </Button>
            <IconButton
              onPress={() => {
                removeAttachment(index);
              }}
              p="0"
              variant="ghost"
              _icon={{
                as: Ionicons,
                name: "trash",
                color: "#0078d4"
              }}
            />
          </Flex>
        ))
      }

      <FormControl>
        <Stack>
          <Button
            variant="ghost"
            m="0"
            p="0"
            justifyContent="flex-start"
            onPress={selectFile}
          >
            {t('plusAttachments')}
          </Button>
        </Stack>
      </FormControl>
    </ScrollView>
  );
}