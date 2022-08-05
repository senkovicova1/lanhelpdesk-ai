import React from 'react';/*
import {
  useQuery,
  useSubscription,
} from "@apollo/client";*/
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  Pressable,
  ScrollView,
} from "native-base";
/*
import {
  GET_PROJECT,
  GET_FILTER,
} from '../apollo/localSchema/queries';

import {
  GET_TASKS,
  ADD_TASK_SUBSCRIPTION,
} from '../queries/tasks';*/

export default function TaskList ( props ) {
  const {
    navigation
  } = props;
  console.log("HI");
  //local
/*  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
    loading: projectLoading,
  } = useQuery( GET_PROJECT );

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;

  //apollo queries
  const taskVariables = {
    projectId: null,
    milestoneId: null,
    filter: filterVariables,
    sort: {
      asc: true,
      key: 'status'
    },
    stringFilter: null,
    page: 1,
    limit: 30,
  }

  const filterVariables = localFilterToValues( localFilter );

  const localFilterToValues = ( localFilter ) => {
    let filterValues = {
      ...localFilter.filter,
      assignedTos: localFilter.filter.assignedTos.map( ( user ) => user.id ),
      requesters: localFilter.filter.requesters.map( ( user ) => user.id ),
      companies: localFilter.filter.companies.map( ( company ) => company.id ),
      tags: localFilter.filter.tags.map( ( tag ) => tag.id ),
      statuses: localFilter.filter.statuses.map( ( tag ) => tag.id ),
      customAttributes: localFilter.filter.customAttributes.map( ( attribute ) => ( {
        text: attribute.text,
        number: attribute.number,
        selectValues: attribute.selectValues.map((value) => value.id),
        customAttribute: attribute.customAttribute.id
      } ) ),
    }
    delete filterValues.__typename;
    return filterValues;
  }

  //network
  const {
    data: tasksData,
    loading: tasksLoading,
    refetch: tasksRefetchFunc,
  } = useQuery( GET_TASKS, {
    variables: taskVariables,
    notifyOnNetworkStatusChange: true,
  } );

  const tasksRefetch = () => {
    tasksRefetchFunc( taskVariables );
  }

  //refetch tasks
  React.useEffect( () => {
    tasksRefetch();
  }, [ localFilter, localProject.id ] );

  useSubscription( ADD_TASK_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tasksRefetch();
    }
  } );


  const tasks = tasksLoading ? [] : tasksData.tasks.tasks;
  console.log(tasks.map((task) => task.title));*/
  return (
    <ScrollView>
      <Pressable
        onPress={() => navigation.navigate('TaskDetail')}
        margin="5"
        marginBottom="0"
        >
        <Flex direction="row" justify="space-between">
        <Box>
          <Heading variant="list" size="md">Item title</Heading>
          <Text>Item attribute</Text>
        </Box>
        <Box>
          <Text>Item attribute</Text>
          <Text>Item attribute</Text>
        </Box>
      </Flex>
        <Divider mt="5"/>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('TaskDetail')}
        margin="5"
        marginBottom="0"
        >
        <Flex direction="row" justify="space-between">
        <Box>
          <Heading variant="list" size="md">Item title</Heading>
          <Text>Item attribute</Text>
        </Box>
        <Box>
          <Text>Item attribute</Text>
          <Text>Item attribute</Text>
        </Box>
      </Flex>
        <Divider mt="5"/>
      </Pressable>

    </ScrollView>
  );
}
