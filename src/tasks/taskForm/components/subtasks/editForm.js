import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
import { ScrollView, Select, Button, IconButton, TextArea, FormControl, Checkbox, Input, Stack, AlertDialog } from "native-base";
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

  const client = useApolloClient();

  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );
  const [ deleteSubtask ] = useMutation( DELETE_SUBTASK );

  const [ done, setDone ] = React.useState( false );
  const [ title, setTitle ] = React.useState( "" );
  const [ quantity, setQuantity ] = React.useState( 0 );
  const [ assignedTo, setAssignedTo ] = React.useState( null );

  const [isOpen, setIsOpen] = React.useState(false);

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
        navigation.goBack();
      //  setSaving( false );
      } )
      .catch( ( err ) => {
      //  addLocalError( err );
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
        navigation.goBack();
      } )
      .catch( ( err ) => {
      //  addLocalError( err );
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
          <AlertDialog.Header>Delete a subtask</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure you want to delete this subtask?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={closeDeleteAlert} ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={deleteSubtaskFunc}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    )
  }

  return (
      <ScrollView margin="5">
        <FormControl>
            <Stack>
              <Checkbox
                accessibilityLabel="Completed"
                isChecked={done}
                onChange={() => {
                  setDone(!done);
                }}
                >
                Completed
              </Checkbox>
          </Stack>
        </FormControl>

        <FormControl>
          <FormControl.Label>Subtask info</FormControl.Label>
          <TextArea
            bgColor="white"
            placeholder="Write subtask description here"
            value={title}
            onChangeText={(text) => {
              setTitle(text)
            }}
          />
        </FormControl>

        <FormControl>
            <Stack>
              <FormControl.Label>Quantity</FormControl.Label>
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
              <FormControl.Label>Assigned user</FormControl.Label>
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
