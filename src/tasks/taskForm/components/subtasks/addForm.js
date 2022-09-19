import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
import { ScrollView, Select, Button, Text, IconButton, TextArea, FormControl, Checkbox, Input, Stack, Alert, VStack, HStack } from "native-base";
import { Ionicons  } from '@expo/vector-icons';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";

import {
  ADD_SUBTASK,
} from '../../../../queries/subtasks';

import {
  GET_TASK,
} from '../../../../queries/tasks';

export default function SubtaskAdd ( props ) {

  const {
    navigation,
    route,
  } = props;

  const {
    users,
    newSubtaskOrder,
    taskId,
  } = route.params;

  const client = useApolloClient();

  const [ addSubtask ] = useMutation( ADD_SUBTASK );

  const [ done, setDone ] = React.useState( false );
  const [ title, setTitle ] = React.useState( "" );
  const [ quantity, setQuantity ] = React.useState( 0 );
  const [ assignedTo, setAssignedTo ] = React.useState( null );

  const [ error, setError ] = React.useState( null );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{display: "flex", flexDirection: "row"}}>
          <IconButton
            onPress={() => {
              //chceck title length
              addSubtaskFunc({title, done, quantity, assignedTo});
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
  }, [navigation, done, title, quantity, assignedTo]);


  useEffect(() => {
    setAssignedTo(users[0]);
  }, [users]);

  const addSubtaskFunc = ( work ) => {
  //  setSaving( true );

    addSubtask( {
        variables: {
          title: work.title,
          done: work.done,
          quantity: isNaN(parseFloat(work.quantity)) ? 0 : parseFloat(work.quantity),
          assignedTo: work.assignedTo.id,
          order: newSubtaskOrder,
          approved: false,
          discount: 0,
          task: taskId,
          scheduled: null,
          fromInvoice: false,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addSubtask, 'subtasks', 'ADD' );
        setError(null);
        navigation.goBack();
    //    setSaving( false );
      } )
      .catch( ( err ) => {
        setError(err.message);
    //    setSaving( false );
      } );
  }

  const updateCasheStorage = ( response, key, type ) => {
    const task = client.readQuery( {
        query: GET_TASK,
        variables: {
          id: taskId,
        },
      } );

    let newTask = {
      ...task.task,
    };
    newTask[ key ] = [ ...newTask[ key ] ];
    newTask[ key ].push( response );

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
                defaultValue={users[0].id}
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
