import React, {
  useState
} from 'react';
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
  Center,
  Flex,
  Heading,
  Text,
  Pressable,
  ScrollView,
  Spinner,
} from "native-base";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Feather
} from '@expo/vector-icons';

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
import {
  useTranslation
} from "react-i18next";

export default function TaskList(props) {
  const {
    navigation,
    markedDate,
    showCalendar,
    search,
  } = props;

  const {
    t
  } = useTranslation();

  //local
  const {
    data: filterData,
    loading: filterLoading
  } = useQuery(GET_FILTER);

  const {
    data: projectData,
    loading: projectLoading,
  } = useQuery(GET_PROJECT);

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;

  const localFilterToValues = (localFilter) => {
    let filterValues = {
      ...localFilter.filter,
      assignedTos: localFilter.filter.assignedTos.map((user) => user.id),
      requesters: localFilter.filter.requesters.map((user) => user.id),
      companies: localFilter.filter.companies.map((company) => company.id),
      tags: localFilter.filter.tags.map((tag) => tag.id),
      statuses: localFilter.filter.statuses.map((tag) => tag.id),
      customAttributes: localFilter.filter.customAttributes.map((attribute) => ({
        text: attribute.text,
        number: attribute.number,
        selectValues: attribute.selectValues.map((value) => value.id),
        customAttribute: attribute.customAttribute.id
      })),
    }
    delete filterValues.__typename;
    return filterValues;
  }

  const filterVariables = localFilterToValues(localFilter);

  const [limit, setLimit] = useState(30);

  //apollo queries
  const taskVariables = {
    projectId: localProject.project.id === -1 ? null : localProject.project.id,
    filter: filterVariables,
    sort: {
      asc: true,
      key: 'status'
    },
    search,
    limit,
  }

  //network
  const {
    data: tasksData,
    loading: tasksLoading,
    refetch: tasksRefetchFunc,
  } = useQuery(GET_TASKS, {
    variables: taskVariables,
    notifyOnNetworkStatusChange: true,
  });

  const tasksRefetch = () => {
    tasksRefetchFunc(taskVariables);
  }

  const {
    data: userDataData,
    loading: userDataLoading,
    refetch: userDataRefetch,
  } = useQuery(GET_MY_DATA, {
    fetchPolicy: 'network-only'
  });

  //refetch tasks
  React.useEffect(() => {
    tasksRefetch();
  }, [localFilter, localProject.id, limit, search]);

  useSubscription(ADD_TASK_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tasksRefetch();
    }
  });

  useSubscription(USER_DATA_SUBSCRIPTION, {
    onSubscriptionData: () => {
      userDataRefetch()
    }
  });

  const timestampToString = (timestamp, trimmed = false, dateOnly = false) => {
    if (trimmed) {
      return moment(parseInt(timestamp)).format('H:mm D.M.YYYY');
    }
    if (dateOnly) {
      return moment(parseInt(timestamp)).format('D.M.YYYY');
    }
    return moment(parseInt(timestamp)).format('HH:mm DD.MM.YYYY');
  }

  let tasks = tasksLoading || !tasksData || !tasksData.tasks ? [] : tasksData.tasks.tasks;
  if (markedDate) {
    tasks = tasks.filter((task) => {
      if (!task.startsAt && !task.deadline) {
        return false;
      }
      if (task.startsAt && !task.deadline) {
        return parseInt(task.startsAt) <= parseInt(markedDate);
      }
      if (!task.startsAt && task.deadline) {
        return parseInt(task.deadline) <= parseInt(markedDate);
      }
      if (task.startsAt && task.deadline) {
        return parseInt(task.startsAt) <= parseInt(markedDate) && parseInt(task.deadline) >= parseInt(markedDate)
      }
    });
  }

  if (tasksLoading) {
    return (
      <ScrollView height={showCalendar ? "55%" : "100%"}>
        <Flex direction="column" mt="5">
          <Spinner size="lg" />
          <Center>
            <Text>{t('loadingTasks')}</Text>
          </Center>
        </Flex>
      </ScrollView>
    )
  }

  return (
    <ScrollView height={showCalendar ? "55%" : "100%"}>

      {
        tasks.length === 0 &&
        <Center mt="20">
          <Text> {t("noTasks")} </Text>
        </Center>
      }

      {
        tasks.map((task) => (
          <Pressable
            key={task.id}
            onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            margin="5"
            marginBottom="0"
          >
            <Flex direction="row" justify="space-between">
              <Box width="60%">
                <Heading variant="list" size="sm">{task.title}</Heading>
                <Text>{`${t('requester')}: ${task.requester.fullName}`}</Text>
                <Text>{`${t('assigned')}: ${task.assignedTo.map((assigned) => assigned.fullName).join(", ")}`}</Text>
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
                {
                  task.startsAt &&
                  <Flex flexDirection="row" alignItems="center">
                    <Feather name="clock" size={12} color="black" mr="2" pr="2" />
                    <Text>
                      {timestampToString(task.startsAt, false, true)}
                    </Text>
                  </Flex>
                }
                {
                  task.deadline &&
                  <Flex flexDirection="row" alignItems="center">
                    <FontAwesome name="warning" size={12} color="red" mr="2" pr="2" />
                    <Text>
                      {timestampToString(task.deadline, false, true)}
                    </Text>
                  </Flex>
                }
              </Box>
            </Flex>
            <Divider mt="5" />
          </Pressable>
        ))
      }

      {
        tasksData &&
        tasksData.tasks.count > limit &&
        <Button
          shadow={2}
          onPress={() => {
            setLimit(limit + 10);
          }}
        >
          {t('loadTasks')}
        </Button>
      }

    </ScrollView >
  );
}