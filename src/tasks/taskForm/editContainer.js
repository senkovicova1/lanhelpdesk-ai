import React from 'react';
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
} from '../../helperFunctions/select';

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

export default function EditContainer ( props ) {

  const {
    navigation,
    route,
  } = props;

  const {
    taskId
  } = route.params;

  const client = useApolloClient();

  const currentUser = getMyData();

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

  const dataLoading = (
    basicCompaniesLoading ||
    basicUsersLoading ||
    myProjectsLoading ||
    taskLoading
  )
  console.log(currentUser);
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
         />

    </ScrollView>
  );
}
