import React, {useState} from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription,
} from "@apollo/client";

import moment from 'moment';
import axios from 'react-native-axios';

import { ScrollView, View, Spinner, Center, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import localStorage from 'react-native-sync-localstorage';

import Form from '../addForm.js';

import ErrorDisplay, {hasAddTaskIssues} from './addTaskErrors.js';

import {
  getEmptyAttributeRights,
  backendCleanRights,
} from '../../../configs/constants';

import {
  getMyData,
} from '../../../helperFunctions/userData';

import {
  toSelArr,
  toSelItem,
} from '../../../helperFunctions/select';

import {
  localFilterToValues,
} from '../../../helperFunctions/filter';

import {
  updateArrayItem,
} from '../../../helperFunctions/arrays';

import {
  GET_MY_PROJECTS,
  PROJECTS_SUBSCRIPTION,
} from '../../../queries/projects';

import {
  GET_BASIC_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from '../../../queries/companies';

import {
  GET_BASIC_USERS,
  USERS_SUBSCRIPTION,
} from '../../../queries/users';

import {
  ADD_TASK,
} from '../../../queries/tasks';

import {
  GET_PROJECT,
  GET_FILTER,
} from '../../../apollo/localSchema/queries';

import {
  REST_URL,
} from '../../../configs/restAPI';

import {
  GET_COMMENTS,
  COMMENTS_SUBSCRIPTION,
} from '../../../queries/comments';

let fakeID = -1;

export default function AddTaskContainer ( props ) {

  const {
    navigation,
    projectID,
    loading,
    projects,
    myProjects,
    users,
    companies,
    currentUser,
    defaultUnit,
    addTask,
  } = props;

  const client = useApolloClient();

  const currentUserIfInProject = ( project ) => {
    return project && project.users.some( ( userData ) => userData.user.id === currentUser.id ) ? users.find( ( user ) => user.id === currentUser.id ) : null;
  }
  const initialProject = projectID ? projects.find( p => p.id === projectID ) : null;

  const initialAssignableUsers = users.filter( ( user ) => initialProject && initialProject.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );

  const [ important, setImportant ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ tags, setTags ] = useState([]);
  const [ project, setProject ] = useState(initialProject);
  const [ status, setStatus ] = React.useState( null );
  const [ requester, setRequester ] = React.useState( currentUserIfInProject( project ) );
  const [ company, setCompany ] = React.useState( null );
  const [ assignedTo, setAssignedTo ] = React.useState( initialAssignableUsers.filter( ( user ) => user.id === currentUser.id ) );
  const [ deadline, setDeadline ] = React.useState( null );

  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ potentialPendingStatus, setPotentialPendingStatus ] = React.useState( null );
  const [ pendingChangable, setPendingChangable ] = React.useState( false );

  const [ closeDate, setCloseDate ] = useState(false);

  const [ subtasks, setSubtasks ] = useState([]);
  const [ materials, setMaterials ] = useState([]);

  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ attachments, setAttachments ] = React.useState( [] );

  const [ saving, setSaving ] = useState(false);

  const projectUsers = users.filter( ( user ) => project && project.users.some( ( userData ) => userData.user.id === user.id ) );
  const assignableUsers = users.filter( ( user ) => project && project.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
  const projectRequesters = project && project.lockedRequester ? projectUsers : users;

  const userRights = (
    project ? {
      rights: project.right,
      attributeRights: project.attributeRights
    } :
    backendCleanRights()
  );

  const projectAttributes = (
    project ?
    project.projectAttributes :
    getEmptyAttributeRights()
  );

  const getTaskData = () => ( {
    shortSubtasks: [],
    subtasks,
    workTrips: [],
    materials,
    assignedTo,
    closeDate,
    company,
    startsAt: null,
    deadline,
    description,
    important: false,
    milestone: null,
    pendingChangable,
    pendingDate,
    project,
    requester,
    status,
    tags,
    title,
    customAttributes,
  } );

  const cannotSave = (
    saving ||
    loading ||
    hasAddTaskIssues( {
      ...getTaskData(),
      userRights,
      projectAttributes,
      customAttributes,
      currentUser,
    })
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{display: "flex", flexDirection: "row"}}>
          <IconButton
            onPress={() => {
              if (cannotSave){
                return;
              } else {
                addTaskFunc({title, important, title, closeDate, assignedTo, company, deadline, description, pendingDate, project, requester, status, tags, subtasks, materials, customAttributes});
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
  }, [navigation, important, title, closeDate, assignedTo, company, deadline, description, pendingDate, project, requester, status, tags, subtasks, materials, customAttributes, cannotSave]);

  React.useEffect( () => {
    setDefaults( project );
  }, [ project ] );

  React.useEffect( () => {
    if ( project ) {
      const updatedProject = projects.find( ( project2 ) => project2.id === project.id )
      if ( updatedProject ) {
        setProject( updatedProject );
        let newCustomAttributes = [];
        updatedProject.addCustomAttributes.forEach((item, i) => {
          const value = {
            text: item.defaultValue ? item.defaultValue.text : "",
            number: item.defaultValue ? item.defaultValue.number : 0,
            selectValues: item.selectValues.filter((value) => value.def).map((value) => ({...value, label: value.value.substring(0,1).toUpperCase() + value.value.substring(1)})),
          };
          const selectValues = item.selectValues.map((value) => ({...value, label: value.value.substring(0,1).toUpperCase() + value.value.substring(1)}));

          let newAttribute = {
            ...item,
            value,
            selectValues,
            label: item.title.substring(0,1).toUpperCase() + item.title.substring(1),
            canEdit: true,
          };
          delete newAttribute.__typename;
          newCustomAttributes.push(newAttribute);
        });

        setCustomAttributes(newCustomAttributes.sort((a1, a2) => a1.order < a2.order ? -1 : 1));

      } else {
        setTags( [] );
        setStatus( null );
        setProject( projects[ 0 ] );

        let newCustomAttributes = [];
        projects[ 0 ].addCustomAttributes.forEach((item, i) => {
          const value = {
            text: item.defaultValue ? item.defaultValue.text : "",
            number: item.defaultValue ? item.defaultValue.number : 0,
            selectValues: item.selectValues.filter((value) => value.def).map((value) => ({...value, label: value.value.substring(0,1).toUpperCase() + value.value.substring(1)})),
          };

          const selectValues = item.selectValues.map((value) => ({...value, label: value.value.substring(0,1).toUpperCase() + value.value.substring(1)}));

          let newAttribute = {
            ...item,
            value,
            selectValues,
            label: item.title.substring(0,1).toUpperCase() + item.title.substring(1),
            canEdit: true,
          };
          delete newAttribute.__typename;
          newCustomAttributes.push(newAttribute);
        });

        setCustomAttributes(newCustomAttributes.sort((a1, a2) => a1.order < a2.order ? -1 : 1));

      }
    }
  }, [ projects ] );

  React.useEffect( () => {
    if ( company ) {
      const updatedCompany = companies.find( ( company2 ) => company2.id === company.id )
      if ( updatedCompany ) {
        setCompany( updatedCompany );
      } else {
        setCompany( null );
      }
    }
  }, [ companies ] );

  React.useEffect( () => {
    if ( subtasks.length > 0 ) {
      setSubtasks( subtasks.map( ( subtask ) => {
        const updatedUser = users.find( ( user2 ) => user2.id === subtask.assignedTo.id )
        return {
          ...subtask,
          assignedTo: updatedUser ? updatedUser : null,
        }
      } ) );
    }

    if ( assignedTo.length > 0 ) {
      const updatedAssignedTos = users.filter( ( user ) => assignedTo.some( ( user2 ) => user2.id === user.id ) );
      setAssignedTo( updatedAssignedTos );
    }

    if ( requester ) {
      const updatedRequester = users.find( ( user2 ) => user2.id === requester.id )
      if ( updatedRequester ) {
        setRequester( updatedRequester );
      } else {
        setRequester( null );
      }
    }
  }, [ users ] );

  React.useEffect( () => {
    updateWorks( assignedTo );
  }, [ assignedTo ] );

  //functions
  const setDefaults = ( project, forced ) => {
    if ( project === null || !project.projectAttributes ) {
      return;
    }
    updateToProjectRules( project );
  }

  const updateWorks = ( assignedTo ) => {
    const defAssigned = assignedTo.length > 0 ? users.find( ( user2 ) => user2.id === assignedTo[ 0 ].id ) : null;
    setSubtasks( subtasks.map( ( subtask ) => {
      const updatedUser = assignedTo.some( ( user2 ) => user2.id === subtask.assignedTo.id )
      return {
        ...subtask,
        assignedTo: updatedUser ? subtask.assignedTo : defAssigned,
      }
    } ) );
  }

  const updateToProjectRules = ( project ) => {
    if ( !project ) {
      return;
    }

    //dont care for fixed, set defaults and fixed will restrict editing
    const potencialUser = currentUserIfInProject( project );
    const userRights = {
      rights: project.right,
      attributeRights: project.attributeRights
    };

    const projectAttributes = (
      project ?
      project.projectAttributes :
      getEmptyAttributeRights()
    );

    let maybeRequester = null;
    if ( users ) {
      if ( project.lockedRequester && currentUser.role.level !== 0 ) {
        maybeRequester = potencialUser;
      } else {
        maybeRequester = users.find( ( user ) => user.id === currentUser.id );
      }
    }

    const projectUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.user.id === user.id ) );
    const assignableUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
    const projectRequesters = ( project.lockedRequester ? projectUsers : users );

    if ( projectAttributes.assigned.fixed ) {
      if ( projectAttributes.assigned.value.length === 0 && userRights.attributeRights.assigned.add ) {
        setAssignedTo( potencialUser ? [ potencialUser ] : [] );
      } else {
        setAssignedTo( assignableUsers.filter( ( user ) => projectAttributes.assigned.value.some( ( user2 ) => user.id === user2.id ) ) );
      }
    } else {
      let newAssignedTo = assignedTo.filter( ( user ) => assignableUsers.some( ( user2 ) => user.id === user2.id ) );
      newAssignedTo = [
        ...newAssignedTo,
        ...assignableUsers.filter( ( user1 ) => projectAttributes.assigned.value.some( ( user2 ) => user1.id === user2.id ) && !newAssignedTo.some( ( user2 ) => user1.id === user2.id ) ),
      ];
      if ( newAssignedTo.length === 0 && potencialUser && userRights.attributeRights.assigned.add ) {
        newAssignedTo = [ potencialUser ];
      }
      setAssignedTo( newAssignedTo );
    }

    let newRequester = null;
    if ( projectAttributes.requester.value !== null ) {
      //has projectAttributesault value
      newRequester = projectRequesters.find( ( user ) => user.id === projectAttributes.requester.value.id );
    } else {
      //no projectAttributesault value but is required or can be recommened
      newRequester = maybeRequester;
    }
    setRequester( newRequester );
    if ( projectAttributes.company.value ) {
      setCompany( companies.find( ( company ) => company.id === projectAttributes.company.value.id ) )
    } else {
      if ( newRequester ) {
        setCompany( companies.find( ( company ) => company.id === newRequester.company.id ) )
      } else {
        setCompany( null );
      }
    }

    //status
    const statuses = toSelArr( project.statuses );
    let potentialStatus = statuses.find( ( status ) => status.action.toLowerCase() === 'isnew' );
    if ( !potentialStatus ) {
      potentialStatus = statuses[ 0 ];
    }
    let newStatus = projectAttributes.status.value ? statuses.find( ( item ) => item.id === projectAttributes.status.value.id ) : potentialStatus;
    setStatus( newStatus );

    let tagIds = projectAttributes.tags.value.map( t => t.id );
    let newTags = projectAttributes.tags.value.length > 0 ? project.tags.filter( ( item ) => tagIds.includes( item.id ) ) : tags.filter( ( tag1 ) => project.tags.some( ( tag2 ) => tag2.id === tag1.id ) );
    setTags( newTags );

    let newDeadline = projectAttributes.deadline.value ? moment( parseInt( projectAttributes.deadline.value ) ) : deadline;
    setDeadline( newDeadline );
  }

  const addTaskFunc = (data) => {
    setSaving( true );
    const { important, title, closeDate, assignedTo, company, deadline, description, pendingDate, project, requester, status, tags, subtasks, materials, customAttributes } = data;

    addTask( {
        variables: {
          important,
          title,
          closeDate: closeDate ? closeDate.valueOf()
            .toString() : null,
          assignedTo: assignedTo.map( user => user.id ),
          company: company ? company.id : null,
          startsAt: null, //startsAt ? startsAt.valueOf().toString() : null,
          deadline: deadline ? deadline.valueOf()
            .toString() : null,
          description,
          milestone: null,
          pendingChangable: false,
          pendingDate: pendingDate ? pendingDate.valueOf()
            .toString() : null,
          project: project.id,
          requester: requester ? requester.id : null,
          status: status.id,
          tags: tags.map( tag => tag.id ),
          repeat: null,
          subtasks: subtasks.map( item => ( {
            title: item.title,
            order: item.order,
            done: item.done,
            approved: item.approved,
            quantity: item.quantity,
            discount: item.discount,
            assignedTo: item.assignedTo.id,
            scheduled: item.scheduled,
          } ) ),
          workTrips: [],
          materials: materials.map( item => ( {
            title: item.title,
            order: item.order,
            done: item.done,
            approved: item.approved,
            quantity: item.quantity,
            margin: item.margin,
            price: parseFloat( item.price )
          } ) ),
          shortSubtasks: [],
          customAttributes: customAttributes.map((item) => ({
            text: item.value.text,
            number: item.value.number,
            selectValues: item.value.selectValues ? item.value.selectValues.map((value) => value.id) : [],
            customAttribute: item.id,
          }))
        }
      } )
      .then( ( response ) => {
        if ( attachments.length > 0 ) {
          const formData = new FormData();
          attachments.map( ( attachment ) => attachment.data )
            .forEach( ( file ) => formData.append( `file`, file ) );
          formData.append( "token", `Bearer ${localStorage.getItem( "acctok" )}` );
          formData.append( "taskId", response.data.addTask.id );
          formData.append( "newTask", true );
          axios.post( `${REST_URL}/upload-attachments`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            } )
            .then( async ( response2 ) => {
              setSaving( false );
              navigation.navigate("List");
            } )
            .catch( ( err ) => {
              setSaving( false );
            } );
        } else {
          setSaving( false );
          navigation.navigate("List");
          return;
        }
      } )
      .catch( ( err ) => {
        setSaving( false );
      } );

  }

  const addAttachment = (attachment) => {
    const time = moment().valueOf();
    let fileToUpload = {
      id: fakeID--,
      type: attachment.mimeType,
      name: attachment.name,
      filename: attachment.name,
      uri: Platform.OS === 'android' ? attachment.uri : attachment.uri.replace('file://', ''),
      time,
    };
    setAttachments([...attachments, fileToUpload]);
  }

  const removeAttachment = (index) => {
    let newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  }

  if (saving){
    return (
      <ScrollView padding="5" pb="10">
        <Flex direction="column" >
          <Spinner size="lg" />
          <Center>
            <Text>Adding your task. Please wait.</Text>
          </Center>
        </Flex>
      </ScrollView>
    )
  }

  return (
    <ScrollView padding="5" pb="10">

      <ErrorDisplay
        {...getTaskData()}
        currentUser={currentUser}
        userRights={userRights}
        projectAttributes={projectAttributes}
        customAttributes={customAttributes}
        />


      <Form
        {...props}
        addingTask={true}
        currentUser={currentUser}
        accessRights={currentUser ? currentUser.role.accessRights : {}}
        userRights={userRights}
        projectAttributes={projectAttributes}
        companies={companies}
        users={users}
        assignableUsers={assignableUsers}
        projectRequesters={projectRequesters}
        projects={projects}
        client={client}

        onSubmit={addTaskFunc}
        setSaving={setSaving}

        title={title}
        setTitle={setTitle}

        description={description}
        setDescription={setDescription}

        tags={tags}
        setTags={setTags}

        project={project}

        status={status}
        setStatus={setStatus}

        setImportant={setImportant}
        setPendingDate={setPendingDate}
        setPotentialPendingStatus={setPotentialPendingStatus}
        setPendingChangable={setPendingChangable}
        setCloseDate={setCloseDate}

        requester={requester}
        setRequester={setRequester}

        company={company}
        setCompany={setCompany}

        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}

        deadline={deadline}
        setDeadline={setDeadline}

        customAttributes={customAttributes}
        setCustomAttributes={setCustomAttributes}

        subtasks={subtasks}
        setSubtasks={setSubtasks}

        materials={materials}
        setMaterials={setMaterials}

        attachments={attachments}
        addAttachment={addAttachment}
        removeAttachment={removeAttachment}
         />

    </ScrollView>
  );
}
