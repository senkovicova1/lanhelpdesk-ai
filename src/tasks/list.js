import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import moment from 'moment';
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  Pressable,
  ScrollView,
} from "native-base";
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

import {
  GET_PROJECT,
  GET_FILTER,
} from '../apollo/localSchema/queries';

import {
  GET_TASKS,
  ADD_TASK_SUBSCRIPTION,
} from '../queries/tasks';

import {
  GET_MY_DATA,
  USER_DATA_SUBSCRIPTION,
} from '../apollo/globalQueries';

export default function TaskList ( props ) {
  const {
    navigation,
    markedDate,
  } = props;

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

  const filterVariables = localFilterToValues( localFilter );
  //apollo queries
  const taskVariables = {
    projectId: localProject.project.id === -1 ? null : localProject.project.id,
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

  const {
    data: userDataData,
    loading: userDataLoading,
    refetch: userDataRefetch,
  } = useQuery( GET_MY_DATA, {
    fetchPolicy: 'network-only'
  } );
      
  //refetch tasks
  React.useEffect( () => {
    tasksRefetch();
  }, [ localFilter, localProject.id ] );

  useSubscription( ADD_TASK_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tasksRefetch();
    }
  } );

  useSubscription( USER_DATA_SUBSCRIPTION, {
    onSubscriptionData: () => {
      userDataRefetch()
    }
  } );

  const timestampToString = ( timestamp, trimmed = false, dateOnly = false ) => {
    if ( trimmed ) {
      return moment( parseInt( timestamp ) ).format( 'H:mm D.M.YYYY' );
    }
    if ( dateOnly ) {
      return moment( parseInt( timestamp ) ).format( 'D.M.YYYY' );
    }
    return moment( parseInt( timestamp ) ).format( 'HH:mm DD.MM.YYYY' );
  }

  let tasks = tasksLoading ? [] : tasksData.tasks.tasks;
  if (markedDate){
    tasks = tasks.filter((task) => (task.startsAt && parseInt(task.startsAt) <= parseInt(markedDate)) || (task.deadline && parseInt(task.deadline) >= parseInt(markedDate)));
  }

  return (
    <ScrollView height="55%">

      {
        tasks.map((task) => (
          <Pressable
            key={task.id}
            onPress={() => navigation.navigate('TaskDetail', {taskId: task.id})}
            margin="5"
            marginBottom="0"
            >
            <Flex direction="row" justify="space-between">
            <Box width="60%">
              <Heading variant="list" size="sm">{task.title}</Heading>
              <Text>{`Requester: ${task.requester.fullName}`}</Text>
              <Text>{`Assigned: ${task.assignedTo.map((assigned) => assigned.fullName).join(", ")}`}</Text>
            </Box>
            <Box>
              <Badge
                color="white"
                bgColor={task.status.color}
                _text={{
                  color: "white"
                }}
                >
                {task.status.title}
              </Badge>
              <Flex flexDirection="row" alignItems="center">
                <MaterialCommunityIcons name="asterisk" size={12} color="black" mr="2" pr="2"/>
                <Text>
                  {timestampToString(task.createdAt, false, true)}
                </Text>
              </Flex>
              {
                task.deadline &&
                <Flex flexDirection="row" alignItems="center">
                  <FontAwesome name="warning" size={12} color="red" mr="2" pr="2"/>
                  <Text>
                    {timestampToString(task.deadline, false, true)}
                  </Text>
                </Flex>
              }
            </Box>
          </Flex>
            <Divider mt="5"/>
          </Pressable>
        ))
      }

    </ScrollView>
  );
}
