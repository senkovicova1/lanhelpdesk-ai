import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";

import { ScrollView, View, Pressable, Spinner, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, TextArea } from "native-base";

import {
  getMyData,
} from '../../../helperFunctions/userData';

import {
  toSelArr,
} from '../../../helperFunctions/select';

import TaskAdd from './addContainer';
import ProjectSelectModal from './projectSelectModal';

import {
  GET_BASIC_USERS,
  USERS_SUBSCRIPTION,
} from '../../../queries/users';

import {
  GET_BASIC_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from '../../../queries/companies';

import {
  GET_MY_PROJECTS,
  PROJECTS_SUBSCRIPTION,
} from '../../../queries/projects';

import {
  ADD_TASK,
} from '../../../queries/tasks';

import {
  GET_PROJECT,
} from '../../../apollo/localSchema/queries';

export default function TaskAddContainer( props ) {

  //local
  const {
    data: projectData,
    loading: projectLoading,
  } = useQuery( GET_PROJECT );

  const localProject = projectData.localProject;

  //data & queries
  const {
    data: companiesData,
    loading: companiesLoading,
    refetch: companiesRefetch,
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch,
  } = useQuery( GET_BASIC_USERS, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: projectsData,
    loading: projectsLoading,
    refetch: projectsRefetch,
  } = useQuery( GET_MY_PROJECTS, {
    fetchPolicy: 'network-only'
  } );

  //mutations
  const [ addTask ] = useMutation( ADD_TASK );

  //subscriptions
  useSubscription( PROJECTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      projectsRefetch();
    }
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      companiesRefetch();
    }
  } );

  useSubscription( USERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      usersRefetch();
    }
  } );

  //state
  const [ projectID, setProjectID ] = React.useState( localProject.project.id === -1 ? null : localProject.project.id );
  const [ showModal, setShowModal ] = React.useState( true );

  React.useEffect( () => {
    setProjectID( localProject.project.id === -1 ? null : localProject.project.id );
    setShowModal( localProject.project.id === -1 );
  }, [ localProject ] );

  const currentUser = getMyData();

  const loading = (
    companiesLoading ||
    usersLoading ||
    projectsLoading ||
    !currentUser
  );

  if ( projectID === null ) {
    return (
      <ProjectSelectModal
        navigation={props.navigation}
        projects={
          loading ? [] :
          toSelArr(projectsData.myProjects.map((myProject) => ({
            ...myProject.project,
            right: myProject.right,
            attributeRights: myProject.attributeRights,
            users: myProject.usersWithRights.map((userWithRights) => userWithRights.user.id)
          }) )).filter((project) => project.right.addTask )
        }
        onSubmit= {(projectID) => {
          setProjectID(projectID);
        }}
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        />
    )
  }

  if (loading){
    return (
      <ScrollView m="5">
        <Spinner size="lg" />
      </ScrollView>
     );
  }

  return (
    <TaskAdd
      {...props}
      projectID={projectID}
      loading={loading}
      projects={
        loading ? [] :
        toSelArr(projectsData.myProjects.map((myProject) => ({
          ...myProject.project,
          right: myProject.right,
          attributeRights: myProject.attributeRights,
          users: myProject.usersWithRights
        }) )).filter((project) => project.right.addTask )
      }
      myProjects={loading ? [] : projectsData.myProjects}
      users={ usersData ? toSelArr(usersData.basicUsers, 'fullName') : [] }
      companies={ loading ? [] : toSelArr(companiesData.basicCompanies) }
      currentUser={ currentUser }
      defaultUnit={null}
      addTask={addTask}
    />
  )

}
