import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Pressable,
  Text,
} from "native-base";
import {
  AntDesign,
} from '@expo/vector-icons';
import {
  splitArrayByFilter,
  sortBy,
} from '../../helperFunctions/arrays';

import {
  getEmptyGeneralFilter
} from '../../configs/constants';

import {
  GET_MY_FILTERS,
  FILTERS_SUBSCRIPTION,
} from '../../queries/filters';

import {
  GET_PROJECT,
  GET_FILTER,
} from '../../apollo/localSchema/queries';

import {
  setFilter,
} from '../../apollo/localSchema/actions';
import {
  useTranslation
} from "react-i18next";

export default function DrawerContentFilters(props) {

  const {
    navigation
  } = props;

  const {
    t
  } = useTranslation();

  //network
  const {
    data: myFiltersData,
    loading: myFiltersLoading,
    refetch: myFiltersRefetch,
  } = useQuery( GET_MY_FILTERS, {
    fetchPolicy: 'network-only'
  } );

  //local
  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
    loading: projectLoading,
  } = useQuery( GET_PROJECT );


  useSubscription( FILTERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      myFiltersRefetch();
    }
  } );

  React.useEffect( () => {
    if ( !myFiltersLoading ) {
      setFilter( getEmptyGeneralFilter() )
    }
  }, [ myFiltersData, myFiltersLoading ] );
  const localProject = projectData.localProject;
  const localFilter = filterData.localFilter;

  const setLocalFilter = (id) => {
    let applicableFilters = getApplicableFilters();
    const allAvailableFilters = [ ...applicableFilters.publicFilters, ...getProjectFilters(), ...applicableFilters.customFilters ];
    const newFilter = allAvailableFilters.find( item => item.id === id );
    if ( newFilter ) {
      setFilter( newFilter )
    } else {
      setFilter( getEmptyGeneralFilter() )
    }
  }

  const getApplicableFilters = () => {
    if ( myFiltersLoading || projectLoading ) {
      return {
        publicFilters: [],
        customFilters: []
      };
    }
    let [ publicFilters, customFilters ] = splitArrayByFilter( myFiltersData.myFilters, ( filter ) => filter.pub );
    publicFilters = sortBy( publicFilters, [ {
      key: 'order',
      asc: true
    } ] );
    customFilters = sortBy( customFilters, [ {
      key: 'title',
      asc: true
    } ] );

    if ( [null, -1].includes(localProject.id) ) {
      return {
        publicFilters,
        customFilters,
      }
    }
    if ( localProject.id ) {
      return {
        publicFilters: publicFilters.filter( ( myFilter ) => myFilter.global || ( myFilter.project && myFilter.project.id === localProject.id ) ),
        customFilters: customFilters.filter( ( myFilter ) => myFilter.global || ( myFilter.project && myFilter.project.id === localProject.id ) ),
      }
    }
    return {
      publicFilters: [],
      customFilters: []
    };
  }

  const getProjectFilters = () => {
    if ( [null, -1].includes(localProject.id) ) {
      return [];
    }
    return sortBy( localProject.project.projectFilters, [ {
      key: 'order',
      asc: true
    } ] );
  }

  const applicableFilters = getApplicableFilters();

  return (
    <Box>

      <Flex direction="row" alignItems="center"  mx="5">
        <AntDesign name="filter" size={16} color="black" />
        <Heading variant="list" size="md" ml="2">{t('filter')}</Heading>
      </Flex>

      <Pressable
        px="5"
        mt="2"
        key={'all'}
        bgColor={!localFilter.id || 'all' === localFilter.id ? "#dae5ee" : "white"}
        onPress={(e) => {
          setFilter({...getEmptyGeneralFilter(), id: 'all'});
        }}
        >
        <Text fontSize="md">
          {t('allTasks')}
        </Text>
      </Pressable>
      {
        applicableFilters.publicFilters.map((filter) => (
          <Pressable
            key={filter.id}
            px="5"
            mt="2"
            bgColor={filter.id === localFilter.id ? "#dae5ee" : "white"}
            onPress={(e) => {
              setFilter(filter);
            }}
            >
            <Text fontSize="md">
              {filter.title}
            </Text>
          </Pressable>
        ))
      }
      {
        getProjectFilters().map((filter) => (
          <Pressable
            key={filter.id}
            px="5"
            mt="2"
            bgColor={filter.id === localFilter.id ? "#dae5ee" : "white"}
            onPress={(e) => {
              setFilter(filter);
            }}
            >
            <Text fontSize="md">
              {filter.title}
            </Text>
          </Pressable>
        ))
      }
      {
        applicableFilters.customFilters.map((filter) => (
          <Pressable
            key={filter.id}
            px="5"
            mt="2"
            bgColor={filter.id === localFilter.id ? "#dae5ee" : "white"}
            onPress={(e) => {
              setFilter(filter);
            }}
            >
            <Text fontSize="md">
              {filter.title}
            </Text>
          </Pressable>
        ))
      }
      <Pressable
        px="5"
        mt="2"
        key='repeat'
        bgColor={'repeat' === localFilter.id ? "#dae5ee" : "white"}
        onPress={(e) => {
          setFilter({...getEmptyGeneralFilter(), id: 'repeat'});
        }}
        >
        <Text fontSize="md">
          {t('repetitiveTasks')}
        </Text>
      </Pressable>

    </Box>

  );
}
