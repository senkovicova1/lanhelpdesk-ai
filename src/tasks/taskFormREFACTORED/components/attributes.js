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
    currentUser,
    projectAttributes,
    userRights,
    invoiced,
    navigation,
    taskId,
    task,
    autoUpdateTask,
    updateTask,
    accessRights,
    companies,
    users,
    projects,
    client,
    setSaving,
    project,
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
    taskAssignedTos,
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

  const availableProjects = projects.filter( ( project ) => project.right.taskProjectWrite );
  const requesters = ( project && project.project.lockedRequester ? toSelArr( project.usersWithRights.map( ( userWithRights ) => userWithRights.user ), 'fullName' ) : users );

  React.useEffect(() => {
    setAssignedTos(taskAssignedTos);
  }, [taskAssignedTos]);

  const changeStatus = ( status ) => {
    if ( status.action === 'PendingDate' ) {
      const newAttributeChanges = {
        ...attributeChanges,
        status: status.id,
        statusColor: status.color,
        pendingDate: moment()
          .add( 1, 'days' )
          .valueOf()
          .toString(),
        pendingChangable: true,
      };
      setAttributeChanges(newAttributeChanges);
    } else if ( status.action === 'CloseDate' || status.action === 'Invalid' ) {
      const newAttributeChanges = {
        ...attributeChanges,
        status: status.id,
        statusColor: status.color,
        closeDate: moment()
        .valueOf()
        .toString(),
        important: false
      };
      setAttributeChanges(newAttributeChanges);
    } else {
      const newAttributeChanges = {
        ...attributeChanges,
        status: status.id,
        statusColor: status.color,
      };
      setAttributeChanges(newAttributeChanges);
    }

  }

  const changeProject = ( project ) => {
    const newAttributeChanges = {
      ...attributeChanges,
      project: project.id,
    };
    setAttributeChanges(newAttributeChanges);
  }

  const changeRequester = ( requester ) => {
    const newAttributeChanges = {
      ...attributeChanges,
      requester: requester.id
    };
    setAttributeChanges(newAttributeChanges);
  }

  const changeCompany = ( company ) => {
    const newAttributeChanges = {
      ...attributeChanges,
      company: company.id,
    };
    setAttributeChanges(newAttributeChanges);
  }

  // TODO: write changes to state?
  const saveChanges = () => {
    const projectId = attributeChanges.project;
    let newAttributeChanges = {...attributeChanges};
    delete newAttributeChanges.project;
    delete newAttributeChanges.statusColor;
    autoUpdateTask(newAttributeChanges);

    if (projectId){
      let variables = {
        id: taskId,
        fromInvoice: undefined,
        project: projectId,
      };
      updateTask( {
        variables
      } )
      .finally( () => {

      } );
    }

    setAttributeChanges({});
  }

  return (
    <Box>
      {/*Status*/}
      {
        userRights.attributeRights.status.view &&
        <Box marginTop="5">
          <Heading variant="list" size="sm">Status</Heading>
          {
            (
              !editOpen ||
              projectAttributes.status.fixed ||
              !userRights.attributeRights.status.edit ||
              invoiced
            ) &&
            <Text>{status ? status.label : "None"}</Text>
          }
          {
            editOpen &&
            !projectAttributes.status.fixed && userRights.attributeRights.status.edit &&
            !invoiced &&
            <Select
              defaultValue={status.id}
              bgColor={attributeChanges.statusColor ? attributeChanges.statusColor : status.color}
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
      }

      {/*Project*/}
      <Box marginTop="5">
        <Heading variant="list" size="sm">Project</Heading>
        {
          (
            !editOpen ||
            !userRights.rights.taskProjectWrite ||
            invoiced
          ) &&
          <Text>{project ? project.label : "None"}</Text>
        }
        {
          editOpen &&
          userRights.rights.taskProjectWrite &&
          !invoiced &&
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
      { userRights.attributeRights.requester.view &&
        <Box marginTop="5">
          <Heading variant="list" size="sm">Requester</Heading>
          {
            (
              !editOpen ||
              projectAttributes.requester.fixed ||
              !userRights.attributeRights.requester.edit ||
              invoiced
             ) &&
            <Text>{requester ? requester.label : "None"}</Text>
          }
          {
            editOpen &&
            !projectAttributes.requester.fixed && userRights.attributeRights.requester.edit && !invoiced &&
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
      }

      {/*Company*/}
      { userRights.attributeRights.company.view &&
        <Box marginTop="5">
          <Heading variant="list" size="sm">Company</Heading>
          {
            (
              !editOpen ||
              projectAttributes.company.fixed || !userRights.attributeRights.company.edit || invoiced
            ) &&
            <Text>{company ? company.label : "None"}</Text>
          }
          {
            editOpen &&
            !projectAttributes.company.fixed &&
            userRights.attributeRights.company.edit &&
            !invoiced &&
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
      }

      {/*Assigned*/}
      { userRights.attributeRights.assigned.view &&
        <Box marginTop="5">
          <Heading variant="list" size="sm">Assigned</Heading>
          {
            (
              !editOpen ||
              projectAttributes.assigned.fixed ||
              !userRights.attributeRights.assigned.edit ||
              invoiced
            ) &&
            <Text>{assignedTo.length > 0 ? assignedTo.map((user) => user.label).join(', ') : "None"}</Text>
          }
          {
            editOpen &&
            !projectAttributes.assigned.fixed &&
            userRights.attributeRights.assigned.edit &&
            !invoiced &&
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
              }}
              setValue={setAssignedTo}
              setItems={setAssignedTos}
            />
          }
        </Box>
      }

      {/*Deadline*/}
      { userRights.attributeRights.deadline.view &&
      <Box marginTop="5">
        <Heading variant="list" size="sm">Deadline</Heading>
        {
          (
            !editOpen ||
            projectAttributes.deadline.fixed ||
            !userRights.attributeRights.deadline.edit ||
            invoiced
          ) &&
          <Text>{deadline ? timestampToString(deadline) : "No deadline"}</Text>
        }
        {
          editOpen &&
          !projectAttributes.deadline.fixed &&
          userRights.attributeRights.deadline.edit &&
          !invoiced &&
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
      }

      {
      <CustomAttributes
        {...props}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        attributeChanges={attributeChanges}
        setAttributeChanges={setAttributeChanges}
        />
      }

      <Flex direction="row" justify="space-between" marginTop="5" marginBottom="10" alignItems="center">
        {
          editOpen &&
          <IconButton
            onPress={() => {
              console.log("HEJ");
              setAttributeChanges({});
              setEditOpen(false);
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
            console.log("YO");
            if (editOpen){
              saveChanges();
            }
            setEditOpen(true);
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

    </Box>
  )
}
