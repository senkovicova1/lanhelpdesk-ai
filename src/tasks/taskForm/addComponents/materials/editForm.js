import React, {useState, useEffect} from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import { ScrollView, Select, Button, IconButton, TextArea, FormControl, Checkbox, Input, Stack, AlertDialog  } from "native-base";
import { Ionicons  } from '@expo/vector-icons';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";

import {
  UPDATE_MATERIAL,
  DELETE_MATERIAL
} from '../../../../queries/materials';

import {
  GET_TASK,
} from '../../../../queries/tasks';

export default function MaterialAdd ( props ) {

  const {
    navigation,
    route,
  } = props;

  const {
    taskId,
    addingTask,
    materialId,
    materialDone,
    materialTitle,
    materialQuantity,
    materialPrice,
  } = route.params;

  const client = useApolloClient();

  const [ updateMaterial ] = useMutation( UPDATE_MATERIAL );
  const [ deleteMaterial ] = useMutation( DELETE_MATERIAL );

  const [ done, setDone ] = React.useState( false );
  const [ title, setTitle ] = React.useState( "" );
  const [ quantity, setQuantity ] = React.useState( 0 );
  const [ price, setPrice ] = React.useState( 0 );

  const [isOpen, setIsOpen] = React.useState(false);

  const cancelRef = React.useRef(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{display: "flex", flexDirection: "row"}}>
          <IconButton
            onPress={() => {
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
              if (title.length > 0){
                if (addingTask){
                  DeviceEventEmitter.emit("event.editMaterial", {id: materialId, title, done, quantity, price});
                  navigation.goBack();
                } else {
                  updateMaterialFunc({id: materialId, title, done, quantity, price});
                }
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
  }, [navigation, materialId, done, title, quantity, price]);

    React.useEffect(() => {
      setDone(materialDone);
      setTitle(materialTitle);
      setQuantity(parseInt(materialQuantity));
      setPrice(materialPrice);
    }, [materialId, materialDone, materialTitle, materialQuantity, materialPrice]);

  const updateMaterialFunc = ( item ) => {
    updateMaterial( {
        variables: {
          id: item.id,
          title: item.title,
          done: item.done,
          quantity: parseFloat( item.quantity ),
          price: parseFloat( item.price ),
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateMaterial, 'materials', 'UPDATE' );
        navigation.goBack();
      } )
      .catch( ( err ) => {
    //    addLocalError( err );
      } );
  }

  const deleteMaterialFunc = () => {
    deleteMaterial( {
        variables: {
          id: materialId,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id: materialId,
        }, 'materials', 'DELETE' );
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
      } );

    let newTask = {
      ...task.task,
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
          <AlertDialog.Header>Delete a material</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure you want to delete this material?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={closeDeleteAlert} ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={() => {
                  if (addingTask){
                    DeviceEventEmitter.emit("event.removeMaterial", materialId);
                    navigation.goBack();
                  } else {
                    deleteMaterialFunc();
                  }
                }}
                >
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
          <FormControl.Label>Material info</FormControl.Label>
          <TextArea
            bgColor="white"
            placeholder="Write material description here"
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
                  if (parseInt(num) < 0){
                    setQuantity(parseInt(num) * (-1));
                  } else {
                    setQuantity(num.length === 0 ? "" : parseInt(num));
                  }
                }}
                />
            </Stack>
        </FormControl>

        <FormControl>
            <Stack>
              <FormControl.Label>Price per unit</FormControl.Label>
              <Input
                keyboardType = 'numeric'
                bgColor="white"
                value={price.toString()}
                onChangeText={(num) => {
                  if (num.length > 0 && isNaN(num)){
                    return;
                  }
                  if (parseInt(num) < 0){
                    setPrice(parseInt(num) * (-1));
                  } else {
                    setPrice(num.length === 0 ? "" : parseInt(num));
                  }
                }}
                />
            </Stack>
        </FormControl>

      </ScrollView>
  );
}