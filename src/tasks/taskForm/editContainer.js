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

/*
import {
  GET_TRIP_TYPES,
  TRIP_TYPES_SUBSCRIPTION,
} from 'helpdesk/settings/tripTypes/queries';
*/

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

export default function EditContainer ( props ) {

  const {
    navigation,
    route,
  } = props;

  const {
    taskId
  } = route.params;

  const client = useApolloClient();

  const [ important, setImportant ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ tags, setTags ] = useState([]);
  const [ project, setProject ] = useState({});
  const [ status, setStatus ] = React.useState( null );

  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ potentialPendingStatus, setPotentialPendingStatus ] = React.useState( null );
  const [ pendingChangable, setPendingChangable ] = React.useState( null );

  const [ closeDate, setCloseDate ] = useState(false);

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

  React.useEffect( () => {
    taskRefetch( {
        id: taskId,
      } );
  }, [ taskId ] );


  React.useEffect(() => {
    if (taskData && myProjectsData){

      setTitle(taskData.task.title);
      setDescription(taskData.task.description);
      setTags( toSelArr( taskData.task.tags ) );
      const status = ( taskData.task.status ? toSelItem( taskData.task.status ) : null )
      setStatus( status );

      const project = taskData.task.project === null ? null : myProjectsData.myProjects.find( ( project ) => project.project.id === taskData.task.project.id );
      setProject( project );
    }
  }, [taskLoading, taskData, myProjectsLoading, myProjectsData]);

  const currentUser = getMyData();

  //functions
  const getCantSave = ( change = {} ) => {
    const compare = {
      title,
      status,
      tags,
      saving,
      ...change,
    }
    return (
      compare.title === "" ||
      //compare.status === null ||
      //compare.project === null ||
      //invoiced ||
      //( compare.assignedTo.length === 0 && userRights.attributeRights.assigned.view && !projectAttributes.assigned.fixed ) ||
      compare.saving
    )
  }

  const [ updateTask ] = useMutation( UPDATE_TASK );

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
  }

  const dataLoading = (
    !currentUser ||
    basicCompaniesLoading ||
    basicUsersLoading ||
    myProjectsLoading ||
    taskLoading
  )

  if (dataLoading){
    return (
      <ScrollView margin="5">

      </ScrollView>
    );
  }

  return (
    <ScrollView margin="5">

      <Form
        taskId={taskId}
        task={taskData.task}
        currentUser={currentUser}
        accessRights={currentUser ? currentUser.role.accessRights : {}}
        companies={toSelArr(basicCompaniesData.basicCompanies)}
        users={toSelArr(basicUsersData.basicUsers, 'fullName')}
        projects={toSelArr(myProjectsData.myProjects.map((project) => ({...project, id: project.project.id, title: project.project.title}) ))}
        client={client}
        autoUpdateTask={autoUpdateTask}

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

        setSaving={setSaving}
        updateTask={updateTask}
         />

    </ScrollView>
  );
}
