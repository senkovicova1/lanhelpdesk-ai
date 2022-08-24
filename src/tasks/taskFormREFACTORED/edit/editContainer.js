import React, {useState} from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription,
} from "@apollo/client";

import { ScrollView, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

import Form from './form.js';
import axios from 'react-native-axios';

import {
  getMyData,
} from '../../helperFunctions/userData';

import {
  toSelArr,
  toSelItem,
} from '../../helperFunctions/select';

import {
  localFilterToValues,
} from '../../helperFunctions/filter';

import {
  updateArrayItem,
} from '../../helperFunctions/arrays';

import {
  GET_MY_PROJECTS,
  PROJECTS_SUBSCRIPTION,
} from '../../queries/projects';

import {
  GET_BASIC_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from '../../queries/companies';

import {
  GET_BASIC_USERS,
  USERS_SUBSCRIPTION,
} from '../../queries/users';

import {
  GET_TASK,
  UPDATE_TASK,
} from '../../queries/tasks';

import {
  GET_PROJECT,
  GET_FILTER,
} from '../../apollo/localSchema/queries';

import {
  REST_URL,
} from '../../configs/restAPI';

import {
  GET_COMMENTS,
  COMMENTS_SUBSCRIPTION,
} from '../../queries/comments';

export default function EditTaskContainer ( props ) {

  const {
    navigation,
    route,
  } = props;

  const {
    taskId
  } = route.params;

  // // TODO: rights
  // TODO: updateToProjectRules
  // TODO: fromInvoice

  const client = useApolloClient();

  const [ important, setImportant ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ tags, setTags ] = useState([]);
  const [ project, setProject ] = useState({});
  const [ status, setStatus ] = React.useState( null );
  const [ requester, setRequester ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ assignedTo, setAssignedTo ] = React.useState( [] );
  const [ deadline, setDeadline ] = React.useState( null );

  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ potentialPendingStatus, setPotentialPendingStatus ] = React.useState( null );
  const [ pendingChangable, setPendingChangable ] = React.useState( null );

  const [ closeDate, setCloseDate ] = useState(false);

  const [ subtasks, setSubtasks ] = useState([]);
  const [ materials, setMaterials ] = useState([]);

  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ saving, setSaving ] = useState(false);
  const [ changes, setChanges ] = React.useState( {} );

  //local
  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
    loading: projectLoading,
  } = useQuery( GET_PROJECT );

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;

  //network
  const {
    data: taskData,
    loading: taskLoading,
    refetch: taskRefetch,
    error: taskError
  } = useQuery( GET_TASK, {
    variables: {
      id: taskId,
    },
  } );
  const {
    data: basicUsersData,
    loading: basicUsersLoading,
    refetch: basicUsersRefetch,
  } = useQuery( GET_BASIC_USERS, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: basicCompaniesData,
    loading: basicCompaniesLoading,
    refetch: basicCompaniesRefetch,
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: myProjectsRefetch,
  } = useQuery( GET_MY_PROJECTS, {
    variables: {
      fromInvoice: false,
    },
    fetchPolicy: 'network-only'
  } );
  const {
    data: commentsData,
    loading: commentsLoading,
    refetch: commentsRefetch,
    error: commentsError,
  } = useQuery( GET_COMMENTS, {
    variables: {
      task: taskId,
      page: 1,
      limit: 5,
    },
    fetchPolicy: 'network-only'
  } );


  //subscriptions
  useSubscription( USERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      basicUsersRefetch();
    }
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      basicCompaniesRefetch();
    }
  } );

  useSubscription( PROJECTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      myProjectsRefetch();
    }
  } );

  useSubscription( COMMENTS_SUBSCRIPTION, {
    variables: {
      taskId,
    },
    onSubscriptionData: () => {
      commentsRefetch( {
          task: taskId,
          page: 1,
          limit: 5,
        });
    }
  } );

  React.useEffect( () => {
    taskRefetch( {
        id: taskId,
      } );
  }, [ taskId ] );

  React.useEffect( () => {
    // TODO: fetch more comments
    commentsRefetch( {
        task: taskId,
        page: 1,
        limit: 5,
      } );
  }, [ taskId ] );

  React.useEffect(() => {
    if (taskData && myProjectsData && basicUsersData){

      setTitle(taskData.task.title);
      setDescription(taskData.task.description);
      setTags( toSelArr( taskData.task.tags ) );
      const status = ( taskData.task.status ? toSelItem( taskData.task.status ) : null )
      setStatus( status );

      const project = taskData.task.project === null ? null : myProjectsData.myProjects.find( ( project ) => project.project.id === taskData.task.project.id );
      setProject( project );

      setRequester(
        taskData.task.requester ? {
          ...taskData.task.requester,
          value: taskData.task.requester.id,
          label: taskData.task.requester.fullName
        } :
        null
      );
      setCompany( ( taskData.task.company ? toSelItem( taskData.task.company ) : null ) );

      const users = toSelArr(basicUsersData.basicUsers, 'fullName');
      const assignableUserIds = users.filter( ( user ) => project && project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) ).map((user) => user.id);
      const assignedUsers = toSelArr( taskData.task.assignedTo, 'fullName' )
        .filter( ( user ) => assignableUserIds.includes( user.id ) );
      setAssignedTo( assignedUsers );

      setDeadline( taskData.task.deadline );

      setSubtasks(taskData.task.subtasks.map( item => ( {
        ...item,
        assignedTo: toSelItem( item.assignedTo, 'fullName' ),
      } ) ) );

      setMaterials(taskData.task.materials);

      if (project){
        let newCustomAttributes = [];
        project.project.viewCustomAttributes.forEach((item, i) => {
          let matchingTaskValue = taskData.task.customAttributes.find((customAttribute) => item.id === customAttribute.customAttribute.id);

          if (!matchingTaskValue){
            matchingTaskValue = {};
          }

          const value = {
            text: matchingTaskValue.text,
            number: matchingTaskValue.number,
            selectValues: matchingTaskValue.selectValues ? matchingTaskValue.selectValues.map((value) => ({...value, label: value.label ? value.label : value.value.substring(0,1).toUpperCase() + value.value.substring(1)})) : [],
          };

          let newAttribute = {
            ...item,
            value,
            selectValues: item.selectValues ? item.selectValues.map((value) => ({...value, label: value.label ? value.label : value.value.substring(0,1).toUpperCase() + value.value.substring(1)})) : [],
            label: item.title.substring(0,1).toUpperCase() + item.title.substring(1),
            canEdit: project.project.editCustomAttributes.some((customAttribute) => item.id === customAttribute.id),
            isEdit: true
          };
          delete newAttribute.__typename;
          newCustomAttributes.push(newAttribute);
        });

        setCustomAttributes(newCustomAttributes.sort((a1, a2) => a1.order < a2.order ? -1 : 1));
      }
    }
  }, [taskLoading, taskData, myProjectsLoading, myProjectsData, basicUsersData, basicUsersLoading]);
