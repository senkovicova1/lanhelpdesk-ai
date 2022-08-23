import React, {useState} from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription,
} from "@apollo/client";

import moment from 'moment';
import axios from 'react-native-axios';

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
  ADD_TASK,
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

export default function AddTaskContainer ( props ) {

  const {
    navigation,
  } = props;

  const client = useApolloClient();

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

  const projects = projectsData ? toSelArr(projectsData.myProjects.map((myProject) => ({
    ...myProject.project,
    right: myProject.right,
    attributeRights: myProject.attributeRights,
    users: myProject.usersWithRights
  }) )).filter((project) => project.right.addTask ) : [];

  const initialProject = localProject.id ? projects.find( p => p.id === localProject.id ) : null;
  const initialAssignableUsers = usersData ? toSelArr(usersData.basicUsers, 'fullName').filter( ( user ) => initialProject && initialProject.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) ) : [];

  const [ important, setImportant ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ tags, setTags ] = useState([]);
  const [ project, setProject ] = useState(initialProject);
  const [ status, setStatus ] = React.useState( null );
  const [ requester, setRequester ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ assignedTo, setAssignedTo ] = React.useState( [] );
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

  const cannotSave = (
    saving /*||
    loading ||
    hasAddTaskIssues( {
    ...getTaskData(),
    userRights,
    projectAttributes,
    customAttributes,
    currentUser,
    }, t )*/
  );


  //functions
  const addTaskFunc = () => {

  }

  const addAttachment = (attachment) => {
    const time = moment().valueOf();
    let fileToUpload = {
      type: attachment.mimeType,
      name: attachment.name,
      uri: Platform.OS === 'android' ? attachment.uri : attachment.uri.replace('file://', ''),
      time,
    };
    setAttachments([...attachments, ...newAttachments]);
  }
/*
  const uploadImage = async (file) => {
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

      console.log("posting w/ axios", formData);
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
          console.log("JEEEJ");
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
  };*/

  const currentUserIfInProject = ( project ) => {
    return project && project.users.some( ( userData ) => userData.user.id === currentUser.id ) ? users.find( ( user ) => user.id === currentUser.id ) : null;
  }
  const currentUser = getMyData();

  const dataLoading = (
    !currentUser ||
    basicCompaniesLoading ||
    basicUsersLoading ||
    myProjectsLoading
  )

  if (dataLoading){
    return (
      <ScrollView margin="5">

      </ScrollView>
    );
  }

  return (
    <ScrollView padding="5" pb="10">

      <Form
        {...props}
        addingTask={true}
        currentUser={currentUser}
        accessRights={currentUser ? currentUser.role.accessRights : {}}
        companies={toSelArr(basicCompaniesData.basicCompanies)}
        users={toSelArr(basicUsersData.basicUsers, 'fullName')}
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
         />

    </ScrollView>
  );
}
