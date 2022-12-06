import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
import { ScrollView, Select, Button, IconButton, TextArea, FormControl, Checkbox, Input, Stack, AlertDialog, Text, Alert, VStack, HStack } from "native-base";
import { Ionicons  } from '@expo/vector-icons';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";

import {
  UPDATE_SUBTASK,
  DELETE_SUBTASK
} from '../../../../queries/subtasks';

import {
  GET_TASK,
} from '../../../../queries/tasks';
import {
  useTranslation
} from "react-i18next";

export default function SubtaskEdit ( props ) {

  const {
    navigation,
    route,
  } = props;

  const {
    users,
    taskId,
    subtaskId,
    subtaskDone,
    subtaskTitle,
    subtaskQuantity,
    subtaskAssignedTo,
  } = route.params;

  const {
    t
  } = useTranslation();

  const client = useApolloClient();

  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );
  const [ deleteSubtask ] = useMutation( DELETE_SUBTASK );

  const [ done, setDone ] = React.useState( false );
  const [ title, setTitle ] = React.useState( "" );
  const [ quantity, setQuantity ] = React.useState( 0 );
  const [ assignedTo, setAssignedTo ] = React.useState( null );

  const [isOpen, setIsOpen] = React.useState(false);

  const [ error, setError ] = React.useState( null );

  const cancelRef = React.useRef(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{display: "flex", flexDirection: "row"}}>
          <IconButton
            onPress={() => {
              //chceck title length
              showDeleteAlert();
            }}
            variant="ghost"
            _icon={{
              as: Ionicons ,
              name: "trash",
              color: "white"
            }}
          />
          <IconButton
            onPress={() => {
              //chceck title length
              updateSubtaskFunc({id: subtaskId, title, done, quantity, assignedTo});
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
  }, [navigation, subtaskId, done, title, quantity, assignedTo]);

  React.useEffect(() => {
    setDone(subtaskDone);
    setTitle(subtaskTitle);
    setQuantity(parseFloat(subtaskQuantity));
    setAssignedTo(subtaskAssignedTo);
    setError(null);
  }, [subtaskId, subtaskDone, subtaskTitle, subtaskQuantity, subtaskAssignedTo]);


  const updateSubtaskFunc = ( work ) => {
    updateSubtask( {
        variables: {
          id: work.id,
          title: work.title,
          done: work.done,
          assignedTo: work.assignedTo.id,
          quantity: isNaN(parseFloat(work.quantity)) ? 0 : parseFloat(work.quantity),
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateSubtask, 'subtasks', 'UPDATE' );
        setError(null);
        navigation.goBack();
      //  setSaving( false );
      } )
      .catch( ( err ) => {
        setError(err.message);
      //  setSaving( false );
      } );
  }

  const deleteSubtaskFunc = () => {
    deleteSubtask( {
        variables: {
          id: subtaskId,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id: subtaskId,
        }, 'subtasks', 'DELETE' );
        setError(null);
        navigation.goBack();
      } )
      .catch( ( err ) => {
        setError(err.message);
      } );
  }

  const showDeleteAlert = () => {
    setIsOpen(true);
  };

  const closeDeleteAlert = () => {
    setIsOpen(false);
  };

  const updateCasheStorage = ( response, key, type ) => {
    const task = client.readQuery( {
        query: GET_TASK,
        variables: {
          id: taskId,
        },
      } )
      .task;
    let newTask = {
      ...task,
    };
    newTask[ key ] = [ ...newTask[ key ] ];
    switch ( type ) {
      case 'ADD': {
        newTask[ key ].push( response );
        break;
      }
      case 'UPDATE': {
        newTask[ key ][ newTask[ key ].findIndex( ( item ) => item.id === response.id ) ] = response;
        break;
      }
      case 'DELETE': {
        newTask[ key ] = newTask[ key ].filter( ( item ) => item.id !== response.id );
        break;
      }
      default: {
        return;
      }
    }
    client.writeQuery( {
      query: GET_TASK,
      variables: {
        id: taskId,
      },
      data: {
        task: newTask
      }
    } );
  }

  if (isOpen){
    return (
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={closeDeleteAlert}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{t('deleteSubtask')}</AlertDialog.Header>
          <AlertDialog.Body>
            {t('sureDeleteSubtask')}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={closeDeleteAlert} ref={cancelRef}>
                {t('cancel')}
              </Button>
              <Button colorScheme="danger" onPress={deleteSubtaskFunc}>
                {t('delete')}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    )
  }

  return (
      <ScrollView margin="5">
        {
          error &&
          <Alert w="100%" status={"error"} mb="5">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    {error}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        }

        <FormControl>
            <Stack>
              <Checkbox
                accessibilityLabel="Completed"
                isChecked={done}
                onChange={() => {
                  setDone(!done);
                }}
                >
                {t('completed')}
              </Checkbox>
          </Stack>
        </FormControl>

        <FormControl>
          <FormControl.Label>{t('subtasklInfo')}</FormControl.Label>
          <TextArea
            bgColor="white"
            placeholder={t('writeSubtaskDesc')}
            value={title}
            onChangeText={(text) => {
              setTitle(text)
            }}
          />
        </FormControl>

        <FormControl>
            <Stack>
              <FormControl.Label>{t('quantity')}</FormControl.Label>
              <Input
                keyboardType = 'numeric'
                bgColor="white"
                value={quantity.toString()}
                onChangeText={(num) => {
                  if (num.length > 0 && isNaN(num)){
                    return;
                  }
                  if (parseFloat(num) < 0){
                    setQuantity(parseFloat(num) * (-1));
                  } else {
                    setQuantity(num.length === 0 ? "" : parseFloat(num));
                  }
                }}
                />
            </Stack>
        </FormControl>


        <FormControl>
            <Stack>
              <FormControl.Label>{t('assignedUser')}</FormControl.Label>
              <Select
                selectedValue={assignedTo ? assignedTo.id : null}
                onValueChange={itemValue => {
                  const user = users.find((user) => user.id === itemValue);
                  setAssignedTo(user);
                }}
                >
                {
                  users.map((user) => (
                    <Select.Item
                      key={user.id}
                      label={user.label}
                      value={user.id}
                    />
                  ))
                }
              </Select>
            </Stack>
        </FormControl>

      </ScrollView>
  );
}