/*
  React.useEffect( () => {
    updateToProjectRules( project );
  }, [ project ] );
*/

  const currentUser = getMyData();

  const getCantSave = ( change = {} ) => {
    // TODO: correct this one
    const compare = {
      title,
      status,
      project,
      tags,
      saving,
      ...change,
    }
    return (
      compare.title === "" ||
      compare.status === null ||
      compare.project === null ||
      //invoiced ||
      //( compare.assignedTo.length === 0 && userRights.attributeRights.assigned.view && !projectAttributes.assigned.fixed ) ||
      compare.saving
    )
  }

  const [ updateTask ] = useMutation( UPDATE_TASK );

  //functions
  const updateTaskFunc = ( change, passFunc = null ) => {
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
    //  fromInvoice,
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
              //fromInvoice
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
            //fromInvoice,
          },
          data: {
            task: updatedTask
          }
        } );
        try {
          const filterValues = localFilterToValues(filterData.localFilter);
          const originalProjectId = localProject.id;
          //update tasks if project changed or not
          let execTasks = client.readQuery( {
              query: GET_TASKS,
              variables: {
                filterId: localFilter.id,
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
                  tasks: execTasks.tasks.filter( ( task ) => task.id !== id )
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
      //  addLocalError( err );
      } );

    setSaving( false );
    console.log("End");
  }

  const addAttachment = async (file) => {
    // Check if any file is selected or not
    if (file != null) {
      console.log("appending file");
      // If file selected then create FormData
      let fileToUpload = {
        type: file.mimeType,
        name: file.name,
        uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
      };
      const formData = new FormData();
      formData.append( `file`, fileToUpload );
      formData.append( "token", `Bearer ${localStorage.getItem('acctok')}` );
      formData.append( "taskId", taskId );
      formData.append( "fromInvoice", false );

      // Please change file upload URL
      axios.post( `${REST_URL}/upload-attachments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          transformRequest: (data, headers) => {
            return formData; // this is doing the trick
          },
        } )
        .then( ( response ) => {
          const newAttachments = response.data.attachments.map( ( attachment ) => ( {
            ...attachment,
            __typename: "TaskAttachment",
          } ) )
          const oldTask = client.readQuery( {
              query: GET_TASK,
              variables: {
                id: taskId
              }
            } )
            .task;
          client.writeQuery( {
            query: GET_TASK,
            variables: {
              id: taskId
            },
            data: {
              task: {
                ...oldTask,
                taskAttachments: [ ...oldTask.taskAttachments, ...newAttachments ]
              }
            }
          } )
        } )
    }
  };

  const dataLoading = (
    !currentUser ||
    basicCompaniesLoading ||
    basicUsersLoading ||
    myProjectsLoading ||
    commentsLoading ||
    commentsError ||
    taskLoading
  )

  if (dataLoading){
    return (
      <ScrollView margin="5">

      </ScrollView>
    );
  }

  const invoiced = taskData.task.invoiced;
  const comments = commentsData.comments;
  const attachments = taskData.task.taskAttachments;

  return (
    <ScrollView padding="5" pb="10">

      <Form
        {...props}
        taskId={taskId}
        task={taskData.task}
        currentUser={currentUser}
        accessRights={currentUser ? currentUser.role.accessRights : {}}
        companies={toSelArr(basicCompaniesData.basicCompanies)}
        users={toSelArr(basicUsersData.basicUsers, 'fullName')}
        projects={toSelArr(myProjectsData.myProjects.map((project) => ({...project, id: project.project.id, title: project.project.title}) ))}
        client={client}

        onSubmit={updateTaskFunc}
        updateTask={updateTask}
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

        invoiced={invoiced}

        comments={comments}

        attachments={attachments}
        addAttachment={addAttachment}
         />

    </ScrollView>
  );
}
