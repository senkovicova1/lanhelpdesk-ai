import React from 'react';

import Form from '../form.js';

import moment from 'moment';

import { ScrollView, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, Spinner, Center  } from "native-base";

import localStorage from 'react-native-sync-localstorage';

import ErrorDisplay from './editTaskErrors.js';

import {
  toSelArr,
  toSelItem,
} from '../../../helperFunctions/select';

import {
  timestampToString
} from '../../../helperFunctions/time';

import {
  updateArrayItem,
} from '../../../helperFunctions/time';

import {
  GET_TASK,
  GET_TASKS,
} from '../../../queries/tasks';

import {
  getEmptyAttributeRights,
  backendCleanRights,
} from '../../../configs/constants';

let fakeID = -1;

export default function TaskEdit( props ) {
  //data & queries
  const {
    columns,
    closeModal,
    inModal,
    taskId,
    task,
    currentUser,
    accessRights,
    companies,
    users,
    tripTypes,
    projects,
    saving,
    setSaving,
    filterValues,
    originalProjectId,
    filterId,
    deleteTaskFunc,
    updateCasheStorage,
    updateTask,
    client,
    fromInvoice,
  } = props;

  const invoiced = task.invoiced;

  //state
  const [ important, setImportant ] = React.useState( false );
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ tags, setTags ] = React.useState( [] );
  const [ project, setProject ] = React.useState( null );
  const [ status, setStatus ] = React.useState( null );
  const [ requester, setRequester ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ assignedTo, setAssignedTo ] = React.useState( [] );
  const [ deadline, setDeadline ] = React.useState( null );

  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ pendingChangable, setPendingChangable ] = React.useState( false );

  const [ closeDate, setCloseDate ] = React.useState( null );

  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ changes, setChanges ] = React.useState( {} );

  const userRights = (
    project ? {
      rights: project.right,
      attributeRights: project.attributeRights
    } :
    backendCleanRights()
  );


  const projectAttributes = (
    project ?
    project.project.projectAttributes :
    getEmptyAttributeRights()
  );

  // sync
  React.useEffect( () => {

    const project = task.project === null ? null : projects.find( ( project ) => project.id === task.project.id );
    const assignableUserIds = users.filter( ( user ) => project && project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) )
      .map( ( user ) => user.id );

    setAssignedTo( toSelArr( task.assignedTo, 'fullName' )
      .filter( ( user ) => assignableUserIds.includes( user.id ) ) );
    setCloseDate( task.closeDate );
    setDeadline( task.deadline );
    setDescription( task.description );
    setImportant( task.important );

    setPendingChangable( task.pendingChangable );
    setPendingDate( task.pendingDate );
    const status = ( task.status ? toSelItem( task.status ) : null )
    setStatus( status );
    setTags( toSelArr( task.tags ) );
    setCompany( ( task.company ? toSelItem( task.company ) : null ) );

    setRequester(
      task.requester ? {
        ...task.requester,
        value: task.requester.id,
        label: task.requester.fullName
      } :
      null
    );
    setProject( project );

    setTitle( task.title );
  }, [ taskId, task ] );

  React.useEffect( () => {
    updateToProjectRules( project );
  }, [ project ] );

  React.useEffect( () => {
    if (!project){
      return;
    }
    let newCustomAttributes = [];
    project.project.viewCustomAttributes.forEach((item, i) => {
      let matchingTaskValue = task.customAttributes.find((customAttribute) => item.id === customAttribute.customAttribute.id);

      const value = {
        text: matchingTaskValue ? matchingTaskValue.text : "",
        number: matchingTaskValue ? matchingTaskValue.number : "",
        selectValues: matchingTaskValue ? matchingTaskValue.selectValues.map((value) => ({...value, label: value.value.substring(0,1).toUpperCase() + value.value.substring(1)})) : [],
      };

      const selectValues = item.selectValues.map((value) => ({...value, label: value.value.substring(0,1).toUpperCase() + value.value.substring(1)}));

      let newAttribute = {
        ...item,
        value,
        selectValues,
        label: item.title.substring(0,1).toUpperCase() + item.title.substring(1),
        canEdit: project.project.editCustomAttributes.some((customAttribute) => item.id === customAttribute.id),
        isEdit: true
      };
      delete newAttribute.__typename;
      newCustomAttributes.push(newAttribute);
    });

    setCustomAttributes(newCustomAttributes.sort((a1, a2) => a1.order < a2.order ? -1 : 1));

  }, [ project, task ] );

  const updateToProjectRules = ( project ) => {
    if ( !project ) {
      return;
    }
    const userRights = {
      rights: project.right,
      attributeRights: project.attributeRights
    };

    const projectAttributes = project.project.projectAttributes;

    const projectUsers = users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.user.id === user.id ) );
    const assignableUsers = users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
    const projectRequesters = ( project.lockedRequester ? projectUsers : users );
    const statuses = toSelArr( project.project.statuses );
    //check def required and fixed and change is needed (CHECK IF IT ALREADY ISNT SET) and can see the attribute
    let changes = {};
    //Status
    if ( userRights.attributeRights.status.view ) {
      if ( projectAttributes.status.fixed ) {
        if ( projectAttributes.status.value && status.id !== projectAttributes.status.value.id ) {
          changeStatus( statuses.find( ( status ) => status.id === projectAttributes.status.value.id ) );
        }
      }
    }

    //Tags
    if ( userRights.attributeRights.tags.view ) {
      if ( projectAttributes.tags.fixed ) {
        let tagIds = projectAttributes.tags.value.map( t => t.id );
        if ( tags.length !== tagIds.length || tags.some( ( tag ) => !tagsIds.includes( tag.id ) ) ) {
          setTags( project.tags.filter( ( item ) => tagIds.includes( item.id ) ) );
          changes.tags = tagIds;
        }
      }
    }

    //Assigned to
    if ( userRights.attributeRights.assigned.view ) {
      if ( projectAttributes.assigned.fixed ) {
        let newAssignedTo = assignableUsers.filter( ( user1 ) => projectAttributes.assigned.value.some( ( user2 ) => user1.id === user2.id ) );
        if ( newAssignedTo.length === 0 && userRights.attributeRights.assigned.edit ) {
          newAssignedTo = assignableUsers.filter( ( user ) => user.id === currentUser.id );
        }
        if ( newAssignedTo.length !== assignedTo.length || newAssignedTo.some( ( user1 ) => assignedTo.some( ( user2 ) => user1.id !== user2.id ) ) ) {
          changes.assignedTo = newAssignedTo.map( ( user ) => user.id );
        }
        setAssignedTo( newAssignedTo );
      }
    }

    //Requester
    let potentialRequester = null;
    if ( userRights.attributeRights.requester.view ) {
      if ( projectAttributes.requester.fixed ) {
        if ( projectAttributes.requester.value ) {
          potentialRequester = projectRequesters.find( ( user ) => user.id === projectAttributes.requester.value.id );
        } else {
          potentialRequester = projectRequesters.find( ( user ) => user.id === currentUser.id );
        }
        if ( potentialRequester && ( requester === null || requester.id !== potentialRequester.id ) ) {
          setRequester( potentialRequester );
          changes.requester = potentialRequester.id;
        }
      }
    }

    //Company
    let potentialCompany = null;
    if ( userRights.attributeRights.company.view ) {
      if ( projectAttributes.company.fixed ) {
        if ( projectAttributes.company.value ) {
          potentialCompany = companies.find( ( company ) => company.id === projectAttributes.company.value.id );
        } else if ( potentialRequester ) {
          potentialCompany = companies.find( ( company ) => company.id === potentialRequester.company.id );
        }
        if ( potentialCompany && ( company === null || company.id !== potentialCompany.id ) ) {
          setCompany( potentialCompany );
          changes.company = company.id;
        }
      }
    }

    //Deadline
    if ( userRights.attributeRights.deadline.view ) {
      if ( projectAttributes.deadline.fixed && deadline.valueOf()
        .toString() !== projectAttributes.deadline.value ) {
        setDeadline( projectAttributes.deadline.value );
        changes.deadline = projectAttributes.deadline.value;
      }
    }

    //save all
    if ( Object.keys( changes )
      .length > 0 ) {
      autoUpdateTask( changes );
    }
  }

  //constants
  const availableProjects = projects.filter( ( project ) => project.right.taskProjectWrite );
  const assignedTos = project ? users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) ) : [];

  const requesters = ( project && project.project.lockedRequester ? toSelArr( project.usersWithRights.map( ( userWithRights ) => userWithRights.user ), 'fullName' ) : users );

  //functions
  const getCantSave = ( change = {} ) => {
    const compare = {
      title,
      status,
      project,
      tags,
      assignedTo,
      saving,
      ...change,
    }
    return (
      compare.title === "" ||
      compare.status === null ||
      compare.project === null ||
      invoiced ||
      ( compare.assignedTo.length === 0 && userRights.attributeRights.assigned.view && !projectAttributes.assigned.fixed ) ||
      compare.saving
    )
  }

  const autoUpdateTask = ( change, passFunc = null ) => {
    if ( getCantSave( change ) ) {
      setChanges( {
        ...changes,
        ...change
      } );
      return;
    }
    setSaving( true );
    let variables = {
      id: taskId,
      ...changes,
      ...change,
      fromInvoice,
    };

    updateTask( {
        variables
      } )
      .then( ( response ) => {
        setChanges( {} );
        //update task
        const originalTask = client.readQuery( {
            query: GET_TASK,
            variables: {
              id: taskId,
              fromInvoice,
            },
          } )
          .task;

        const updatedTask = {
          ...originalTask,
          ...response.data.updateTask
        }
        client.writeQuery( {
          query: GET_TASK,
          variables: {
            id: taskId,
            fromInvoice,
          },
          data: {
            task: updatedTask
          }
        } );
        try {
          //update tasks if project changed or not
          let execTasks = client.readQuery( {
              query: GET_TASKS,
              variables: {
                filterId,
                filter: filterValues,
                projectId: originalProjectId
              }
            } )
            .tasks;

          if ( project.id !== originalProjectId && originalProjectId !== null ) {
            client.writeQuery( {
              query: GET_TASKS,
              variables: {
                filterId,
                filter: filterValues,
                projectId: originalProjectId
              },
              data: {
                tasks: {
                  ...execTasks,
                  tasks: execTasks.tasks.filter( ( task ) => task.id !== taskId )
                }
              }
            } );
          } else {
            client.writeQuery( {
              query: GET_TASKS,
              variables: {
                filterId,
                filter: filterValues,
                projectId: originalProjectId
              },
              data: {
                tasks: {
                  ...execTasks,
                  tasks: updateArrayItem( execTasks.tasks, updatedTask )
                }
              }
            } );
          }

        } catch {}
        passFunc && passFunc();
      } )
      .catch( ( err ) => {
        setChanges( {
          ...changes,
          ...change
        } );
      } );

    setSaving( false );
  }

  const getTaskData = () => ( {
    shortSubtasks: task.shortSubtasks,
    subtasks: task.subtasks.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'fullName' ),
      type: item.type ? toSelItem( item.type ) : null,
    } ) ),
    workTrips: task.workTrips.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'fullName' ),
      type: toSelItem( item.type )
    } ) ),
    materials: task.materials,
    assignedTo,
    closeDate,
    company,
    startsAt: task.startsAt,
    deadline,
    description,
    important,
    milestone: task.milestone,
    pendingChangable,
    pendingDate,
    potentialPendingStatus: null,
    project,
    requester,
    status,
    tags,
    title,
    ganttOrder: task.ganttOrder,
    customAttributes
  } );

  //vykazyTable
  const subtasks = task.subtasks.map( item => ( {
    ...item,
    assignedTo: toSelItem( item.assignedTo, 'fullName' ),
  } ) );
  const materials = task.materials.map( ( item ) => ( {
    ...item,
  } ) );

  if (saving){
    return (
      <ScrollView padding="5" pb="10">
        <Flex direction="column" >
          <Spinner size="lg" />
          <Center>
            <Text>Saving changes. Please wait.</Text>
          </Center>
        </Flex>
      </ScrollView>
    )
  }

  return (
    <ScrollView padding="5" pb="10">

      <ErrorDisplay
        {...getTaskData()}
        userRights={userRights}
        projectAttributes={projectAttributes}
        />

      <Form
        {...props}
        userRights={userRights}
        autoUpdateTask={autoUpdateTask}
        projectAttributes={projectAttributes}
        updateTask={updateTask}

        title={title}
        setTitle={setTitle}

        description={description}
        setDescription={setDescription}

        tags={tags}
        setTags={setTags}

        project={project}

        status={status}
        setStatus={setStatus}

        setPendingDate={setPendingDate}
        setPendingChangable={setPendingChangable}
        setCloseDate={setCloseDate}

        requester={requester}
        setRequester={setRequester}

        company={company}
        setCompany={setCompany}

        taskAssignedTos={assignedTos}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}

        deadline={deadline}
        setDeadline={setDeadline}

        customAttributes={customAttributes}
        setCustomAttributes={setCustomAttributes}

        subtasks={subtasks}

        materials={materials}

        invoiced={invoiced}
         />

    </ScrollView>
  );
}
