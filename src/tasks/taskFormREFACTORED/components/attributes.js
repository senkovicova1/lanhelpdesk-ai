import React, {useState} from 'react';
import { Platform, Input as RNInput } from 'react-native';
import { ScrollView, View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign, Feather } from '@expo/vector-icons';

import CustomAttributes from './customAttributes';

import {
  toSelArr,
} from '../../../helperFunctions/select';

import {
  timestampToString,
} from '../../../helperFunctions/time';

export default function TaskAttributes ( props ) {

  const {
    navigation,
    addingTask,
    taskId,
    task,
    currentUser,
    onSubmit,
    updateTask,
    accessRights,
    companies,
    users,
    projects,
    client,
    setSaving,
    status,
    setStatus,
    setImportant,
    setPendingDate,
    setPotentialPendingStatus,
    setPendingChangable,
    setCloseDate,
    requester,
    setRequester,
    company,
    setCompany,
    assignedTo,
    setAssignedTo,
    deadline,
    setDeadline,
    customAttributes,
    setCustomAttributes,
  } = props;

  const [ assignedToPickerOpen, setAssignedToPickerOpen ] = useState(false);
  const [ assignedTos, setAssignedTos ] = useState([]);
  const [ deadlinePickerOpen, setDeadlinePickerOpen ] = useState(false);
  const [ editOpen, setEditOpen ] = useState(false);
  const [ attributeChanges, setAttributeChanges ] = useState({});
  const [ attributeChangesDisplayValues, setAttributeChangesDisplayValues ] = useState({});

  const project = task.project === null ? null : projects.find( ( project ) => project.id === task.project.id );
  const availableProjects = projects.filter( ( project ) => project.right.taskProjectWrite );
  const requesters = ( project && project.project.lockedRequester ? toSelArr( project.usersWithRights.map( ( userWithRights ) => userWithRights.user ), 'fullName' ) : users );

  React.useEffect(() => {
    setAssignedTos(project ? users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) ) : []);
  }, [project]);

  const changeStatus = ( status ) => {
    if ( status.action === 'PendingDate' ) {
      if (addingTask){
        setStatus( status );
        setPendingDate( moment()
          .add( 1, 'days' ) );
        setPotentialPendingStatus( status );
        setPendingChangable( true );
      } else {
        const newAttributeChanges = {
          ...attributeChanges,
          status: status.id,
          pendingDate: moment()
            .add( 1, 'days' )
            .valueOf()
            .toString(),
          pendingChangable: true,
        };
        setAttributeChanges(newAttributeChanges);
        const newAttributeChangesDisplayValues = {
          ...attributeChangesDisplayValues,
          status: status.label,
        };
        setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
      }
    } else if ( status.action === 'CloseDate' || status.action === 'Invalid' ) {
      if (addingTask){
        setStatus( status );
        setImportant( false );
        setCloseDate( moment() );
      } else {
        const newAttributeChanges = {
          ...attributeChanges,
          status: status.id,
          closeDate: moment()
          .valueOf()
          .toString(),
          important: false
        };
        setAttributeChanges(newAttributeChanges);
        const newAttributeChangesDisplayValues = {
          ...attributeChangesDisplayValues,
          status: status.label,
        };
        setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
      }
    } else {
      if (addingTask){
        setStatus( status );
      } else {
        const newAttributeChanges = {
          ...attributeChanges,
          status: status.id,
        };
        setAttributeChanges(newAttributeChanges);
        const newAttributeChangesDisplayValues = {
          ...attributeChangesDisplayValues,
          status: status.label,
        };
        setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
      }
    }
  }

  const changeProject = ( project ) => {
    if (addingTask){
      setProject(project);
      // TODO: prompt change of other stuff in task
    } else {
      const newAttributeChanges = {
        ...attributeChanges,
        project: project.id,
      };
      setAttributeChanges(newAttributeChanges);
      const newAttributeChangesDisplayValues = {
        ...attributeChangesDisplayValues,
        project: project.label,
      };
      setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
    }
  }

  const changeRequester = ( requester ) => {
    if (addingTask){
      setRequester( requester );
    } else {
      const newAttributeChanges = {
        ...attributeChanges,
        requester: requester.id
      };
      setAttributeChanges(newAttributeChanges);
      const newAttributeChangesDisplayValues = {
        ...attributeChangesDisplayValues,
        requester: requester.label,
      };
      setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
    }
  }

  const changeCompany = ( company ) => {
    if (addingTask){
      setCompany( company );
    } else {
      const newAttributeChanges = {
        ...attributeChanges,
        company: company.id,
      };
      setAttributeChanges(newAttributeChanges);
      const newAttributeChangesDisplayValues = {
        ...attributeChangesDisplayValues,
        company: company.label,
      };
      setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
    }
  }

  // TODO: write changes to state?
  const saveChanges = () => {
    const projectId = attributeChanges.project;
    let newAttributeChanges = {...attributeChanges};
    delete newAttributeChanges.project;
    onSubmit(newAttributeChanges);

    if (projectId){
      let variables = {
        id: taskId,
        fromInvoice: false,
        project: projectId,
      };
      updateTask( {
        variables
      } )
      .finally( () => {

      } );
    }

    setAttributeChanges({});
    setAttributeChangesDisplayValues({});
  }

  return (
    <Box>
      {/*Status*/}
      <Box marginTop="5">
        <Heading variant="list" size="sm">Status</Heading>
        {
          (!addingTask && !editOpen) &&
          <Text>{attributeChangesDisplayValues.status ? attributeChangesDisplayValues.status : status.label}</Text>
        }
        {
          (addingTask || editOpen) &&
          <Select
            defaultValue={status.id}
            bgColor={status.color}
            onValueChange={itemValue => {
              changeStatus(toSelArr(project.project.statuses).filter((status)=>status.action !== 'Invoiced').find((status) => status.id === itemValue));
            }}
            >
            {
              (project ? toSelArr(project.project.statuses).filter((status)=>status.action !== 'Invoiced') : []).map((status) => (
                <Select.Item
                  key={status.id}
                  label={status.label}
                  value={status.id}
                />
              ))
            }
          </Select>
        }
      </Box>

      {/*Project*/}
      <Box marginTop="5">
        <Heading variant="list" size="sm">Project</Heading>
        {
          (!addingTask && !editOpen) &&
          <Text>{attributeChangesDisplayValues.project ? attributeChangesDisplayValues.project : project.label}</Text>
        }
        {
          (addingTask || editOpen) &&
          <Select
            defaultValue={project.id}
            onValueChange={itemValue => {
              changeProject(availableProjects.find((project) => project.id === itemValue));
            }}
            >
            {
              availableProjects.map((project) => (
                <Select.Item
                  key={project.id}
                  label={project.label}
                  value={project.id}
                />
              ))
            }
          </Select>
        }
      </Box>

      {/*Requester*/}
      <Box marginTop="5">
        <Heading variant="list" size="sm">Requester</Heading>
        {
          (!addingTask && !editOpen) &&
          <Text>{attributeChangesDisplayValues.requester ? attributeChangesDisplayValues.requester : requester.label}</Text>
        }
        {
          (addingTask || editOpen) &&
          <Select
            defaultValue={requester.id}
            onValueChange={itemValue => {
              changeRequester(requesters.find((requester) => requester.id === itemValue));
            }}
            >
            {
              requesters.map((user) => (
                <Select.Item
                  key={user.id}
                  label={user.label}
                  value={user.id}
                />
              ))
            }
          </Select>
        }
      </Box>

      {/*Company*/}
      <Box marginTop="5">
        <Heading variant="list" size="sm">Company</Heading>
        {
          (!addingTask && !editOpen) &&
          <Text>{attributeChangesDisplayValues.company ? attributeChangesDisplayValues.company : company.label}</Text>
        }
        {
          (addingTask || editOpen) &&
          <Select
            defaultValue={company.id}
            onValueChange={itemValue => {
              changeCompany(companies.find((company) => company.id === itemValue));
            }}
            >
            {
              companies.map((company) => (
                <Select.Item
                  key={company.id}
                  label={company.label}
                  value={company.id}
                />
              ))
            }
          </Select>
        }
      </Box>

      {/*Assigned*/}
      <Box marginTop="5">
          <Heading variant="list" size="sm">Assigned</Heading>
          {
            (!addingTask && !editOpen) &&
            <Text>{attributeChangesDisplayValues.assignedTo ? attributeChangesDisplayValues.assignedTo : assignedTo.map((user) => user.label).join(', ')}</Text>
          }
          {
            (addingTask || editOpen) &&
            <DropDownPicker
              multiple={true}
              listMode="SCROLLVIEW"
              mode="BADGE"
              open={assignedToPickerOpen}
              value={assignedTo.map((user) => user.value)}
              items={assignedTos}
              setOpen={setAssignedToPickerOpen}
              onSelectItem={(items) => {
                setAssignedTo(items);
                const newAttributeChanges = {
                  ...attributeChanges,
                  assignedTo: items.map((user) => user.value)
                };
                setAttributeChanges(newAttributeChanges);
                const newAttributeChangesDisplayValues = {
                  ...attributeChangesDisplayValues,
                  assignedTo: items.map((user) => user.label).join(", "),
                };
                setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
              }}
              setValue={setAssignedTo}
              setItems={setAssignedTos}
            />
          }
      </Box>

      {/*Deadline*/}
      <Box marginTop="5">
        <Heading variant="list" size="sm">Deadline</Heading>
        {
          (!addingTask && !editOpen) &&
          <Text>{deadline ? timestampToString(deadline) : "No deadline"}</Text>
        }
        {
          (addingTask || editOpen) &&
          <Box>
            <Pressable
              onPress={() => {
                setDeadlinePickerOpen(!deadlinePickerOpen);
              }}
              >
              <Box height="46px" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#CCC" justifyContent="center" pl="10px">
                <Text fontSize="xs">
                  {deadline ? timestampToString(deadline) : "No deadline"}
                </Text>
              </Box>
            </Pressable>
            <DateTimePickerModal
              isVisible={deadlinePickerOpen}
              mode="datetime"
              date={deadline ? new Date(parseInt(deadline)) : new Date()}
              onConfirm={(e) => {
                const newDeadline = new Date(e).getTime();
                setDeadline(newDeadline);

                const newAttributeChanges = {
                  ...attributeChanges,
                  deadline: newDeadline
                };
                setAttributeChanges(newAttributeChanges);

                setDeadlinePickerOpen(false);
              }}
              onCancel={() => {
                setDeadlinePickerOpen(false);
              }}
            />
          </Box>
        }
      </Box>

      <Box marginTop="5">
        <Heading variant="list" size="sm">Repeats</Heading>
        <Text>No repeat</Text>
      </Box>

      <CustomAttributes
        {...props}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        attributeChanges={attributeChanges}
        setAttributeChanges={setAttributeChanges}
        attributeChangesDisplayValues={attributeChangesDisplayValues}
        setAttributeChangesDisplayValues={setAttributeChangesDisplayValues}
        />

      {
        !addingTask &&
        <Flex direction="row" justify="space-between" marginTop="5" marginBottom="10" alignItems="center">
          {
            editOpen &&
          <IconButton
            onPress={() => {
              setEditOpen(!editOpen);
            }}
            variant="solid"
            width="50px"
            borderRadius="20"
            _icon={{
                as: Feather,
                name: "x",
                color: "white"
              }
            }
            />
        }
          <IconButton
            onPress={() => {
              if (editOpen){
                saveChanges();
              }
              setEditOpen(!editOpen);
            }}
            variant="solid"
            width="50px"
            borderRadius="20"
            _icon={
              editOpen ?
              {
                as: Ionicons ,
                name: "save",
                color: "white"
              } :
              {
                as: Ionicons ,
                name: "pencil",
                color: "white"
              }
            }
            />
        </Flex>
      }

    </Box>
  )
}
